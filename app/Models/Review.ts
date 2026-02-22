export interface Review {
    id: string;
    salonId: string;    
    userId: string;     
    userName: string;    
    userImage?: string;   
    rating: number;       
    comment: string;      
    createdAt: string;          
}

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        salonId: '1',
        userId: 'u10',
        userName: 'Mariana Silva',
        rating: 5,
        comment: 'Amei o atendimento! A Ana é super cuidadosa com as unhas.',
        createdAt: '2024-03-20'
    },
    {
        id: 'r2',
        salonId: '1',
        userId: 'u11',
        userName: 'Ricardo Souza',
        rating: 4,
        comment: 'Lugar muito limpo e organizado. Recomendo o corte de cabelo.',
        createdAt: '2024-03-18'
    }
];