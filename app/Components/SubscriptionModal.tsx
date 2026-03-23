import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SubscriptionModalStyles as styles } from "@/app/Styles/SubscriptionModalStyles";
import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";
import { COLORS } from "@/constants/theme";
import { Subscription } from "@/app/Models/Subscription";
import { Plan } from "@/app/Models/Plan";
import CustomAlert from './CustomAlert';

interface Props {
    visible: boolean;
    onClose: () => void;
    isTrialEligible: boolean;
    currentSubscription?: Subscription | null;
    onSubscriptionSuccess: (newSub: Subscription) => void | Promise<void>;
}

export const SubscriptionModal = ({ visible, onClose, isTrialEligible, currentSubscription, onSubscriptionSuccess }: Props) => {
    const pendingAfterAlertActionRef = useRef<(() => void) | null>(null);
    const [inlineAlert, setInlineAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons?: { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }[];
    }>({ visible: false, title: '', message: '', buttons: undefined });
    const [plans, setPlans] = useState<Plan[]>([]);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estado para novo cartão caso não tenha salvo
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

    const subRepo = useMemo(() => new SubscriptionRepository(), []);
    const hasActiveSubscription = Boolean(currentSubscription?.isActive && currentSubscription.planType !== 'none');
    const normalizedCurrentPlanType = (currentSubscription?.planType || '').toLowerCase();
    const normalizedCurrentPlanName = (currentSubscription?.planName || '').toLowerCase();
    const isFreeLikeCurrentPlan =
        normalizedCurrentPlanType === 'trial' ||
        normalizedCurrentPlanName.includes('starter') ||
        normalizedCurrentPlanName.includes('free') ||
        normalizedCurrentPlanName.includes('trial');
    const canCancelSubscription = (currentSubscription?.canCancel ?? hasActiveSubscription) && !isFreeLikeCurrentPlan;
    const canUpgradeSubscription = currentSubscription?.canUpgrade ?? hasActiveSubscription;

    const showInlineAlert = useCallback((
        title: string,
        message: string,
        buttons?: { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }[]
    ) => {
        // Qualquer novo alerta invalida ações pendentes anteriores.
        pendingAfterAlertActionRef.current = null;
        setInlineAlert({ visible: true, title, message, buttons });
    }, []);

    const closeInlineAlert = useCallback(() => {
        const pendingAction = pendingAfterAlertActionRef.current;
        pendingAfterAlertActionRef.current = null;
        setInlineAlert({ visible: false, title: '', message: '', buttons: undefined });

        // Executa ações pendentes no próximo tick para evitar corrida entre fechamento do
        // CustomAlert e fechamento/sincronização do modal pai.
        if (pendingAction) {
            setTimeout(() => pendingAction(), 0);
        }
    }, []);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [plansData, cardsData] = await Promise.all([
                subRepo.getAvailablePlans(),
                subRepo.getSavedCards()
            ]);

            const filtered = plansData.filter((plan) => {
                if (hasActiveSubscription) {
                    if (!canUpgradeSubscription) return false;

                    const samePlan = Boolean(
                        (currentSubscription?.planId && currentSubscription.planId === plan.id) ||
                        (currentSubscription?.planName && currentSubscription.planName.toLowerCase() === plan.name.toLowerCase())
                    );
                    return plan.type === 'paid' && !samePlan;
                }

                if (plan.type === 'trial') {
                    return isTrialEligible;
                }

                return true;
            });

            setPlans(filtered);
            setSavedCards(cardsData || []);
        } catch (e) {
            console.error("Erro ao carregar dados da assinatura", e);
        } finally {
            setLoading(false);
        }
    }, [canUpgradeSubscription, currentSubscription?.planId, currentSubscription?.planName, hasActiveSubscription, isTrialEligible, subRepo]);

    useEffect(() => {
        if (visible) loadInitialData();
    }, [visible, loadInitialData]);

    useEffect(() => {
        if (!visible) {
            // Garante que nenhum overlay local continue bloqueando toques na Profile.
            pendingAfterAlertActionRef.current = null;
            closeInlineAlert();
            setSelectedPlan(null);
            setIsProcessing(false);
        }
    }, [visible, closeInlineAlert]);

    // --- FORMATAÇÕES ---
    const formatCardNumber = (text: string) => {
        return text.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        return cleaned.slice(0, 5);
    };

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error && error.message) {
            return error.message;
        }
        return 'Não foi possível processar a assinatura. Verifique os dados do cartão.';
    };

    const getSuccessMessage = (updatedSub: Subscription, requestedPlan: Plan): string => {
        const apiPlanName = updatedSub.planName || requestedPlan.name;

        if (requestedPlan.type === 'trial') {
            if (updatedSub.trialEndDate) {
                return `Plano Starter ativado com sucesso! Seu período de teste vai até ${new Date(updatedSub.trialEndDate).toLocaleDateString('pt-BR')}.`;
            }
            return 'Plano Starter ativado com sucesso!';
        }

        if (hasActiveSubscription) {
            return `Upgrade para o plano ${apiPlanName} realizado com sucesso!`;
        }

        return `Assinatura do plano ${apiPlanName} ativada com sucesso!`;
    };

    const queueCloseAndSyncAfterAlert = useCallback((updatedSub: Subscription) => {
        pendingAfterAlertActionRef.current = () => {
            onClose();
            Promise.resolve(onSubscriptionSuccess(updatedSub)).catch((syncError) => {
                console.error('Erro ao sincronizar assinatura após confirmação:', syncError);
            });
        };
    }, [onClose, onSubscriptionSuccess]);

    const handleConfirmSubscription = async () => {
        if (!selectedPlan) {
            showInlineAlert('Atenção', 'Selecione um plano antes de confirmar.');
            return;
        }

        const requestedPlan = selectedPlan;

        console.log('📌 Confirmando assinatura para plano:', {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            planType: selectedPlan.type,
            hasActiveSubscription,
            hasSavedCards: savedCards.length > 0
        });

        // Validação se for plano pago e não tiver cartão salvo/digitado
        if (selectedPlan.type === 'paid' && savedCards.length === 0) {
            if (cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
                showInlineAlert("Erro", "Por favor, insira dados de cartão válidos.");
                return;
            }
        }

        setIsProcessing(true);
        try {
            let updatedSub: Subscription;
            const newCardPayload = savedCards.length === 0 ? cardData : undefined;

            if (requestedPlan.type === 'trial') {
                console.log('➡️ Chamando endpoint de trial');
                updatedSub = await subRepo.activateFreeTrial();
            } else if (hasActiveSubscription) {
                console.log('➡️ Chamando endpoint de upgrade');
                updatedSub = await subRepo.upgradeSubscription(requestedPlan.id, newCardPayload);
            } else {
                console.log('➡️ Chamando endpoint de assinatura paga');
                updatedSub = await subRepo.processPaidSubscription(requestedPlan.id, newCardPayload);
            }

            showInlineAlert(
                'Sucesso',
                getSuccessMessage(updatedSub, requestedPlan),
                [
                    {
                        text: 'Entendi'
                    }
                ]
            );
            queueCloseAndSyncAfterAlert(updatedSub);
        } catch (error) {
            console.error('❌ Falha ao confirmar assinatura:', error);
            showInlineAlert('Erro', getErrorMessage(error));
        } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
            setCardData({ number: '', expiry: '', cvv: '' });
        }
    };

    const handleCancelSubscription = () => {
        if (isFreeLikeCurrentPlan) {
            showInlineAlert('Plano Free', 'Planos Starter/Free nao podem ser cancelados.');
            return;
        }

        showInlineAlert(
            'Cancelar assinatura',
            'Deseja realmente cancelar sua assinatura atual? Qualquer unidade que estiver publicada deixará de ser publicada automaticamente e os benefícios podem ser removidos imediatamente.',
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Cancelar assinatura',
                    style: 'destructive',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            const updatedSub = await subRepo.cancelSubscription();
                            showInlineAlert(
                                'Sucesso',
                                'Assinatura cancelada com sucesso. Unidades publicadas serão despublicadas automaticamente.',
                                [{ text: 'Entendi' }]
                            );
                            queueCloseAndSyncAfterAlert(updatedSub);
                        } catch {
                            showInlineAlert('Erro', 'Não foi possível cancelar a assinatura neste momento.');
                        } finally {
                            setIsProcessing(false);
                        }
                    }
                }
            ]
        );
    };

    const defaultCard = savedCards.find(c => c.isDefault) || savedCards[0];
    const currentPlanLabel = currentSubscription?.planName || currentSubscription?.planType?.toUpperCase();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{selectedPlan ? 'Confirmar Plano' : hasActiveSubscription ? 'Gerenciar Assinatura' : 'Escolha um Plano'}</Text>
                        <TouchableOpacity onPress={selectedPlan ? () => setSelectedPlan(null) : onClose}>
                            <Ionicons name={selectedPlan ? "arrow-back" : "close"} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 30 }} />
                    ) : !selectedPlan ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.subtitle}>
                                {hasActiveSubscription
                                    ? canUpgradeSubscription
                                        ? `Plano atual: ${currentPlanLabel || 'Ativo'}. Você pode fazer upgrade ou cancelar.`
                                        : `Plano atual: ${currentPlanLabel || 'Ativo'}. Upgrade indisponível no momento.`
                                    : 'Sua unidade precisa de uma assinatura ativa para ser publicada no catálogo.'}
                            </Text>

                            {hasActiveSubscription && canCancelSubscription && (
                                <TouchableOpacity
                                    onPress={handleCancelSubscription}
                                    disabled={isProcessing}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#FFCDD2',
                                        backgroundColor: '#FFF5F5',
                                        borderRadius: 12,
                                        padding: 14,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Ionicons name="close-circle-outline" size={20} color="#E53935" />
                                        <Text style={{ color: '#E53935', fontWeight: '700' }}>Cancelar assinatura atual</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#E53935" />
                                </TouchableOpacity>
                            )}

                            {plans.length === 0 && (
                                <View style={{ paddingVertical: 24 }}>
                                    <Text style={{ textAlign: 'center', color: '#777' }}>
                                        {hasActiveSubscription
                                            ? 'Nenhum plano de upgrade disponível no momento.'
                                            : 'Nenhum plano disponível agora. Tente novamente em instantes.'}
                                    </Text>
                                </View>
                            )}

                            {plans.map((plan) => (
                                <TouchableOpacity key={plan.id} style={styles.planCard} onPress={() => setSelectedPlan(plan)}>
                                    <View style={[styles.iconBadge, { backgroundColor: plan.color + '20' }]}>
                                        <MaterialCommunityIcons name={plan.icon as any} size={30} color={plan.color} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 15 }}>
                                        <Text style={styles.planTitle}>{plan.name}</Text>
                                        <Text style={styles.planDesc}>{plan.description}</Text>
                                        <Text style={[styles.planPrice, { color: plan.color }]}>{plan.displayPrice}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={{ padding: 10 }}>
                            <View style={styles.summaryBox}>
                                <Text style={styles.summaryLabel}>Plano Selecionado:</Text>
                                <Text style={[styles.summaryValue, { color: selectedPlan.color }]}>{selectedPlan.name}</Text>
                                <Text style={styles.summaryPrice}>{selectedPlan.displayPrice}</Text>
                            </View>

                            {selectedPlan.type === 'paid' ? (
                                <View style={{ marginTop: 20 }}>
                                    <Text style={[styles.label, { marginBottom: 8 }]}>Método de Pagamento</Text>

                                    {defaultCard ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9F0', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CEEAD6', marginBottom: 15 }}>
                                            <MaterialCommunityIcons name="credit-card-check" size={24} color="#4CAF50" />
                                            <Text style={{ marginLeft: 10, flex: 1, fontWeight: '500' }}>
                                                Usar cartão final {defaultCard.last4} (Padrão)
                                            </Text>
                                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                        </View>
                                    ) : (
                                        <View style={{ gap: 10 }}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Número do Cartão"
                                                keyboardType="numeric"
                                                value={cardData.number}
                                                onChangeText={(t) => setCardData({...cardData, number: formatCardNumber(t)})}
                                                maxLength={19}
                                            />
                                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                                <TextInput
                                                    style={[styles.input, {flex: 2}]}
                                                    placeholder="MM/AA"
                                                    keyboardType="numeric"
                                                    value={cardData.expiry}
                                                    onChangeText={(t) => setCardData({...cardData, expiry: formatExpiry(t)})}
                                                    maxLength={5}
                                                />
                                                <TextInput
                                                    style={[styles.input, {flex: 1}]}
                                                    placeholder="CVV"
                                                    keyboardType="numeric"
                                                    value={cardData.cvv}
                                                    onChangeText={(t) => setCardData({...cardData, cvv: t.replace(/\D/g, '')})}
                                                    maxLength={4}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.trialBox}>
                                    <Ionicons name="gift-outline" size={40} color="#4CAF50" />
                                    <Text style={styles.trialText}>
                                        Você ganhará <Text style={{fontWeight: 'bold'}}>30 dias de acesso total</Text> para testar a plataforma.
                                    </Text>
                                </View>
                            )}

                            <Text style={styles.termsText}>Ao confirmar, você aceita os termos de uso e a cobrança recorrente no plano selecionado.</Text>

                            <TouchableOpacity
                                style={[styles.confirmBtn, { backgroundColor: selectedPlan.color, opacity: isProcessing ? 0.7 : 1 }]}
                                onPress={handleConfirmSubscription}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.confirmBtnText}>
                                        {selectedPlan.type === 'trial'
                                            ? 'Começar Teste Grátis'
                                            : hasActiveSubscription
                                                ? 'Confirmar Upgrade'
                                                : 'Confirmar Assinatura'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <CustomAlert
                visible={visible && inlineAlert.visible}
                title={inlineAlert.title}
                message={inlineAlert.message}
                buttons={inlineAlert.buttons}
                onConfirm={closeInlineAlert}
            />
        </Modal>
    );
};