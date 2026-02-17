import { Notification } from '@/app/Models/Notification';

export interface INotificationRepository {
    getNotifications(): Promise<Notification[]>;
    markAsRead(id: string): Promise<void>;
    getUnreadCount(): Promise<number>;
}