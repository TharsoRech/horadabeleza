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
}

export const MOCK_PROFESSIONALS_LIST: Professional[] = [
    {
        id: '1',
        name: 'Ana Silva',
        specialty: 'Manicure',
        rating: 4.8,
        reviews: 120,
        bio: 'Especialista em unhas em gel.',
        salon: MOCK_SALONS_LIST[0],
        image: ''
    },
    {
        id: '2',
        name: 'Bruno Costa',
        specialty: 'Barbeiro',
        rating: 4.9,
        reviews: 85,
        bio: 'Cortes modernos e barba.',
        salon: MOCK_SALONS_LIST[3],
        image: ''
    },
    {
        id: '3',
        name: 'Carla Dias',
        specialty: 'Esteticista',
        rating: 4.7,
        reviews: 200,
        bio: 'Limpeza de pele profunda.',
        salon: MOCK_SALONS_LIST[1],
        image: ''
    },
    {
        id: '4',
        name: 'Daniela Lima',
        specialty: 'Cabeleireira',
        rating: 4.6,
        reviews: 50,
        bio: 'Coloração e corte.',
        salon: MOCK_SALONS_LIST[0],
        image: ''
    },
    {
        id: '5',
        name: 'Eduardo M.',
        specialty: 'Barbeiro',
        rating: 4.5,
        reviews: 30,
        bio: 'Barba terapia.',
        salon: MOCK_SALONS_LIST[3],
        image: ''
    },
    {
        id: '6',
        name: 'Fernanda O.',
        specialty: 'Manicure',
        rating: 4.9,
        reviews: 90,
        bio: 'Nail art avançada.',
        salon: MOCK_SALONS_LIST[2],
        image: ''
    },
    {
        id: '7',
        name: 'Gabriel S.',
        specialty: 'Cabeleireira',
        rating: 4.8,
        reviews: 110,
        bio: 'Especialista em loiras.',
        salon: MOCK_SALONS_LIST[0],
        image: ''
    },
    {
        id: '8',
        name: 'Helena P.',
        specialty: 'Esteticista',
        rating: 4.7,
        reviews: 45,
        bio: 'Massagem relaxante.',
        salon: MOCK_SALONS_LIST[1],
        image: ''
    },
    {
        id: '9',
        name: 'Igor T.',
        specialty: 'Barbeiro',
        rating: 4.4,
        reviews: 25,
        bio: 'Corte degradê.',
        salon: MOCK_SALONS_LIST[3],
        image: ''
    },
    {
        id: '10',
        name: 'Julia V.',
        specialty: 'Cabeleireira',
        rating: 4.9,
        reviews: 150,
        bio: 'Penteados para noivas.',
        salon: MOCK_SALONS_LIST[0],
        image: ''
    },
    {
        id: '11',
        name: 'Kevin R.',
        specialty: 'Barbeiro',
        rating: 4.2,
        reviews: 15,
        bio: 'Estilo clássico.',
        salon: MOCK_SALONS_LIST[3],
        image: ''
    },
];