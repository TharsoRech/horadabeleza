import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Appointment } from '../Models/Appointment';
import { IAppointmentRepository } from '../Repository/Interfaces/IAppointmentRepository';
import { UserRole } from '../Models/UserProfile';
import { detailStyles as styles } from "../Styles/appointmentDetailStyles";

interface Props {
    visible: boolean;
    appointment: Appointment | null;
    userRole?: UserRole;
    isManager?: boolean; // Nova prop para definir se tem poder de edição/gestão
    repository: IAppointmentRepository;
    onClose: () => void;
    onRefresh: () => void;
    onNavigateToSalon: (id: string) => void;
    onNavigateToProfessional: (id: string) => void;
}

export const AppointmentDetailModal = ({
                                           visible,
                                           appointment,
                                           userRole,
                                           isManager = false, // Padrão falso
                                           repository,
                                           onClose,
                                           onRefresh,
                                           onNavigateToSalon,
                                           onNavigateToProfessional
                                       }: Props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'destructive',
        onConfirm: () => { },
        onCancel: undefined as (() => void) | undefined
    });

    if (!appointment) return null;

    // Lógica de permissões baseada na prop isManager
    const canCancel = appointment.status === 'Confirmado' || appointment.status === 'Pendente';
    const canConfirm = appointment.status === 'Pendente' && isManager;

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
            "Cancelar Agendamento",
            "Deseja realmente cancelar este horário?",
            'destructive',
            async () => {
                hideAlert();
                setIsProcessing(true);
                try {
                    const success = await repository.updateAppointmentStatus(appointment.id, 'Cancelado');
                    if (success) {
                        onRefresh();
                        onClose();
                    }
                } catch (error) {
                    showAlert("Erro", "Falha ao processar cancelamento.", "destructive");
                } finally {
                    setIsProcessing(false);
                }
            },
            () => hideAlert()
        );
    };

    const handleConfirmRequest = async () => {
        setIsProcessing(true);
        try {
            const success = await repository.updateAppointmentStatus(appointment.id, 'Confirmado');
            if (success) {
                onRefresh();
                onClose();
            }
        } catch (error) {
            showAlert("Erro", "Falha ao confirmar agendamento.", "destructive");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContact = () => {
        // Se for gestor, o contato principal é o do cliente. Se for cliente, o contato é o do salão.
        const targetPhone = isManager ? appointment.clientPhone : (appointment.salonWhatsApp || appointment.salonPhone);
        const targetName = isManager ? appointment.clientName : appointment.salonName;

        if (targetPhone) {
            const cleanNumber = targetPhone.replace(/\D/g, '');
            const finalNumber = cleanNumber.length === 11 ? `55${cleanNumber}` : cleanNumber;
            const msg = encodeURIComponent(`Olá ${targetName}, gostaria de falar sobre o agendamento do serviço ${appointment.serviceName}.`);
            const url = `https://wa.me/${finalNumber}?text=${msg}`;

            Linking.openURL(url).catch(() => Linking.openURL(`tel:${cleanNumber}`));
        } else {
            showAlert("Atenção", "Nenhum número de contato disponível.", "info");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>

                {/* ALERTA INTERNO */}
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
                                    <Text style={styles.alertBtnTextPrimary}>Confirmar</Text>
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

                            <View style={styles.section}>
                                <TouchableOpacity
                                    style={styles.salonInfoRow}
                                    onPress={() => onNavigateToSalon(appointment.salonId)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: appointment.salonImage || 'https://via.placeholder.com/150' }}
                                        style={styles.salonLogo}
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.salonName}>{appointment.salonName}</Text>
                                            <Ionicons name="chevron-forward" size={14} color="#CCC" style={{ marginLeft: 4 }} />
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <Ionicons name="location-outline" size={13} color="#666" />
                                            <Text style={[styles.addressText, { marginLeft: 4 }]} numberOfLines={1}>
                                                {appointment.address}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={styles.circleCutoutLeft} /><View style={styles.dashLine} /><View style={styles.circleCutoutRight} />
                            </View>

                            <View style={styles.section}>
                                <DetailRow label="Serviço" value={appointment.serviceName} icon="sparkles-outline" />

                                <DetailRow label="Duração" value={appointment.duration || "Não informada"} icon="time-outline" />

                                {isManager && (
                                    <DetailRow
                                        label="Cliente"
                                        value={`${appointment.clientName || 'Não informado'} ${appointment.clientPhone ? `(${appointment.clientPhone})` : ''}`}
                                        icon="people-outline"
                                    />
                                )}

                                <TouchableOpacity
                                    onPress={() => onNavigateToProfessional(appointment.professionalId)}
                                    activeOpacity={0.7}
                                    style={{ marginVertical: 4 }}
                                >
                                    <DetailRow
                                        label="Profissional"
                                        value={`${appointment.professionalName} ${userRole === UserRole.PROFISSIONAL ? '(Você)' : '>'}`}
                                        icon="person-outline"
                                    />
                                </TouchableOpacity>

                                <DetailRow
                                    label="Data e Horário"
                                    value={`${appointment.date.split('T')[0]} às ${appointment.time}`}
                                    icon="calendar-outline"
                                />

                                {appointment.notes && (
                                    <DetailRow label="Notas" value={appointment.notes} icon="document-text-outline" />
                                )}
                            </View>

                            <View style={[styles.section, styles.priceSection]}>
                                <Text style={styles.priceLabel}>Valor do Serviço</Text>
                                <Text style={styles.priceValue}>R$ {appointment.price?.toFixed(2).replace('.', ',')}</Text>
                            </View>
                        </View>

                        <View style={styles.actionContainer}>
                            {canConfirm && (
                                <TouchableOpacity
                                    style={[styles.primaryAction, { backgroundColor: '#4CAF50', marginBottom: 12 }]}
                                    onPress={handleConfirmRequest}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ?
                                        <ActivityIndicator size="small" color="#FFF" /> :
                                        <>
                                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                                            <Text style={styles.actionText}>Confirmar Agendamento</Text>
                                        </>
                                    }
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={[styles.primaryAction, { backgroundColor: '#25D366' }]} onPress={handleContact}>
                                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                                <Text style={styles.actionText}>{isManager ? 'Contatar Cliente' : 'Contatar Salão'}</Text>
                            </TouchableOpacity>

                            {canCancel && (
                                <TouchableOpacity
                                    style={[styles.secondaryAction, { borderColor: '#D32F2F', marginTop: 12 }]}
                                    onPress={handleCancelRequest}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ?
                                        <ActivityIndicator size="small" color="#D32F2F" /> :
                                        <Text style={[styles.secondaryActionText, { color: '#D32F2F' }]}>Cancelar Horário</Text>
                                    }
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
        <View style={{ flex: 1 }}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>
    </View>
);