import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '@/app/Models/Notification';

interface NotificationPopupProps {
    visible: boolean;
    onClose: () => void;
    notifications: Notification[]; // Recebe a lista por parâmetro
}

export const NotificationPopup = ({ visible, onClose, notifications }: NotificationPopupProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={localStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={localStyles.content}>
                            {/* Cabeçalho do Popup */}
                            <View style={localStyles.header}>
                                <Text style={localStyles.title}>Notificações</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={20} color="#666" />
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
                                            style={[localStyles.item, !item.isRead && localStyles.unreadItem]}
                                            onPress={() => console.log(`Abrindo notificação: ${item.id}`)}
                                        >
                                            <View style={localStyles.itemRow}>
                                                <Ionicons name={config.name as any} size={18} color={config.color} />
                                                <View style={localStyles.textContainer}>
                                                    <Text style={localStyles.itemTitle}>{item.title}</Text>
                                                    <Text style={localStyles.itemMsg}>{item.message}</Text>
                                                    <Text style={localStyles.itemTime}>{item.time}</Text>
                                                </View>
                                                {!item.isRead && <View style={localStyles.unreadDot} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                                ListEmptyComponent={
                                    <View style={localStyles.emptyContainer}>
                                        <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
                                        <Text style={localStyles.empty}>Nenhuma notificação por aqui.</Text>
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

const localStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 70
    },
    content: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        maxHeight: 450
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    title: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    unreadItem: { backgroundColor: '#fffcfd' }, // Leve destaque para não lidas
    itemRow: { flexDirection: 'row', alignItems: 'flex-start' },
    textContainer: { flex: 1, marginLeft: 10 },
    itemTitle: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    itemMsg: { fontSize: 13, color: '#666', marginTop: 2, lineHeight: 18 },
    itemTime: { fontSize: 11, color: '#999', marginTop: 5 },
    unreadDot: { width: 8, height: 8, backgroundColor: '#FF4B91', borderRadius: 4, marginTop: 5 },
    emptyContainer: { alignItems: 'center', paddingVertical: 30 },
    empty: { textAlign: 'center', color: '#999', marginTop: 10 }
});