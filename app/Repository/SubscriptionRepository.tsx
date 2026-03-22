import {Subscription} from "../Models/Subscription";
import {ISubscriptionRepository} from "@/app/Repository/Interfaces/ISubscriptionRepository";
import {Plan} from "@/app/Models/Plan";
import { apiClient } from "@/app/Utils/apiClient";
import { SubscriptionResponse, PlanResponse } from "@/app/Types/apiTypes";

export class SubscriptionRepository implements ISubscriptionRepository {
    private mapSubscription(response: SubscriptionResponse): Subscription {
        return {
            id: String(response.id),
            isActive: Boolean(response.isActive),
            planType: (response.planType || 'none').toLowerCase(),
            planId: response.planId,
            planName: response.planName,
            status: response.status,
            maxClients: response.maxClients ?? 0,
            currentClients: response.currentClients ?? 0,
            startDate: response.startDate,
            trialStartDate: response.trialStartDate,
            trialEndDate: response.trialEndDate,
            nextBillingDate: response.nextBillingDate,
            canUpgrade: response.canUpgrade,
            canCancel: response.canCancel
        };
    }

    private getPlanVisual(plan: PlanResponse): { icon: string; color: string } {
        const name = (plan.name || '').toLowerCase();
        if (plan.price === 0 || name.includes('starter') || name.includes('trial') || name.includes('free')) {
            return { icon: 'clock-outline', color: '#4CAF50' };
        }
        if (name.includes('business') || name.includes('premium')) {
            return { icon: 'crown-outline', color: '#FFD700' };
        }
        return { icon: 'shield-outline', color: '#3F51B5' };
    }

    private formatPlanPrice(price: number): string {
        if (price === 0) return 'Grátis';
        return `R$ ${price.toFixed(2).replace('.', ',')}/mês`;
    }

    async getSubscription(): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.get('/subscriptions/current');
            return this.mapSubscription(response);
        } catch (error) {
            console.error('Get subscription error:', error);
            return {
                id: '0',
                isActive: false,
                planType: 'none',
                maxClients: 0,
                currentClients: 0,
                canCancel: false,
                canUpgrade: false
            };
        }
    }

    async ensureSubscriptionExists(planId: number): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/ensure', { planId });
            return this.mapSubscription(response);
        } catch (error) {
            console.error('Ensure subscription error:', error);
            // Fallback seguro para manter a UI funcional mesmo se o endpoint novo falhar.
            return this.getSubscription();
        }
    }

    async getAvailablePlans(): Promise<Plan[]> {
        try {
            const response: PlanResponse[] = await apiClient.get('/plans');
            const plans: Plan[] = response.map(plan => {
                const visual = this.getPlanVisual(plan);
                const isTrial = plan.price === 0;
                return {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price,
                periodDays: plan.periodDays,
                appointmentLimit: plan.appointmentLimit,
                displayPrice: this.formatPlanPrice(plan.price),
                icon: visual.icon,
                color: visual.color,
                type: isTrial ? 'trial' : 'paid'
                };
            });

            return plans.sort((a, b) => a.price - b.price);
        } catch (error) {
            console.error('Get plans error:', error);
            return [];
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
            return this.mapSubscription(response);
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
        planId: number,
        newCardData?: { number: string, expiry: string, cvv: string }
    ): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/paid', {
                planId,
                cardData: newCardData
            });
            return this.mapSubscription(response);
        } catch (error) {
            console.error('Process paid subscription error:', error);
            throw new Error("Não foi possível processar o pagamento. Verifique os dados do cartão.");
        }
    }

    async upgradeSubscription(
        planId: number,
        newCardData?: { number: string, expiry: string, cvv: string }
    ): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/upgrade', {
                planId,
                cardData: newCardData
            });
            return this.mapSubscription(response);
        } catch (upgradeError) {
            console.warn('Upgrade endpoint unavailable, fallback para /subscriptions/paid', upgradeError);
            return this.processPaidSubscription(planId, newCardData);
        }
    }

    async cancelSubscription(reason: string = 'user_request'): Promise<Subscription> {
        try {
            const response: SubscriptionResponse = await apiClient.post('/subscriptions/cancel', { reason });
            return this.mapSubscription(response);
        } catch (postError) {
            console.warn('Cancel via POST falhou, tentando PUT', postError);
            try {
                const response = await apiClient.put<SubscriptionResponse>('/subscriptions/cancel', { reason });
                if (response) {
                    return this.mapSubscription(response);
                }
                return this.getSubscription();
            } catch (putError) {
                console.error('Cancel subscription error:', putError);
                throw new Error('Não foi possível cancelar a assinatura no momento.');
            }
        }
    }
}
