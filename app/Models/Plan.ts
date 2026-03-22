export interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    periodDays: number;
    appointmentLimit: number;
    displayPrice: string;
    icon: string;
    color: string;
    type: 'trial' | 'paid';
}