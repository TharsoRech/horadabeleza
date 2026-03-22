import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SubscriptionModalStyles as styles } from "@/app/Styles/SubscriptionModalStyles";
import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";
import { COLORS } from "@/constants/theme";
import { Subscription } from "@/app/Models/Subscription";
import { Plan } from "@/app/Models/Plan";

interface Props {
    visible: boolean;
    onClose: () => void;
    isTrialEligible: boolean;
    currentSubscription?: Subscription | null;
    onSubscriptionSuccess: (newSub: Subscription) => void;
}

export const SubscriptionModal = ({ visible, onClose, isTrialEligible, currentSubscription, onSubscriptionSuccess }: Props) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estado para novo cartão caso não tenha salvo
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

    const subRepo = useMemo(() => new SubscriptionRepository(), []);
    const hasActiveSubscription = Boolean(currentSubscription?.isActive && currentSubscription.planType !== 'none');
    const canCancelSubscription = currentSubscription?.canCancel ?? hasActiveSubscription;
    const canUpgradeSubscription = currentSubscription?.canUpgrade ?? hasActiveSubscription;

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

    // --- FORMATAÇÕES ---
    const formatCardNumber = (text: string) => {
        return text.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        return cleaned.slice(0, 5);
    };

    const handleConfirmSubscription = async () => {
        if (!selectedPlan) return;

        // Validação se for plano pago e não tiver cartão salvo/digitado
        if (selectedPlan.type === 'paid' && savedCards.length === 0) {
            if (cardData.number.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
                Alert.alert("Erro", "Por favor, insira dados de cartão válidos.");
                return;
            }
        }

        setIsProcessing(true);
        try {
            let updatedSub: Subscription;
            const newCardPayload = savedCards.length === 0 ? cardData : undefined;

            if (selectedPlan.type === 'trial') {
                updatedSub = await subRepo.activateFreeTrial();
            } else if (hasActiveSubscription) {
                updatedSub = await subRepo.upgradeSubscription(selectedPlan.id, newCardPayload);
            } else {
                updatedSub = await subRepo.processPaidSubscription(selectedPlan.id, newCardPayload);
            }

            onSubscriptionSuccess(updatedSub);
            onClose();
            Alert.alert(
                "Sucesso!",
                hasActiveSubscription
                    ? `Upgrade para ${selectedPlan.name} concluído com sucesso.`
                    : `${selectedPlan.name} ativado com sucesso.`
            );
        } catch {
            Alert.alert("Erro", "Não foi possível processar a assinatura. Verifique os dados do cartão.");
        } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
            setCardData({ number: '', expiry: '', cvv: '' });
        }
    };

    const handleCancelSubscription = () => {
        Alert.alert(
            'Cancelar assinatura',
            'Deseja realmente cancelar sua assinatura atual? Esta ação pode remover benefícios imediatamente.',
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Cancelar assinatura',
                    style: 'destructive',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            const updatedSub = await subRepo.cancelSubscription();
                            onSubscriptionSuccess(updatedSub);
                            onClose();
                            Alert.alert('Assinatura cancelada', 'Sua assinatura foi cancelada com sucesso.');
                        } catch {
                            Alert.alert('Erro', 'Não foi possível cancelar a assinatura neste momento.');
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
        </Modal>
    );
};