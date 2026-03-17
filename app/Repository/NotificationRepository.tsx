import {INotificationRepository} from './Interfaces/INotificationRepository';
import {Notification, NotificationType} from '@/app/Models/Notification';
import {apiClient} from "@/app/Utils/apiClient";
import {NotificationResponse} from "@/app/Types/apiTypes";

export class NotificationRepository implements INotificationRepository {

    async getNotifications(): Promise<Notification[]> {
        try {
            const response: NotificationResponse[] = await apiClient.get('/notifications?unreadOnly=true');
            
            // Converte as respostas da API para o modelo Notification
            return response.map(notification =>
                new Notification({
                    id: notification.id,
                    title: notification.title,
                    message: notification.message,
                    time: notification.time,
                    isRead: notification.isRead,
                    type: notification.type as NotificationType
                })
            );
        } catch (error) {
            console.error('Get notifications error:', error);
            return [];
        }
    }

    async markAsRead(id: string): Promise<void> {
        try {
            await apiClient.put(`/notifications/${id}/read`, null);
        } catch (error) {
            console.error('Mark as read error:', error);
            throw error;
        }
    }

    async getUnreadCount(): Promise<number> {
        try {
            const response: { count: number } = await apiClient.get('/notifications/unread-count');
            return response.count || 0;
        } catch (error) {
            console.error('Get unread count error:', error);
            return 0;
        }
    }
}
