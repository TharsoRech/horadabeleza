import { INotificationRepository } from './Interfaces/INotificationRepository';
import { Notification } from '@/app/Models/Notification';

export class NotificationRepository implements INotificationRepository {

    async getNotifications(): Promise<Notification[]> {
        // Simulando um pequeno delay de rede
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Notification.mockList());
            }, 500);
        });
    }

    async markAsRead(id: string): Promise<void> {
        console.log(`Notificação ${id} marcada como lida no back-end`);
        return Promise.resolve();
    }

    async getUnreadCount(): Promise<number> {
        const list = Notification.mockList();
        return list.filter(n => !n.isRead).length;
    }
}