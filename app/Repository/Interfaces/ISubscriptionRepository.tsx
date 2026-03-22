import {Subscription} from "@/app/Models/Subscription";
import {Plan} from "@/app/Models/Plan";

export interface ISubscriptionRepository {
    getSubscription(): Promise<Subscription>;
    activateTrial(): Promise<void>;
    getAvailablePlans(): Promise<Plan[]>;
    processPaidSubscription(planId: number, newCardData?: { number: string, expiry: string, cvv: string }): Promise<Subscription>;
    upgradeSubscription(planId: number, newCardData?: { number: string, expiry: string, cvv: string }): Promise<Subscription>;
    cancelSubscription(reason?: string): Promise<Subscription>;
    activateFreeTrial(): Promise<Subscription>;
    getSavedCards(): Promise<any[]>;
    saveCard(cardData: any): Promise<void>;
    deleteCard(cardId: string): Promise<void>;
    setDefaultCard(cardId: string): Promise<void>;
}