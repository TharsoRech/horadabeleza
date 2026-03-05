export interface Subscription {
    isActive: boolean;
    trialStartDate?: string | undefined; // ISO Date
    planType: 'none' | 'trial' | 'basic' | 'premium';
    maxClients: number;
    currentClients: number;
}