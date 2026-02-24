export interface SubService {
    id: string;
    name: string;
    price: number;
    duration: string; // Ex: "30 min"
    description: string;
}

export interface Service {
    id: string;
    name: string;
    icon: string;
    description: string;
    price?: number;
    duration?: string;
    subServices: SubService[];
}
export const MOCK_SERVICES: Service[] = [
    {
        id: '1',
        name: 'Cabelo',
        icon: 'cut-outline',
        description: 'Cuidados completos para fios e couro cabeludo.',
        subServices: [
            { id: '101', name: 'Corte Feminino', price: 80.00, duration: '60 min', description: 'Corte personalizado incluindo lavagem e secagem.' },
            { id: '102', name: 'Corte Masculino', price: 50.00, duration: '40 min', description: 'Corte moderno com acabamento na máquina ou tesoura.' },
            { id: '103', name: 'Escova Modeladora', price: 60.00, duration: '45 min', description: 'Finalização com movimento e brilho.' },
        ]
    },
    {
        id: '2',
        name: 'Unhas',
        icon: 'brush-outline',
        description: 'Estética e saúde das mãos e pés.',
        subServices: [
            { id: '201', name: 'Unhas das Mãos', price: 35.00, duration: '45 min', description: 'Cutilagem, lixamento e esmaltação simples.' },
            { id: '202', name: 'Unhas dos Pés', price: 40.00, duration: '50 min', description: 'Pedicure completa com hidratação.' },
            { id: '203', name: 'Esfoliação Relaxante', price: 25.00, duration: '20 min', description: 'Remoção de células mortas e massagem leve.' },
            { id: '204', name: 'Serviço Completo (Mão + Pé)', price: 70.00, duration: '100 min', description: 'Combo completo com esfoliação inclusa.' },
        ]
    },
    {
        id: '3',
        name: 'Maquiagem',
        icon: 'color-palette-outline',
        description: 'Produções para eventos e social.',
        subServices: [
            { id: '301', name: 'Social', price: 150.00, duration: '60 min', description: 'Maquiagem leve para o dia a dia ou jantares.' },
            { id: '302', name: 'Festa/Evento', price: 220.00, duration: '90 min', description: 'Maquiagem de alta durabilidade com cílios inclusos.' },
        ]
    },
    {
        id: '4',
        name: 'Massagem',
        icon: 'leaf-outline',
        description: 'Bem-estar e relaxamento muscular.',
        subServices: [
            { id: '401', name: 'Relaxante', price: 120.00, duration: '60 min', description: 'Massagem corporal com óleos essenciais.' },
            { id: '402', name: 'Drenagem Linfática', price: 140.00, duration: '60 min', description: 'Técnica para redução de inchaço e toxinas.' },
        ]
    },
    {
        id: '5',
        name: 'Sobrancelha',
        icon: 'eye-outline',
        description: 'Design e valorização do olhar.',
        subServices: [
            { id: '501', name: 'Design Simples', price: 45.00, duration: '30 min', description: 'Limpeza e desenho conforme o rosto.' },
            { id: '502', name: 'Design com Henna', price: 65.00, duration: '45 min', description: 'Preenchimento de falhas com pigmentação natural.' },
        ]
    },
];