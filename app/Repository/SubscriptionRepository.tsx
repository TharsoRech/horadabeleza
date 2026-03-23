import {Subscription} from "../Models/Subscription";
import {ISubscriptionRepository} from "@/app/Repository/Interfaces/ISubscriptionRepository";
import {Plan} from "@/app/Models/Plan";
import { apiClient } from "@/app/Utils/apiClient";
import { SubscriptionResponse, PlanResponse, CardResponse, CardsEnvelopeResponse, SavedCard, SaveCardPayload } from "@/app/Types/apiTypes";

export class SubscriptionRepository implements ISubscriptionRepository {
    private mapCard(response: CardResponse): SavedCard {
        const rawCardNumber = String(response.cardNumber || '');
        const digitsOnly = rawCardNumber.replace(/\D/g, '');
        const last4 = digitsOnly.slice(-4);
        const normalizedYear = String(response.expiryYear || '').trim();
        const shortYear = normalizedYear.length >= 2 ? normalizedYear.slice(-2) : normalizedYear;

        return {
            id: String(response.id),
            last4,
            expiry: `${response.expiryMonth}/${shortYear}`,
            isDefault: Boolean(response.isDefault),
            cardHolderName: response.cardHolderName,
            brand: response.brand,
            maskedNumber: last4 ? `**** ${last4}` : undefined
        };
    }

    private normalizePlanType(value: unknown): string {
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (normalized === 'trial') return 'trial';
            if (normalized === 'basic' || normalized === 'premium' || normalized === 'paid') return 'paid';
            if (normalized) return normalized;
        }

        if (typeof value === 'number') {
            // .NET enum PlanType: None=0, Trial=1, Basic=2, Premium=3
            if (value === 1) return 'trial';
            if (value === 2 || value === 3) return 'paid';
            return 'none';
        }

        return 'none';
    }

    private mapSubscription(response: SubscriptionResponse): Subscription {
        const normalizedPlanType = this.normalizePlanType(response.planType);
        const effectivePlanType =
            normalizedPlanType === 'none' && Boolean(response.isActive) && Number(response.planId || 0) > 0
                ? 'paid'
                : normalizedPlanType;

        return {
            id: String(response.id),
            isActive: Boolean(response.isActive),
            planType: effectivePlanType,
            planId: response.planId,
            planName: response.planName,
            status: typeof response.status === 'number' ? String(response.status) : response.status,
            maxClients: response.maxClients ?? 0,
            currentClients: response.currentClients ?? 0,
            startDate: response.startDate,
            trialStartDate: response.trialStartDate,
            trialEndDate: response.trialEndDate,
            nextBillingDate: response.nextBillingDate,
            isTrialEligible: response.isTrialEligible,
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

    async getSavedCards(): Promise<SavedCard[]> {
        try {
            const response: CardsEnvelopeResponse = await apiClient.get('/subscriptions/cards');
            return (response.cards || []).map(card => this.mapCard(card));
        } catch (error) {
            console.error('Get saved cards error:', error);
            return [];
        }
    }

    async saveCard(cardData: SaveCardPayload): Promise<SavedCard> {
        try {
            const response: CardResponse = await apiClient.post('/subscriptions/cards', {
                number: cardData.number,
                holderName: cardData.name,
                expiry: cardData.expiry,
                cvv: cardData.cvv,
                brand: cardData.brand
            });

            return this.mapCard(response);
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
