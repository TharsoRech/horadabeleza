import React from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '@/app/Models/Notification';
import { INotificationRepository } from '@/app/Repository/Interfaces/INotificationRepository';
import { NotificationRepository } from '@/app/Repository/NotificationRepository';

// New Style and Theme Imports
import { notificationStyles } from "@/app/Styles/notificationStyles";
import {COLORS} from "@/constants/theme";

interface NotificationPopupProps {
    visible: boolean;
    onClose: () => void;
    notifications: Notification[];
    onNotificationMarkedAsRead?: (notificationId: string) => void;
}

const notificationRepository: INotificationRepository = new NotificationRepository();

export const NotificationPopup = ({ visible, onClose, notifications, onNotificationMarkedAsRead }: NotificationPopupProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={notificationStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={notificationStyles.content}>
                            <View style={notificationStyles.header}>
                                <Text style={notificationStyles.title}>Notificações</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={20} color={COLORS.textSub} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={notifications}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    const config = item.getIconConfig();
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                notificationStyles.item,
                                                !item.isRead && notificationStyles.unreadItem
                                            ]}
                                            onPress={async () => {
                                                // Marca a notificação como lida
                                                try {
                                                    await notificationRepository.markAsRead(item.id);
                                                    console.log(`Notificação marcada como lida: ${item.id}`);
                                                    
                                                    // Notifica o componente pai sobre a mudança
                                                    if (onNotificationMarkedAsRead) {
                                                        onNotificationMarkedAsRead(item.id);
                                                    }
                                                } catch (error) {
                                                    console.error('Erro ao marcar notificação como lida:', error);
                                                }
                                                // Aqui você pode adicionar a lógica para abrir a notificação
                                                console.log(`Abrindo notificação: ${item.id}`);
                                            }}
                                        >
                                            <View style={notificationStyles.itemRow}>
                                                <Ionicons name={config.name as any} size={18} color={config.color} />
                                                <View style={notificationStyles.textContainer}>
                                                    <Text style={notificationStyles.itemTitle}>{item.title}</Text>
                                                    <Text style={notificationStyles.itemMsg}>{item.message}</Text>
                                                    <Text style={notificationStyles.itemTime}>{item.time}</Text>
                                                </View>
                                                {!item.isRead && <View style={notificationStyles.unreadDot} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                ListEmptyComponent={
                                    <View style={notificationStyles.emptyContainer}>
                                        <Ionicons name="notifications-off-outline" size={40} color={COLORS.muted} />
                                        <Text style={notificationStyles.empty}>Nenhuma notificação por aqui.</Text>
                                    </View>
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};