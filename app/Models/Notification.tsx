import { Ionicons } from '@expo/vector-icons';

export type NotificationType = 'promo' | 'alert' | 'success' | 'info';

export class Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    type: NotificationType;

    constructor(data: Partial<Notification>) {
        this.id = data.id || Math.random().toString();
        this.title = data.title || '';
        this.message = data.message || '';
        this.time = data.time || 'Agora';
        this.isRead = data.isRead || false;
        this.type = data.type || 'info';
    }

    // Método utilitário para facilitar a UI
    getIconConfig() {
        switch (this.type) {
            case 'promo': return { name: 'pricetag-outline', color: '#4CAF50' };
            case 'alert': return { name: 'warning-outline', color: '#FF9800' };
            case 'success': return { name: 'checkmark-circle-outline', color: '#FF4B91' };
            default: return { name: 'notifications-outline', color: '#666' };
        }
    }

    // MOCK: Único item para teste rápido
    static mock(): Notification {
        return new Notification({
            id: '1',
            title: 'Corte Confirmado!',
            message: 'Seu horário no Studio Glamour foi confirmado para hoje.',
            time: '5 min',
            type: 'success',
            isRead: false
        });
    }

    // MOCK LIST: Lista completa para o seu Popup
    static mockList(): Notification[] {
        return [
            new Notification({
                id: '1',
                title: 'Agendamento Confirmado',
                message: 'Seu horário às 14:00 foi aprovado.',
                type: 'success',
                time: '10m atrás',
                isRead: false
            }),
            new Notification({
                id: '2',
                title: 'Cupom Disponível',
                message: 'Use o código SALAO20 e ganhe desconto.',
                type: 'promo',
                time: '1h atrás',
                isRead: false
            }),
            new Notification({
                id: '3',
                title: 'Lembrete',
                message: 'Não esqueça de avaliar sua última visita.',
                type: 'info',
                time: '3h atrás',
                isRead: true
            }),
            new Notification({
                id: '4',
                title: 'Aviso Importante',
                message: 'O salão fechará mais cedo no feriado.',
                type: 'alert',
                time: '1d atrás',
                isRead: true
            }),
        ];
    }
}