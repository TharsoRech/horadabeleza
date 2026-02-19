export interface Salon {
    id: string;
    name: string;
    address: string;
    rating: string;
    reviews: number;
    image?: string;
    serviceIds: string[]; // IDs vinculados ao MOCK_SERVICES
}

export const MOCK_SALONS_LIST: Salon[] = [
    {
        id: '1',
        name: "Studio Glamour",
        address: "Av. Paulista, 1000 - SP",
        rating: "4.9",
        reviews: 120,
        serviceIds: ['1', '2', '3', '5'],
    },
    {
        id: '2',
        name: "Beleza Pura",
        address: "Rua Augusta, 450 - SP",
        rating: "4.7",
        reviews: 85,
        serviceIds: ['2', '4'],
    },
    {
        id: '3',
        name: "Unhas & Cia",
        address: "Alameda Santos, 200 - SP",
        rating: "4.8",
        reviews: 210,
        serviceIds: ['2'],
    },
    {
        id: '4',
        name: "Corte Real",
        address: "Bela Cintra, 12 - SP",
        rating: "4.5",
        reviews: 50,
        serviceIds: ['1'],
    }
];