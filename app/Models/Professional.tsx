import { Salon, MOCK_SALONS_LIST } from './Salon';

export interface Professional {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    bio: string;
    image?: string;
    salon?: Salon;
    serviceIds: string[];
    availableTimes: string[];
}

export const MOCK_PROFESSIONALS_LIST: Professional[] = [
    { id: '1', name: 'Ana Silva', specialty: 'Manicure', rating: 4.8, reviews: 120, bio: 'Expert em gel.', salon: MOCK_SALONS_LIST[0], serviceIds: ['2'], image: '',availableTimes: ["09:00", "11:00", "15:00"]},
    { id: '2', name: 'Bruno Costa', specialty: 'Barbeiro', rating: 4.9, reviews: 85, bio: 'Cortes modernos.', salon: MOCK_SALONS_LIST[3], serviceIds: ['1'], image: '' ,availableTimes: ["09:00", "11:00", "15:00"]},
    { id: '3', name: 'Carla Dias', specialty: 'Esteticista', rating: 4.7, reviews: 200, bio: 'Limpeza profunda.', salon: MOCK_SALONS_LIST[1], serviceIds: ['4', '5'], image: '',availableTimes: ["09:00", "11:00", "15:00"] },
    { id: '4', name: 'Daniela Lima', specialty: 'Cabeleireira', rating: 4.6, reviews: 50, bio: 'Coloração.', salon: MOCK_SALONS_LIST[0], serviceIds: ['1'], image: '',availableTimes: ["09:00", "11:00", "15:00"] },
    { id: '5', name: 'Eduardo M.', specialty: 'Barbeiro', rating: 4.5, reviews: 30, bio: 'Barba terapia.', salon: MOCK_SALONS_LIST[3], serviceIds: ['1'], image: '',availableTimes: ["09:00", "11:00", "15:00"] },
    { id: '6', name: 'Fernanda O.', specialty: 'Manicure', rating: 4.9, reviews: 90, bio: 'Nail art.', salon: MOCK_SALONS_LIST[2], serviceIds: ['2'], image: '' ,availableTimes: ["09:00", "11:00", "15:00"]},
];