export interface Category {
    id: string;
    name: string;
    icon: string;
}

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Cabelo', icon: 'cut-outline' },
    { id: '2', name: 'Unhas', icon: 'brush-outline' },
    { id: '3', name: 'Maquiagem', icon: 'color-palette-outline' },
    { id: '4', name: 'Massagem', icon: 'leaf-outline' },
    { id: '5', name: 'Sobrancelha', icon: 'eye-outline' },
];