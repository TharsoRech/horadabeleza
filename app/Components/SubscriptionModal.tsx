import React, { useEffect, useState } from 'react';
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
    onSubscriptionSuccess: (newSub: Subscription) => void;
}

export const SubscriptionModal = ({ visible, onClose, isTrialEligible, onSubscriptionSuccess }: Props) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estado para novo cartão caso não tenha salvo
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

    const subRepo = new SubscriptionRepository();

    useEffect(() => {
        if (visible) loadInitialData();
    }, [visible]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [plansData, cardsData] = await Promise.all([
                subRepo.getAvailablePlans(),
                subRepo.getSavedCards()
            ]);

            const filtered = plansData.filter(p => p.type === 'paid' || (p.type === 'trial' && isTrialEligible));
            setPlans(filtered);
            setSavedCards(cardsData || []);
        } catch (e) {
            console.error("Erro ao carregar dados da assinatura", e);
        } finally {
            setLoading(false);
        }
    };

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

            if (selectedPlan.id === 'trial') {
                updatedSub = await subRepo.activateFreeTrial();
            } else {
                // Aqui passamos o ID do plano e, se houver novo cartão, os dados dele
                updatedSub = await subRepo.processPaidSubscription(selectedPlan.id, cardData);
            }

            onSubscriptionSuccess(updatedSub);
            onClose();
            Alert.alert("Sucesso!", `${selectedPlan.title} ativado com sucesso.`);
        } catch (e) {
            Alert.alert("Erro", "Não foi possível processar a assinatura. Verifique os dados do cartão.");
        } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
            setCardData({ number: '', expiry: '', cvv: '' });
        }
    };

    const defaultCard = savedCards.find(c => c.isDefault) || savedCards[0];

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{selectedPlan ? 'Confirmar Plano' : 'Escolha um Plano'}</Text>
                        <TouchableOpacity onPress={selectedPlan ? () => setSelectedPlan(null) : onClose}>
                            <Ionicons name={selectedPlan ? "arrow-back" : "close"} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 30 }} />
                    ) : !selectedPlan ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.subtitle}>Sua unidade precisa de uma assinatura ativa para ser publicada no catálogo.</Text>
                            {plans.map((plan) => (
                                <TouchableOpacity key={plan.id} style={styles.planCard} onPress={() => setSelectedPlan(plan)}>
                                    <View style={[styles.iconBadge, { backgroundColor: plan.color + '20' }]}>
                                        <MaterialCommunityIcons name={plan.icon as any} size={30} color={plan.color} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 15 }}>
                                        <Text style={styles.planTitle}>{plan.title}</Text>
                                        <Text style={styles.planDesc}>{plan.desc}</Text>
                                        <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={{ padding: 10 }}>
                            <View style={styles.summaryBox}>
                                <Text style={styles.summaryLabel}>Plano Selecionado:</Text>
                                <Text style={[styles.summaryValue, { color: selectedPlan.color }]}>{selectedPlan.title}</Text>
                                <Text style={styles.summaryPrice}>{selectedPlan.price}</Text>
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
                                        {selectedPlan.type === 'trial' ? 'Começar Teste Grátis' : 'Confirmar Assinatura'}
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