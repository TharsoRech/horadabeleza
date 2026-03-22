export interface Subscription {
    id: string;
    isActive: boolean;
    planType: string;
    planId?: number;
    planName?: string;
    status?: string;
    maxClients: number;
    currentClients: number;
    trialStartDate?: string; // ISO Date String
    trialEndDate?: string;   // ISO Date String
    startDate?: string;      // ISO Date String
    nextBillingDate?: string; // Útil para planos pagos
    canUpgrade?: boolean;
    canCancel?: boolean;
}