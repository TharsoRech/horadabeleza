// Define a estrutura do objeto
export interface Salon {
    id: string; // Adicionado ID para chaves de lista
    name: string;
    address: string;
    rating: string;
    reviews: number;
    image?: string;
}

// Mock de um único item (Útil para testes unitários ou detalhes)
export const MOCK_SALON: Salon = {
    id: '1',
    name: "Studio Glamour",
    address: "Av. Paulista, 1000 - SP",
    rating: "4.9",
    reviews: 120,
    // Exemplo de Base64 pequena (pixel transparente)
    image: "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
};

// Mock de Lista (O que você usará na HomeScreen)
export const MOCK_SALONS_LIST: Salon[] = [
    {
        id: '1',
        name: "Studio Glamour",
        address: "Av. Paulista, 1000 - SP",
        rating: "4.9",
        reviews: 120,
        image: undefined, // Testando sem imagem (placeholder)
    },
    {
        id: '2',
        name: "Beleza Pura",
        address: "Rua Augusta, 450 - SP",
        rating: "4.7",
        reviews: 85,
        image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    },
    {
        id: '3',
        name: "Unhas & Cia",
        address: "Alameda Santos, 200 - SP",
        rating: "4.8",
        reviews: 210,
        image: undefined,
    },
    {
        id: '4',
        name: "Corte Real",
        address: "Bela Cintra, 12 - SP",
        rating: "4.5",
        reviews: 50,
        image: undefined,
    }
];