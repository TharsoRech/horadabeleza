import {Subscription} from "../Models/Subscription";
import {ISubscriptionRepository} from "@/app/Repository/Interfaces/ISubscriptionRepository";
import {Plan} from "@/app/Models/Plan";
import {COLORS} from "@/constants/theme";
import { apiClient } from "@/app/Utils/apiClient";
import { SubscriptionResponse, PlanResponse } from "@/app/Types/apiTypes";

export class SubscriptionRepository implements ISubscriptionRepository {
    async getSubscription(): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.get('/subscriptions/current');
            
            // Converte a resposta da API para o modelo Subscription
            const subscription: Subscription = {
                id: response.id,
                isActive: response.isActive,
                planType: response.planType as 'none' | 'trial' | 'basic' | 'premium',
                maxClients: response.maxClients,
                currentClients: response.currentClients,
                startDate: response.startDate,
                trialStartDate: response.trialStartDate,
                trialEndDate: response.trialEndDate,
                nextBillingDate: response.nextBillingDate
            };

            return subscription;
        } catch (error) {
            console.error('Get subscription error:', error);
            // Retorna um plano inativo como fallback
            return {
                id: "sub_001",
                isActive: false,
                planType: 'none',
                maxClients: 0,
                currentClients: 0
            };
        }
    }

    async getAvailablePlans(): Promise<Plan[]> {
        try {
            const response: PlanResponse[] = await apiClient.get('/plans');
            
            // Converte as respostas da API para o modelo Plan
            const plans: Plan[] = response.map(plan => ({
                id: plan.id,
                title: plan.title,
                price: plan.price,
                desc: plan.desc,
                icon: plan.icon,
                color: plan.color,
                type: plan.type as 'trial' | 'paid'
            }));

            return plans;
        } catch (error) {
            console.error('Get plans error:', error);
            // Retorna planos mock como fallback
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
    }

    async activateTrial(): Promise<void> {
        try {
            await apiClient.post('/subscriptions/trial', {});
        } catch (error) {
            console.error('Activate trial error:', error);
            throw new Error("Não foi possível ativar o período de teste.");
        }
    }

    async activateFreeTrial(): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/trial', {});
            
            // Converte a resposta da API para o modelo Subscription
            const subscription: Subscription = {
                id: response.id,
                isActive: response.isActive,
                planType: response.planType as 'none' | 'trial' | 'basic' | 'premium',
                maxClients: response.maxClients,
                currentClients: response.currentClients,
                startDate: response.startDate,
                trialStartDate: response.trialStartDate,
                trialEndDate: response.trialEndDate,
                nextBillingDate: response.nextBillingDate
            };

            return subscription;
        } catch (error) {
            console.error('Activate free trial error:', error);
            throw new Error("Não foi possível ativar o período de teste.");
        }
    }

    async getSavedCards(): Promise<any[]> {
        try {
            const response: { cards: any[] } = await apiClient.get('/subscriptions/cards');
            return response.cards || [];
        } catch (error) {
            console.error('Get saved cards error:', error);
            return [];
        }
    }

    async saveCard(cardData: any): Promise<void> {
        try {
            await apiClient.post('/subscriptions/cards', cardData);
        } catch (error) {
            console.error('Save card error:', error);
            throw new Error("Não foi possível salvar o cartão.");
        }
    }

    async deleteCard(cardId: string): Promise<void> {
        try {
            await apiClient.delete(`/subscriptions/cards/${cardId}`, {});
        } catch (error) {
            console.error('Delete card error:', error);
            throw new Error("Não foi possível excluir o cartão.");
        }
    }

    async setDefaultCard(cardId: string): Promise<void> {
        try {
            await apiClient.put(`/subscriptions/cards/${cardId}/default`, {});
        } catch (error) {
            console.error('Set default card error:', error);
            throw new Error("Não foi possível definir o cartão como padrão.");
        }
    }

    async processPaidSubscription(
        planId: string,
        newCardData?: { number: string, expiry: string, cvv: string }
    ): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/paid', {
                planId,
                cardData: newCardData
            });
            
            // Converte a resposta da API para o modelo Subscription
            const subscription: Subscription = {
                id: response.id,
                isActive: response.isActive,
                planType: response.planType as 'none' | 'trial' | 'basic' | 'premium',
                maxClients: response.maxClients,
                currentClients: response.currentClients,
                startDate: response.startDate,
                trialStartDate: response.trialStartDate,
                trialEndDate: response.trialEndDate,
                nextBillingDate: response.nextBillingDate
            };

            return subscription;
        } catch (error) {
            console.error('Process paid subscription error:', error);
            throw new Error("Não foi possível processar o pagamento. Verifique os dados do cartão.");
        }
    }
}
