import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Appointment } from '../Models/Appointment';
import { AppointmentRepository } from '../Repository/AppointmentRepository';
import { UserRole } from '../Models/UserProfile'; // Importe o Enum
import { detailStyles as styles } from "../Styles/appointmentDetailStyles";

interface Props {
    visible: boolean;
    appointment: Appointment | null;
    userRole?: UserRole; // Adicionado para TS
    onClose: () => void;
    onRefresh: () => void;
    onNavigateToSalon: (id: string) => void;
    onNavigateToProfessional: (id: string) => void;
}

export const AppointmentDetailModal = ({
                                           visible,
                                           appointment,
                                           userRole,
                                           onClose,
                                           onRefresh,
                                           onNavigateToSalon,
                                           onNavigateToProfessional
                                       }: Props) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'destructive',
        onConfirm: () => { },
        onCancel: undefined as (() => void) | undefined
    });

    const repository = new AppointmentRepository();
    if (!appointment) return null;

    const isProfessional = userRole === UserRole.PROFISSIONAL;
    const isConfirmed = appointment.status === 'Confirmado';

    const showAlert = (title: string, message: string, type: 'info' | 'destructive' = 'info', onConfirm?: () => void, onCancel?: () => void) => {
        setAlertConfig({
            visible: true, title, message, type,
            onConfirm: onConfirm || (() => setAlertConfig(prev => ({ ...prev, visible: false }))),
            onCancel
        });
    };

    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const handleCancelRequest = () => {
        showAlert(
            isProfessional ? "Recusar Agendamento" : "Cancelar Agendamento",
            "Deseja realmente cancelar este horário?",
            'destructive',
            async () => {
                hideAlert();
                setIsCancelling(true);
                try {
                    const success = await repository.updateAppointmentStatus(appointment.id, 'Cancelado');
                    if (success) { onRefresh(); onClose(); }
                } catch (error) {
                    showAlert("Erro", "Falha ao processar cancelamento.", "destructive");
                } finally { setIsCancelling(false); }
            },
            () => hideAlert()
        );
    };

    const handleContact = () => {
        // Se profissional -> fala com cliente. Se cliente -> fala com salão.
        const phone = isProfessional ? appointment.clientPhone : appointment.salonPhone;
        const name = isProfessional ? appointment.clientName : appointment.salonName;

        if (phone) {
            const cleanNumber = phone.replace(/\D/g, '');
            const msg = encodeURIComponent(`Olá ${name}, sobre o agendamento de ${appointment.serviceName}...`);
            Linking.openURL(`https://wa.me/${cleanNumber}?text=${msg}`);
        } else {
            showAlert("Erro", "Número de contato não disponível.");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* MODAL DE ALERTA (Mantido conforme seu código) */}
                <Modal visible={alertConfig.visible} transparent animationType="fade">
                    <View style={styles.alertOverlay}>
                        <View style={styles.alertContainer}>
                            <View style={[styles.alertIconCircle, { backgroundColor: alertConfig.type === 'destructive' ? '#FFF1F0' : '#F0F7FF' }]}>
                                <Ionicons name={alertConfig.type === 'destructive' ? "alert-circle" : "information-circle"} size={32} color={alertConfig.type === 'destructive' ? "#D32F2F" : COLORS.primary} />
                            </View>
                            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
                            <Text style={styles.alertMessage}>{alertConfig.message}</Text>
                            <View style={styles.alertButtonRow}>
                                {alertConfig.onCancel && (
                                    <TouchableOpacity style={styles.alertBtnSecondary} onPress={alertConfig.onCancel}>
                                        <Text style={styles.alertBtnTextSecondary}>Voltar</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={[styles.alertBtnPrimary, { backgroundColor: alertConfig.type === 'destructive' ? "#D32F2F" : COLORS.primary }]} onPress={alertConfig.onConfirm}>
                                    <Text style={styles.alertBtnTextPrimary}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.container}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.headerTitle}>Detalhes</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={COLORS.textMain} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.ticketCard}>
                            <View style={styles.section}>
                                <View style={styles.salonInfoRow}>
                                    <Image source={{ uri: appointment.salonImage }} style={styles.salonLogo} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.salonName}>
                                            {isProfessional ? appointment.clientName : appointment.salonName}
                                        </Text>
                                        <Text style={styles.addressText}>{isProfessional ? "Cliente Registrado" : appointment.address}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={styles.circleCutoutLeft} /><View style={styles.dashLine} /><View style={styles.circleCutoutRight} />
                            </View>

                            <View style={styles.section}>
                                <DetailRow label="Serviço" value={appointment.serviceName} icon="sparkles-outline" />
                                {!isProfessional && (
                                    <TouchableOpacity onPress={() => onNavigateToProfessional(appointment.professionalId)}>
                                        <DetailRow label="Profissional" value={`${appointment.professionalName} >`} icon="person-outline" />
                                    </TouchableOpacity>
                                )}
                                <DetailRow label="Horário" value={`${appointment.date} às ${appointment.time}`} icon="calendar-outline" />
                            </View>

                            <View style={[styles.section, styles.priceSection]}>
                                <Text style={styles.priceLabel}>{isProfessional ? "Comissão/Valor" : "Total"}</Text>
                                <Text style={styles.priceValue}>R$ {appointment.price?.toFixed(2).replace('.', ',')}</Text>
                            </View>
                        </View>

                        <View style={styles.actionContainer}>
                            <TouchableOpacity style={[styles.primaryAction, { backgroundColor: '#25D366' }]} onPress={handleContact}>
                                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                                <Text style={styles.actionText}>{isProfessional ? "WhatsApp do Cliente" : "Falar com o Salão"}</Text>
                            </TouchableOpacity>

                            {isConfirmed && (
                                <TouchableOpacity style={[styles.secondaryAction, { borderColor: '#D32F2F', marginTop: 12 }]} onPress={handleCancelRequest} disabled={isCancelling}>
                                    {isCancelling ? <ActivityIndicator size="small" color="#D32F2F" /> : <Text style={[styles.secondaryActionText, { color: '#D32F2F' }]}>Cancelar Horário</Text>}
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }: any) => (
    <View style={styles.detailRow}>
        <View style={styles.iconBox}><Ionicons name={icon} size={18} color={COLORS.primary} /></View>
        <View><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
    </View>
);