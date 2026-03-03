import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Appointment } from '@/app/Models/Appointment';
import { appointmentStyles as styles } from "@/app/Styles/appointmentStyles";

interface AppointmentCardProps {
    item: Appointment;
    onPress: (item: Appointment) => void;
    isProfessionalView?: boolean;
    canEdit?: boolean; // Propriedade adicionada para resolver o erro de TS
}

export const AppointmentCard = ({
                                    item,
                                    onPress,
                                    isProfessionalView,
                                    canEdit
                                }: AppointmentCardProps) => {

    const isConfirmed = item.status === 'Confirmado';
    const isCanceled = item.status === 'Cancelado';
    const isPendente = item.status === 'Pendente';

    // Cores dinâmicas para o Status
    const statusColor = isConfirmed ? '#2E7D32' : isCanceled ? '#D32F2F' : '#EF6C00';
    const statusBg = isConfirmed ? '#E8F5E9' : isCanceled ? '#FFEBEE' : '#FFF3E0';

    return (
        <TouchableOpacity
            // Se for pendente, adicionamos uma borda lateral de destaque (opcional, mas recomendado)
            style={[
                styles.appointmentCard,
                isPendente && { borderLeftWidth: 4, borderLeftColor: '#EF6C00' },
                !canEdit && isProfessionalView && { opacity: 0.85 } // Leve transparência se não for o dono/admin
            ]}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.salonImage || 'https://via.placeholder.com/150' }}
                style={styles.salonThumb}
            />

            <View style={styles.cardInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.salonName} numberOfLines={1}>
                        {isProfessionalView ? `Cliente: ${item.clientName || 'Não informado'}` : item.salonName}
                    </Text>
                    {/* Ícone de cadeado se o profissional não tiver permissão de edição */}
                    {!canEdit && isProfessionalView && (
                        <Ionicons name="lock-closed" size={12} color="#999" style={{ marginLeft: 5 }} />
                    )}
                </View>

                <Text style={styles.serviceText}>{item.serviceName}</Text>

                <View style={styles.timeRow}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.timeText}>
                        {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </Text>
                    <Ionicons name="time-outline" size={14} color={COLORS.primary} style={{ marginLeft: 10 }} />
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>

                {/* Se for visão Admin, mostra quem é o profissional responsável por esse serviço */}
                {canEdit && isProfessionalView && item.professionalName && (
                    <Text style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
                        Atendente: {item.professionalName}
                    </Text>
                )}
            </View>

            <View style={[styles.statusTag, { backgroundColor: statusBg }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
};