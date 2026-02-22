import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Linking, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { salonDetailStyles as styles } from "@/app/Styles/salonDetailStyles";
import { COLORS } from "@/constants/theme";

// Models & Repository
import { Salon } from '../Models/Salon';
import { Professional } from "@/app/Models/Professional";
import { Service } from "@/app/Models/Service";
import { Review } from "@/app/Models/Review";
import { SalonRepository } from "@/app/Repository/SalonRepository";
import { ModalDetailSkeleton } from "@/app/Components/AnimatedSkeleton";

type TabType = 'Serviços' | 'Sobre' | 'Local' | 'Reviews';

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    repository: SalonRepository;
}

export const SalonDetailModal = ({ visible, salon, onClose, repository }: Props) => {
    const [activeTab, setActiveTab] = useState<TabType>('Serviços');
    const [loading, setLoading] = useState(true);
    const [loadingTimes, setLoadingTimes] = useState(false);

    // Estados de Seleção
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    // Modais e UI Control
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Dados Carregados
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Geração dinâmica dos 7 dias baseada na data selecionada
    const dateList = useMemo(() => {
        const anchorDate = new Date(selectedDate + "T12:00:00");
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(anchorDate);
            d.setDate(d.getDate() + i);
            return {
                full: d.toISOString().split('T')[0],
                day: d.toLocaleDateString('pt-BR', { day: 'numeric' }),
                month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
                weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
            };
        });
    }, [selectedDate]);

    useEffect(() => {
        if (visible && salon) {
            async function fetchData() {
                setLoading(true);
                try {
                    const [services, pros, revs] = await Promise.all([
                        repository.getSalonServices(salon?.serviceIds ?? []),
                        repository.getSalonProfessionals(salon?.professionalIds ?? []),
                        repository.getSalonReviews(salon?.id ?? "")
                    ]);
                    setAllServices(services);
                    setAllProfessionals(pros);
                    setReviews(revs);
                } catch (e) { console.error(e); }
                finally { setLoading(false); }
            }
            fetchData();
        }
    }, [visible, salon]);

    useEffect(() => {
        if (selectedProf && selectedDate) {
            setLoadingTimes(true);
            setSelectedTime(null);
            repository.getAvailableTimes(selectedProf.id, selectedDate)
                .then(times => {
                    setAvailableTimes(times);
                    setLoadingTimes(false);
                });
        }
    }, [selectedProf, selectedDate]);

    // Handlers
    const handleFinalConfirm = () => {
        setShowConfirmPopup(false);
        // Pequeno delay para a animação do primeiro modal sair
        setTimeout(() => {
            setShowSuccessPopup(true);
        }, 450);
    };

    const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
        setTimeout(() => {
            onClose();
            // Reseta para o estado inicial para o próximo uso
            setSelectedService(null);
            setSelectedProf(null);
            setSelectedTime(null);
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }, 400);
    };

    const handleContact = async () => {
        if (!salon) return;
        const phone = salon.whatsApp || salon.phone;
        const cleanPhone = phone?.replace(/\D/g, '');
        const whatsappUrl = `whatsapp://send?phone=${cleanPhone}`;
        try {
            const canOpen = await Linking.canOpenURL(whatsappUrl);
            if (canOpen) return await Linking.openURL(whatsappUrl);
            await Linking.openURL(`https://wa.me/${cleanPhone}`);
        } catch (e) {
            Alert.alert("Contato", `Número: ${phone}`);
        }
    };

    if (!salon) return null;
    const canConfirm = selectedService && selectedProf && selectedDate && selectedTime;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close" size={22} color={COLORS.textMain} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
                        <View style={styles.imageHeader}>
                            <Image source={{ uri: salon.image }} style={styles.bannerImage} />
                        </View>

                        <View style={styles.profileSection}>
                            <View style={styles.logoContainer}>
                                <Image source={{ uri: salon.image }} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.headerInfoRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.salonName}>{salon.name}</Text>
                                    <View style={styles.addressRow}>
                                        <Ionicons name="location" size={14} color={COLORS.primary} />
                                        <Text style={styles.addressText} numberOfLines={1}>{salon.address}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={handleContact}>
                                    <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.tabBarWrapper}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                                {(['Serviços', 'Sobre', 'Local', 'Reviews'] as TabType[]).map((tab) => (
                                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
                                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {loading ? <ModalDetailSkeleton /> : (
                            <View style={{ padding: 20 }}>
                                {activeTab === 'Serviços' && (
                                    <View>
                                        <Text style={styles.sectionTitle}>1. Escolha o serviço</Text>
                                        {allServices.map(s => (
                                            <TouchableOpacity
                                                key={s.id}
                                                style={[styles.serviceRow, selectedService?.id === s.id && styles.selectedItem]}
                                                onPress={() => { setSelectedService(s); setSelectedProf(null); }}
                                            >
                                                <Ionicons name={s.icon as any} size={20} color={selectedService?.id === s.id ? COLORS.primary : "#999"} />
                                                <Text style={[styles.serviceLabel, { marginLeft: 12 }]}>{s.name}</Text>
                                            </TouchableOpacity>
                                        ))}

                                        {selectedService && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>2. Escolha o profissional</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {allProfessionals.filter(p => p.serviceIds?.includes(selectedService.id)).map(p => (
                                                        <TouchableOpacity
                                                            key={p.id}
                                                            style={[styles.profCard, selectedProf?.id === p.id && styles.selectedItem]}
                                                            onPress={() => setSelectedProf(p)}
                                                        >
                                                            <Image source={{ uri: p.image || salon.image }} style={styles.profImageSmall} />
                                                            <Text style={styles.profName} numberOfLines={1}>{p.name}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}

                                        {selectedProf && (
                                            <View style={{ marginTop: 25 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                    <Text style={styles.sectionTitle}>3. Selecione a data</Text>
                                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Ionicons name="calendar" size={16} color={COLORS.primary} />
                                                        <Text style={{color: COLORS.primary, fontWeight: 'bold', marginLeft: 4}}>Calendário</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {dateList.map(item => (
                                                        <TouchableOpacity
                                                            key={item.full}
                                                            style={[styles.dateCard, selectedDate === item.full && styles.selectedItem, {minWidth: 75, height: 85}]}
                                                            onPress={() => { setSelectedDate(item.full); setSelectedTime(null); }}
                                                        >
                                                            <Text style={[styles.dateMonth, selectedDate === item.full && {color: COLORS.primary}]}>{item.month}</Text>
                                                            <Text style={[styles.dateDay, selectedDate === item.full && {color: COLORS.primary}]}>{item.day}</Text>
                                                            <Text style={[styles.dateWeekday, selectedDate === item.full && {color: COLORS.primary}]}>{item.weekday}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>

                                                {showDatePicker && (
                                                        <DateTimePicker
                                                            value={new Date(selectedDate + "T12:00:00")}
                                                            mode="date"
                                                            style={{ marginTop: 25 }}
                                                            minimumDate={new Date()}
                                                            onChange={(e, d) => {
                                                                setShowDatePicker(false);
                                                                if (d) setSelectedDate(d.toISOString().split('T')[0]);
                                                            }}
                                                        />
                                                )}
                                            </View>
                                        )}

                                        {selectedDate && selectedProf && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>4. Horários disponíveis</Text>
                                                {loadingTimes ? <Text style={{color: '#999'}}>Buscando...</Text> : (
                                                    <View style={styles.timeGrid}>
                                                        {availableTimes.map(t => (
                                                            <TouchableOpacity
                                                                key={t}
                                                                style={[styles.timeChip, selectedTime === t && styles.selectedTimeChip]}
                                                                onPress={() => setSelectedTime(t)}
                                                            >
                                                                <Text style={[styles.timeText, selectedTime === t && {color: '#FFF'}]}>{t}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}
                                {/* Outras abas aqui... */}
                            </View>
                        )}
                    </ScrollView>

                    {/* Popup de Revisão (Antes de Confirmar) */}
                    <Modal visible={showConfirmPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={styles.confirmCard}>
                                <Text style={styles.confirmTitle}>Revisar Agendamento</Text>
                                <View style={styles.confirmInfoBox}>
                                    <DetailItem icon="cut" label="Serviço" value={selectedService?.name} />
                                    <DetailItem icon="person" label="Profissional" value={selectedProf?.name} />
                                    <DetailItem icon="calendar" label="Data" value={new Date(selectedDate + "T12:00:00").toLocaleDateString('pt-BR', {dateStyle: 'long'})} />
                                    <DetailItem icon="time" label="Horário" value={selectedTime} />
                                </View>
                                <TouchableOpacity style={styles.confirmFinalBtn} onPress={handleFinalConfirm}>
                                    <Text style={styles.confirmFinalBtnText}>Confirmar Agora</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginTop: 15, alignSelf: 'center'}} onPress={() => setShowConfirmPopup(false)}>
                                    <Text style={{color: '#999'}}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Popup de Sucesso Personalizado */}
                    <Modal visible={showSuccessPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={[styles.confirmCard, {alignItems: 'center', paddingVertical: 40}]}>
                                <View style={styles.successIconContainer}>
                                    <Ionicons name="checkmark" size={50} color="#FFF" />
                                </View>
                                <Text style={[styles.confirmTitle, {marginTop: 20}]}>Tudo pronto!</Text>
                                <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>Seu agendamento foi realizado com sucesso.</Text>
                                <TouchableOpacity style={[styles.confirmFinalBtn, {width: '100%'}]} onPress={handleCloseSuccess}>
                                    <Text style={styles.confirmFinalBtnText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {activeTab === 'Serviços' && (
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.bookBtn, !canConfirm && { backgroundColor: '#EEE' }]}
                                disabled={!canConfirm}
                                onPress={() => setShowConfirmPopup(true)}
                            >
                                <Text style={[styles.bookBtnText, !canConfirm && { color: '#999' }]}>
                                    {canConfirm ? `Agendar para ${selectedTime}` : "Complete a seleção"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

// Componente Interno para Detalhes do Resumo
const DetailItem = ({ icon, label, value }: any) => (
    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
        <View style={{width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 12}}>
            <Ionicons name={icon} size={16} color={COLORS.primary} />
        </View>
        <View>
            <Text style={{fontSize: 10, color: '#999', textTransform: 'uppercase'}}>{label}</Text>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: COLORS.textMain}}>{value}</Text>
        </View>
    </View>
);