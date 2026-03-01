export interface Salon {
    id: string;
    name: string;
    address: string;
    rating: string;
    reviews: number;
    image?: string;
    serviceIds: string[];
    professionalIds: string[];
    whatsApp?: string;
    phone?: string;
    description?: string; 
    userHasVisited: boolean;
    gallery?: string[];
    published: boolean;
}

export const MOCK_SALONS_LIST: Salon[] = [
    {
        id: '1',
        name: "Studio Glamour",
        address: "Av. Paulista, 1000 - SP",
        rating: "4.9",
        reviews: 120,
        serviceIds: ['1', '2', '3', '5'],
        professionalIds: ['1', '4'],
        phone: "5511888888888",
        whatsApp: "5511999999999",
        description: "O Studio Glamour é especialista em transformar visual com elegância. Localizado no coração da Paulista, oferecemos serviços premium de coloração, manicure e estética facial com os melhores produtos do mercado.",
        userHasVisited: true, 
        published:true
    },
    {
        id: '2',
        name: "Beleza Pura",
        address: "Rua Augusta, 450 - SP",
        rating: "4.7",
        reviews: 85,
        serviceIds: ['2', '4'],
        professionalIds: ['1', '4'],
        phone: "5511888888888",
        whatsApp: "5511888888888",
        description: "Ambiente descontraído e moderno na Rua Augusta. Focamos em cortes modernos e design de sobrancelhas. Venha tomar um café conosco enquanto cuidamos da sua beleza.",
        userHasVisited: false,
        published:false
    },
    {
        id: '3',
        name: "Unhas & Cia",
        address: "Alameda Santos, 200 - SP",
        rating: "4.8",
        reviews: 210,
        serviceIds: ['2'],
        professionalIds: ['1', '4'],
        phone: "5511888888888",
        whatsApp: "", 
        description: "Referência em nail art e cuidados com as mãos. Nossa equipe é treinada nas últimas tendências de alongamento em gel e blindagem de unhas.",
        userHasVisited: false,  published:false
    },
    {
        id: '4',
        name: "Corte Real",
        address: "Bela Cintra, 12 - SP",
        rating: "4.5",
        reviews: 50,
        serviceIds: ['1'],
        professionalIds: ['1', '4'],
        phone: "5511888888888",
        whatsApp: "5511777777777",
        description: "Especialistas em barbearia clássica e cortes masculinos. Um espaço feito para o homem moderno que não abre mão da tradição.",
        userHasVisited: true,  published:false
    }
];