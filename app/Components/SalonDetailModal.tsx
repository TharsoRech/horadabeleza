import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { salonDetailStyles as styles } from "@/app/Styles/salonDetailStyles";
import { COLORS } from "@/constants/theme";

// Models & Repositories
import { Salon } from '../Models/Salon';
import { Professional } from "@/app/Models/Professional";
import { Service, SubService } from "@/app/Models/Service"; // Importado SubService
import { Review } from "@/app/Models/Review";
import { SalonRepository } from "@/app/Repository/SalonRepository";

// Components
import { ModalDetailSkeleton } from "@/app/Components/AnimatedSkeleton";
import { ProfessionalDetailModal } from "@/app/Components/ProfessionalDetailModal";
import { DetailItem } from "@/app/Components/DetailItem";

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

    // Estados de Seleção de Agendamento
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null); // NOVO
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    // Modais e UI Control
    const [profDetailVisible, setProfDetailVisible] = useState(false);
    const [profForDetail, setProfForDetail] = useState<Professional | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Estados de Review
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    // Dados Carregados
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Lógica de Calendário
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

    // Busca de Dados Inicial
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

    // Busca de Horários Disponíveis
    useEffect(() => {
        if (selectedProf && selectedDate) {
            setLoadingTimes(true);
            setSelectedTime(null);
            repository.getAvailableTimes(selectedProf.id, selectedDate).then(times => {
                setAvailableTimes(times);
                setLoadingTimes(false);
            });
        }
    }, [selectedProf, selectedDate]);

    // Handlers
    const handleContact = () => {
        const whats = salon?.whatsApp;
        const phone = salon?.phone; // Corrigido aqui

        if (whats) {
            const cleanNumber = whats.replace(/\D/g, '');
            const finalNumber = cleanNumber.length === 11 ? `55${cleanNumber}` : cleanNumber;
            const msg = encodeURIComponent(`Olá, gostaria de falar sobre um agendamento no ${salon?.name}.`);
            const url = `https://wa.me/${finalNumber}?text=${msg}`;
            Linking.openURL(url).catch(() => {
                if (phone) Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
            });
        } else if (phone) {
            Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
        }
    };

    const handleFinalConfirm = () => {
        setShowConfirmPopup(false);
        setTimeout(() => setShowSuccessPopup(true), 450);
    };

    const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
        setTimeout(() => {
            onClose();
            setSelectedService(null);
            setSelectedSubService(null);
            setSelectedProf(null);
            setSelectedTime(null);
        }, 400);
    };

    if (!salon) return null;
    const canConfirm = selectedService && selectedSubService && selectedProf && selectedDate && selectedTime;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.content}>

                    <ProfessionalDetailModal
                        visible={profDetailVisible}
                        professional={profForDetail}
                        onClose={() => setProfDetailVisible(false)}
                        onOpenSalon={() => setProfDetailVisible(false)}
                    />

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
                                <TouchableOpacity
                                    style={[styles.contactBtn, { backgroundColor: salon.whatsApp ? '#25D366' : COLORS.primary }]}
                                    onPress={handleContact}
                                >
                                    <Ionicons name={salon.whatsApp ? "logo-whatsapp" : "call"} size={20} color="#FFF" />
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
                                        <Text style={styles.sectionTitle}>1. Escolha a categoria</Text>
                                        {allServices.map(s => (
                                            <View key={s.id} style={{ marginBottom: 10 }}>
                                                <TouchableOpacity
                                                    style={[styles.serviceRow, selectedService?.id === s.id && styles.selectedItem]}
                                                    onPress={() => { setSelectedService(s); setSelectedSubService(null); setSelectedProf(null); }}
                                                >
                                                    <Ionicons name={s.icon as any} size={20} color={selectedService?.id === s.id ? COLORS.primary : "#999"} />
                                                    <Text style={[styles.serviceLabel, { marginLeft: 12 }]}>{s.name}</Text>
                                                </TouchableOpacity>

                                                {/* LISTA DE SUB-SERVIÇOS */}
                                                {selectedService?.id === s.id && (
                                                    <View style={styles.subServiceWrapper}>
                                                        {s.subServices?.map(sub => (
                                                            <TouchableOpacity
                                                                key={sub.id}
                                                                style={[styles.subServiceCard, selectedSubService?.id === sub.id && styles.selectedSubCard]}
                                                                onPress={() => { setSelectedSubService(sub); setSelectedProf(null); }}
                                                            >
                                                                <View style={{flex: 1}}>
                                                                    <Text style={[styles.subServiceName, selectedSubService?.id === sub.id && {color: COLORS.primary}]}>{sub.name}</Text>
                                                                    <Text style={styles.subServiceDetails}>{sub.duration} • R$ {sub.price.toFixed(2).replace('.',',')}</Text>
                                                                </View>
                                                                <Ionicons
                                                                    name={selectedSubService?.id === sub.id ? "checkmark-circle" : "add-circle-outline"}
                                                                    size={22}
                                                                    color={selectedSubService?.id === sub.id ? COLORS.primary : "#CCC"}
                                                                />
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        ))}

                                        {selectedSubService && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>2. Escolha o profissional</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {allProfessionals.filter(p => p.serviceIds?.includes(selectedService?.id || "")).map(p => (
                                                        <View key={p.id} style={{ position: 'relative', marginRight: 15 }}>
                                                            <TouchableOpacity
                                                                style={[styles.profCard, selectedProf?.id === p.id && styles.selectedItem, { marginRight: 0 }]}
                                                                onPress={() => setSelectedProf(p)}
                                                            >
                                                                <Image source={{ uri: p.image || salon.image }} style={styles.profImageSmall} />
                                                                <Text style={styles.profName}>{p.name}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => { setProfForDetail(p); setProfDetailVisible(true); }} style={styles.infoIconBadge}>
                                                                <Ionicons name="information-circle" size={18} color={COLORS.primary} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}

                                        {selectedProf && (
                                            <View style={{ marginTop: 25 }}>
                                                <View style={styles.sectionHeaderRow}>
                                                    <Text style={styles.sectionTitle}>3. Selecione a data</Text>
                                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calendarTrigger}>
                                                        <Ionicons name="calendar" size={16} color={COLORS.primary} />
                                                        <Text style={styles.calendarTriggerText}>Outra data</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {dateList.map(item => (
                                                        <TouchableOpacity key={item.full} style={[styles.dateCard, selectedDate === item.full && styles.selectedItem]} onPress={() => { setSelectedDate(item.full); setSelectedTime(null); }}>
                                                            <Text style={[styles.dateMonth, selectedDate === item.full && {color: COLORS.primary}]}>{item.month}</Text>
                                                            <Text style={[styles.dateDay, selectedDate === item.full && {color: COLORS.primary}]}>{item.day}</Text>
                                                            <Text style={[styles.dateWeekday, selectedDate === item.full && {color: COLORS.primary}]}>{item.weekday}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                                {showDatePicker && <DateTimePicker style={{ marginTop: 25 }} value={new Date(selectedDate + "T12:00:00")} mode="date" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(false); if (d) setSelectedDate(d.toISOString().split('T')[0]); }} />}
                                            </View>
                                        )}

                                        {selectedDate && selectedProf && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>4. Horários disponíveis</Text>
                                                {loadingTimes ? <ActivityIndicator color={COLORS.primary} style={{marginTop: 10}} /> : (
                                                    <View style={styles.timeGrid}>
                                                        {availableTimes.map(t => (
                                                            <TouchableOpacity key={t} style={[styles.timeChip, selectedTime === t && styles.selectedTimeChip]} onPress={() => setSelectedTime(t)}>
                                                                <Text style={[styles.timeText, selectedTime === t && {color: '#FFF'}]}>{t}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}

                                {activeTab === 'Sobre' && (
                                    <View>
                                        <Text style={styles.sectionTitle}>Galeria</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                            {[salon.image, salon.image, salon.image].map((img, idx) => (
                                                <TouchableOpacity key={idx} onPress={() => setSelectedImage(img as string)}>
                                                    <Image source={{ uri: img }} style={styles.galleryImage} />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <Text style={styles.sectionTitle}>Nossa História</Text>
                                        <Text style={styles.descriptionText}>{salon.description}</Text>
                                    </View>
                                )}

                                {activeTab === 'Local' && (
                                    <View style={styles.localContainer}>
                                        <Ionicons name="map" size={48} color={COLORS.primary} />
                                        <Text style={styles.localTitle}>{salon.address}</Text>
                                        <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(Platform.OS === 'ios' ? `http://maps.apple.com/?q=${encodeURIComponent(salon.address)}` : `geo:0,0?q=${encodeURIComponent(salon.address)}`)}>
                                            <Text style={styles.bookBtnText}>Como chegar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {activeTab === 'Reviews' && (
                                    <View>
                                        {/* Lógica de Review simplificada para o exemplo */}
                                        <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
                                        {reviews.map(r => (
                                            <View key={r.id} style={styles.reviewCard}>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={{ fontWeight: 'bold' }}>{r.userName}</Text>
                                                    <Text style={{color: '#FFA800'}}>★ {r.rating}</Text>
                                                </View>
                                                <Text style={styles.reviewComment}>{r.comment}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* Popups de Confirmação e Sucesso */}
                    <Modal visible={showConfirmPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={styles.confirmCard}>
                                <Text style={styles.confirmTitle}>Confirmar Agendamento?</Text>
                                <View style={styles.confirmInfoBox}>
                                    <DetailItem icon="sparkles-outline" label="Serviço" value={`${selectedService?.name}: ${selectedSubService?.name}`} />
                                    <DetailItem icon="person" label="Profissional" value={selectedProf?.name} />
                                    <DetailItem icon="cash" label="Valor" value={`R$ ${selectedSubService?.price.toFixed(2).replace('.',',')}`} />
                                    <DetailItem icon="time" label="Horário" value={`${selectedTime} (${selectedSubService?.duration})`} />
                                </View>
                                <TouchableOpacity style={styles.confirmFinalBtn} onPress={handleFinalConfirm}>
                                    <Text style={styles.confirmFinalBtnText}>Agendar Agora</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginTop: 15, alignSelf: 'center'}} onPress={() => setShowConfirmPopup(false)}>
                                    <Text style={{color: '#999'}}>Ajustar detalhes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal visible={showSuccessPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={[styles.confirmCard, {alignItems: 'center'}]}>
                                <View style={styles.successBadge}><Ionicons name="checkmark" size={40} color="#FFF" /></View>
                                <Text style={[styles.confirmTitle, {marginTop: 10}]}>Tudo Pronto!</Text>
                                <Text style={{color: '#666', textAlign: 'center', marginBottom: 20}}>Seu horário foi reservado e o salão já foi notificado, ele confirmará em alguns minutos.</Text>
                                <TouchableOpacity style={[styles.confirmFinalBtn, {width: '100%'}]} onPress={handleCloseSuccess}>
                                    <Text style={styles.confirmFinalBtnText}>Beleza!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {activeTab === 'Serviços' && (
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.bookBtn, !canConfirm && { backgroundColor: '#EEE' }]} disabled={!canConfirm} onPress={() => setShowConfirmPopup(true)}>
                                <Text style={[styles.bookBtnText, !canConfirm && { color: '#999' }]}>
                                    {canConfirm ? `Confirmar para as ${selectedTime}` : "Selecione todos os passos"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
