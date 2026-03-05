import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SubscriptionModalStyles as styles } from "@/app/Styles/SubscriptionModalStyles";
import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";
import { COLORS } from "@/constants/theme";
import {Subscription} from "@/app/Models/Subscription";
import {Plan} from "@/app/Models/Plan";

interface Props {
    visible: boolean;
    onClose: () => void;
    isTrialEligible: boolean;
    onSubscriptionSuccess: (newSub: Subscription) => void;
}

export const SubscriptionModal = ({ visible, onClose, isTrialEligible, onSubscriptionSuccess }: Props) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const subRepo = new SubscriptionRepository();

    useEffect(() => {
        if (visible) loadPlans();
    }, [visible]);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await subRepo.getAvailablePlans();
            const filtered = data.filter(p => p.type === 'paid' || (p.type === 'trial' && isTrialEligible));
            setPlans(filtered);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSubscription = async () => {
        if (!selectedPlan) return;
        setIsProcessing(true);

        try {
            let updatedSub: Subscription;
            if (selectedPlan.id === 'trial') {
                updatedSub = await subRepo.activateFreeTrial();
            } else {
                updatedSub = await subRepo.processPaidSubscription(selectedPlan.id);
            }

            onSubscriptionSuccess(updatedSub);
            onClose();
        } catch (e) {
            Alert.alert("Erro", "Não foi possível processar a assinatura.");
        } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
        }
    };

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
                                    <Text style={styles.label}>Dados do Cartão de Crédito</Text>
                                    <TextInput style={styles.input} placeholder="Número do Cartão" keyboardType="numeric" />
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <TextInput style={[styles.input, {flex: 2}]} placeholder="MM/AA" keyboardType="numeric" />
                                        <TextInput style={[styles.input, {flex: 1}]} placeholder="CVV" keyboardType="numeric" />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.trialBox}>
                                    <Ionicons name="gift-outline" size={40} color="#4CAF50" />
                                    <Text style={styles.trialText}>
                                        Você ganhará **30 dias de acesso total** para testar a plataforma com até 50 clientes.
                                    </Text>
                                </View>
                            )}

                            <Text style={styles.termsText}>Ao confirmar, você aceita os termos de uso e políticas do aplicativo.</Text>

                            <TouchableOpacity
                                style={[styles.confirmBtn, { backgroundColor: selectedPlan.color }]}
                                onPress={handleConfirmSubscription}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.confirmBtnText}>Ativar Plano Agora</Text>}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};