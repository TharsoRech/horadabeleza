import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Appointment } from '../Models/Appointment';
import { AppointmentRepository } from '../Repository/AppointmentRepository';

// Importando os estilos (certifique-se de que o caminho está correto)
import { detailStyles as styles } from "../Styles/appointmentDetailStyles";

interface Props {
    visible: boolean;
    appointment: Appointment | null;
    onClose: () => void;
    onRefresh: () => void;
    onNavigateToSalon: (id: string) => void;
    onNavigateToProfessional: (id: string) => void;
}

export const AppointmentDetailModal = ({
                                           visible,
                                           appointment,
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
        onConfirm: () => {},
        onCancel: undefined as (() => void) | undefined
    });

    const repository = new AppointmentRepository();
    if (!appointment) return null;

    const isConfirmed = appointment.status === 'Confirmado';
    const isCompleted = appointment.status === 'Concluído';

    const showAlert = (title: string, message: string, type: 'info' | 'destructive' = 'info', onConfirm?: () => void, onCancel?: () => void) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            onConfirm: onConfirm || (() => setAlertConfig(prev => ({ ...prev, visible: false }))),
            onCancel
        });
    };

    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const handleCancelRequest = () => {
        showAlert(
            "Cancelar Agendamento",
            "Tem certeza que deseja cancelar? Esta ação não pode ser desfeita.",
            'destructive',
            async () => {
                hideAlert();
                setIsCancelling(true);
                try {
                    const success = await repository.updateAppointmentStatus(appointment.id, 'Cancelado');
                    if (success) {
                        onRefresh();
                        onClose();
                    }
                } catch (error) {
                    showAlert("Erro", "Falha ao cancelar agendamento.", "destructive");
                } finally {
                    setIsCancelling(false);
                }
            },
            () => hideAlert()
        );
    };

    const handleContact = () => {
        const whats = appointment.salonWhatsApp;
        const phone = appointment.salonPhone;

        if (whats) {
            const cleanNumber = whats.replace(/\D/g, '');
            const finalNumber = cleanNumber.length === 11 ? `55${cleanNumber}` : cleanNumber;
            const msg = encodeURIComponent(`Olá, gostaria de falar sobre meu agendamento de ${appointment.serviceName}.`);
            const url = `https://wa.me/${finalNumber}?text=${msg}`;
            Linking.openURL(url).catch(() => showAlert("Erro", "Não foi possível abrir o WhatsApp."));
        } else if (phone) {
            Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>

                {/* POPUP DE ALERTA CENTRALIZADO */}
                <Modal visible={alertConfig.visible} transparent animationType="fade">
                    <View style={styles.alertOverlay}>
                        <View style={styles.alertContainer}>
                            <View style={[styles.alertIconCircle, { backgroundColor: alertConfig.type === 'destructive' ? '#FFF1F0' : '#F0F7FF' }]}>
                                <Ionicons
                                    name={alertConfig.type === 'destructive' ? "alert-circle" : "information-circle"}
                                    size={32}
                                    color={alertConfig.type === 'destructive' ? "#D32F2F" : COLORS.primary}
                                />
                            </View>

                            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
                            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

                            <View style={styles.alertButtonRow}>
                                {alertConfig.onCancel && (
                                    <TouchableOpacity style={styles.alertBtnSecondary} onPress={alertConfig.onCancel}>
                                        <Text style={styles.alertBtnTextSecondary}>Voltar</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.alertBtnPrimary, { backgroundColor: alertConfig.type === 'destructive' ? "#D32F2F" : COLORS.primary }]}
                                    onPress={alertConfig.onConfirm}
                                >
                                    <Text style={styles.alertBtnTextPrimary}>
                                        {alertConfig.type === 'destructive' ? "Sim, Cancelar" : "OK"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.container}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.headerTitle}>Detalhes do Agendamento</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={COLORS.textMain} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.ticketCard}>
                            <TouchableOpacity style={styles.section} onPress={() => onNavigateToSalon(appointment.salonId)}>
                                <View style={styles.salonInfoRow}>
                                    <Image source={{ uri: appointment.salonImage }} style={styles.salonLogo} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.salonName}>{appointment.salonName}</Text>
                                        <Text style={styles.addressText} numberOfLines={1}>
                                            {appointment.address} <Ionicons name="chevron-forward" size={10} />
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.circleCutoutLeft} /><View style={styles.dashLine} /><View style={styles.circleCutoutRight} />
                            </View>

                            <View style={styles.section}>
                                {/* Ícone trocado para sparkles-outline (Brilhos/Serviço) */}
                                <DetailRow
                                    label="Serviço"
                                    value={appointment.serviceName}
                                    icon="sparkles-outline"
                                />

                                <TouchableOpacity onPress={() => onNavigateToProfessional(appointment.professionalId)}>
                                    <DetailRow
                                        label="Profissional"
                                        value={`${appointment.professionalName} (Ver Perfil)`}
                                        icon="person-outline"
                                    />
                                </TouchableOpacity>

                                <DetailRow
                                    label="Data e Horário"
                                    value={`${new Date(appointment.date).toLocaleDateString('pt-BR')} às ${appointment.time}`}
                                    icon="calendar-outline"
                                />
                            </View>

                            <View style={[styles.section, styles.priceSection]}>
                                <Text style={styles.priceLabel}>Valor total</Text>
                                <Text style={styles.priceValue}>R$ {appointment.price?.toFixed(2).replace('.', ',')}</Text>
                            </View>
                        </View>

                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={[styles.primaryAction, { backgroundColor: appointment.salonWhatsApp ? '#25D366' : COLORS.primary }]}
                                onPress={handleContact}
                            >
                                <Ionicons name={appointment.salonWhatsApp ? "logo-whatsapp" : "call"} size={20} color="#FFF" />
                                <Text style={styles.actionText}>
                                    {appointment.salonWhatsApp ? "Falar com o Salão" : "Ligar para o Salão"}
                                </Text>
                            </TouchableOpacity>

                            {isConfirmed && (
                                <TouchableOpacity
                                    style={[styles.secondaryAction, { borderColor: '#D32F2F', marginTop: 12 }]}
                                    onPress={handleCancelRequest}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? <ActivityIndicator size="small" color="#D32F2F" /> : <Text style={[styles.secondaryActionText, { color: '#D32F2F' }]}>Cancelar Agendamento</Text>}
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