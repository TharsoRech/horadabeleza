export interface Plan {
    id: string;
    title: string;
    price: string;
    desc: string;
    icon: string;
    color: string;
    type: 'trial' | 'paid';
}