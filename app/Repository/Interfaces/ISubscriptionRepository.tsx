import {Subscription} from "@/app/Models/Subscription";
import {Plan} from "@/app/Models/Plan";

export interface ISubscriptionRepository {
    getSubscription(): Promise<Subscription>;
    activateTrial(): Promise<void>;
    getAvailablePlans(): Promise<Plan[]>;
    processPaidSubscription(planId: string): Promise<Subscription>
    activateFreeTrial(): Promise<Subscription>
}