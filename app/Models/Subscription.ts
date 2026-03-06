export interface Subscription {
    id: string;
    isActive: boolean;
    planType: 'none' | 'trial' | 'basic' | 'premium';
    maxClients: number;
    currentClients: number;
    trialStartDate?: string; // ISO Date String
    trialEndDate?: string;   // ISO Date String
    startDate?: string;      // ISO Date String
    nextBillingDate?: string; // Útil para planos pagos
}