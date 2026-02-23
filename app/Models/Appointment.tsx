import { MOCK_SALONS_LIST } from "@/app/Models/Salon";

export interface Appointment {
    id: string;
    salonId: string;
    salonName: string;
    salonImage?: string;
    salonWhatsApp?: string; 
    salonPhone?: string;   
    address: string;
    serviceId: string;
    serviceName: string;
    price: number;
    duration: string;
    professionalId: string;
    professionalName: string;
    professionalImage?: string;
    date: string;
    time?: string; 
    status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Concluído';
    notes?: string;
    isReviewed?: boolean;
}

export const MOCK_Appointment_LIST: Appointment[] = [
    {
        id: '1',
        salonId: MOCK_SALONS_LIST[0].id,
        salonName: MOCK_SALONS_LIST[0].name,
        salonImage: MOCK_SALONS_LIST[0].image,
        salonWhatsApp: MOCK_SALONS_LIST[0].whatsApp, // Mapeado do Mock de Salões
        salonPhone: MOCK_SALONS_LIST[0].phone,       // Mapeado do Mock de Salões
        address: MOCK_SALONS_LIST[0].address,
        serviceId: '2',
        serviceName: 'Corte de Cabelo Masculino',
        price: 75.00,
        duration: '45 min',
        professionalId: '1',
        professionalName: 'Ana Silva',
        date: '2026-10-24T14:00:00',
        time: '14:00',
        status: 'Confirmado'
    },
    {
        id: '2',
        salonId: MOCK_SALONS_LIST[3].id,
        salonName: MOCK_SALONS_LIST[3].name,
        salonImage: MOCK_SALONS_LIST[3].image,
        salonWhatsApp: MOCK_SALONS_LIST[3].whatsApp,
        salonPhone: MOCK_SALONS_LIST[3].phone,
        address: MOCK_SALONS_LIST[3].address,
        serviceId: '3',
        serviceName: 'Barba Terapia',
        price: 50.00,
        duration: '30 min',
        professionalId: '2',
        professionalName: 'Bruno Costa',
        date: '2026-10-26T10:30:00',
        time: '10:30',
        status: 'Pendente'
    },
    {
        id: '3',
        salonId: MOCK_SALONS_LIST[1].id,
        salonName: MOCK_SALONS_LIST[1].name,
        salonImage: MOCK_SALONS_LIST[1].image,
        salonWhatsApp: MOCK_SALONS_LIST[1].whatsApp,
        salonPhone: MOCK_SALONS_LIST[1].phone,
        address: MOCK_SALONS_LIST[1].address,
        serviceId: '4',
        serviceName: 'Limpeza de Pele',
        price: 120.00,
        duration: '60 min',
        professionalId: '3',
        professionalName: 'Carla Dias',
        date: '2026-10-28T09:00:00',
        time: '09:00',
        status: 'Confirmado'
    },
    {
        id: '4',
        salonId: MOCK_SALONS_LIST[2].id,
        salonName: MOCK_SALONS_LIST[2].name,
        salonImage: MOCK_SALONS_LIST[2].image,
        salonWhatsApp: MOCK_SALONS_LIST[2].whatsApp,
        salonPhone: MOCK_SALONS_LIST[2].phone,
        address: MOCK_SALONS_LIST[2].address,
        serviceId: '5',
        serviceName: 'Manicure Gel',
        price: 90.00,
        duration: '90 min',
        professionalId: '4',
        professionalName: 'Fernanda O.',
        date: '2026-11-01T16:00:00',
        time: '16:00',
        status: 'Cancelado'
    }
];