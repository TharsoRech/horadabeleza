import {Subscription} from "../Models/Subscription";
import {ISubscriptionRepository} from "@/app/Repository/Interfaces/ISubscriptionRepository";
import {Plan} from "@/app/Models/Plan";
import {COLORS} from "@/constants/theme";

export class SubscriptionRepository implements ISubscriptionRepository {
    async getSubscription(): Promise<Subscription> {
        // Simulando chamada de API/Firebase
        return new Promise((resolve) => {
            setTimeout(() => {
                // Caso 1: Usuário sem plano (Inativo)
                resolve({
                    id: "sub_001",
                    isActive: false,
                    planType: 'none',
                    maxClients: 0,
                    currentClients: 0,
                    // trialStartDate: undefined, // Nunca usou trial
                });

                /* // Caso 2: Para TESTAR o Plano FREE (Trial) ativo com 20 dias restantes:
                resolve({
                    id: "sub_trial",
                    isActive: true,
                    planType: 'trial',
                    maxClients: 50,
                    currentClients: 15,
                    trialStartDate: new Date().toISOString(),
                    trialEndDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
                    startDate: new Date().toISOString(),
                });
                */
            }, 500);
        });
    }

    async getAvailablePlans(): Promise<Plan[]> {
        // Agora os dados vêm do "serviço" e não do componente UI
        return [
            {
                id: 'trial',
                title: 'Período de Teste',
                price: 'Grátis',
                desc: 'Acesso total por 30 dias',
                icon: 'clock-outline',
                color: '#4CAF50',
                type: 'trial'
            },
            {
                id: 'basic',
                title: 'Plano Basic',
                price: 'R$ 50,00/mês',
                desc: 'Gerencie até 50 clientes',
                icon: 'account-group-outline',
                color: COLORS.primary,
                type: 'paid'
            },
            {
                id: 'premium',
                title: 'Plano Premium',
                price: 'R$ 100,00/mês',
                desc: 'Mais de 100 clientes',
                icon: 'crown-outline',
                color: '#FFD700',
                type: 'paid'
            }
        ];
    }

    async activateTrial(): Promise<void> {
        console.log("Trial Ativado");
    }

    async activateFreeTrial(): Promise<Subscription> {
        const now = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(now.getDate() + 30);

        // Simulação de persistência ou chamada de API
        const newTrialSub: Subscription = {
            id: "sub_trial_" + Math.random().toString(36).substr(2, 9),
            isActive: true, // Trial ativa-se imediatamente
            planType: 'trial',
            maxClients: 50,
            currentClients: 0,
            startDate: now.toISOString(),
            trialStartDate: now.toISOString(),
            trialEndDate: thirtyDaysLater.toISOString(),
        };

        // Aqui chamarias o teu serviço para guardar no Firebase/BD
        console.log("Trial Ativado até:", thirtyDaysLater.toISOString());

        return newTrialSub;
    }

    async getSavedCards(): Promise<any[]> {
        return [
            { id: '1', brand: 'visa', last4: '4242', expiry: '12/28' }
        ];
    }

    async saveCard(cardData: any): Promise<void> {
        console.log("Cartão salvo:", cardData);
    }

    async deleteCard(cardId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    async setDefaultCard(cardId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    async processPaidSubscription(
        planId: string,
        newCardData?: { number: string, expiry: string, cvv: string }
    ): Promise<Subscription> {
        try {
            console.log(`A processar pagamento para o plano: ${planId}`);

            if (newCardData) {
                console.log("Pagamento com novo cartão final:", newCardData.number.slice(-4));
                // Lógica para enviar dados ao gateway (Stripe/etc)
            }

            // Simula latência de rede/banco
            await new Promise(resolve => setTimeout(resolve, 2000));

            const now = new Date();
            const nextBilling = new Date();
            nextBilling.setMonth(now.getMonth() + 1);

            // Define limites com base no plano
            const limits = planId === 'premium' ? 500 : 100;

            const updatedSub: Subscription = {
                id: "sub_paid_" + Math.random().toString(36).substr(2, 9),
                isActive: true,
                planType: planId as 'basic' | 'premium',
                maxClients: limits,
                currentClients: 0,
                startDate: now.toISOString(),
                nextBillingDate: nextBilling.toISOString(),
                // No plano pago, trialStartDate e trialEndDate podem ser null ou omitidos
                trialStartDate: undefined,
                trialEndDate: undefined
            };

            console.log("Assinatura paga processada com sucesso!");

            return updatedSub;

        } catch (error) {
            console.error("Erro no processamento da assinatura:", error);
            throw new Error("Não foi possível processar o pagamento. Verifique os dados do cartão.");
        }
    }
}