import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Linking, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { salonDetailStyles as styles } from "@/app/Styles/salonDetailStyles";
import { COLORS } from "@/constants/theme";

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

    // Estados de Review
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    // Dados Carregados
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

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
            repository.getAvailableTimes(selectedProf.id, selectedDate).then(times => {
                setAvailableTimes(times);
                setLoadingTimes(false);
            });
        }
    }, [selectedProf, selectedDate]);

    // Handlers
    const handleFinalConfirm = () => {
        setShowConfirmPopup(false);
        setTimeout(() => setShowSuccessPopup(true), 450);
    };

    const handleCloseSuccess = () => {
        setShowSuccessPopup(false);
        setTimeout(() => {
            onClose();
            setSelectedService(null);
            setSelectedProf(null);
            setSelectedTime(null);
        }, 400);
    };

    const handleSendReview = () => {
        if (newRating === 0) return;
        const reviewObj: Review = {
            salonId: salon?.id ?? "",
            id: String(Date.now()),
            userName: "Você",
            rating: newRating,
            comment: newComment,
            createdAt: new Date().toISOString(),
            userId: "current"
        };
        setReviews([reviewObj, ...reviews]);
        setNewRating(0);
        setNewComment("");
    };

    if (!salon) return null;
    const canConfirm = selectedService && selectedProf && selectedDate && selectedTime;

    return (
        <Modal visible={visible} animationType="slide" transparent>
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
                                <TouchableOpacity
                                    style={[styles.contactBtn, { backgroundColor: '#25D366' }]}
                                    onPress={() => Linking.openURL(`https://wa.me/${salon.whatsApp?.replace(/\D/g, '')}`)}
                                >
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
                                            <TouchableOpacity key={s.id} style={[styles.serviceRow, selectedService?.id === s.id && styles.selectedItem]} onPress={() => { setSelectedService(s); setSelectedProf(null); }}>
                                                <Ionicons name={s.icon as any} size={20} color={selectedService?.id === s.id ? COLORS.primary : "#999"} />
                                                <Text style={[styles.serviceLabel, { marginLeft: 12 }]}>{s.name}</Text>
                                            </TouchableOpacity>
                                        ))}

                                        {selectedService && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>2. Escolha o profissional</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {allProfessionals.filter(p => p.serviceIds?.includes(selectedService.id)).map(p => (
                                                        <TouchableOpacity key={p.id} style={[styles.profCard, selectedProf?.id === p.id && styles.selectedItem]} onPress={() => setSelectedProf(p)}>
                                                            <Image source={{ uri: p.image || salon.image }} style={styles.profImageSmall} />
                                                            <Text style={styles.profName}>{p.name}</Text>
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
                                                        <TouchableOpacity key={item.full} style={[styles.dateCard, selectedDate === item.full && styles.selectedItem, {minWidth: 75, height: 85}]} onPress={() => { setSelectedDate(item.full); setSelectedTime(null); }}>
                                                            <Text style={[styles.dateMonth, selectedDate === item.full && {color: COLORS.primary}]}>{item.month}</Text>
                                                            <Text style={[styles.dateDay, selectedDate === item.full && {color: COLORS.primary}]}>{item.day}</Text>
                                                            <Text style={[styles.dateWeekday, selectedDate === item.full && {color: COLORS.primary}]}>{item.weekday}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                                {showDatePicker && <DateTimePicker style={{marginTop: 20}} value={new Date(selectedDate + "T12:00:00")} mode="date" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(false); if (d) setSelectedDate(d.toISOString().split('T')[0]); }} />}
                                            </View>
                                        )}

                                        {selectedDate && selectedProf && (
                                            <View style={{ marginTop: 25 }}>
                                                <Text style={styles.sectionTitle}>4. Horários disponíveis</Text>
                                                {loadingTimes ? <Text style={{color: '#999'}}>Buscando...</Text> : (
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
                                        {salon.userHasVisited ? (
                                            <View style={styles.reviewForm}>
                                                <Text style={styles.sectionTitle}>Avaliar atendimento</Text>
                                                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                                                            <Ionicons name={s <= newRating ? "star" : "star-outline"} size={26} color="#FFA800" />
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                                <TextInput
                                                    style={styles.reviewInput}
                                                    placeholder="Como foi sua experiência?"
                                                    multiline
                                                    value={newComment}
                                                    onChangeText={setNewComment}
                                                />
                                                {newRating > 0 && (
                                                    <TouchableOpacity style={styles.sendReviewBtn} onPress={handleSendReview}>
                                                        <Text style={styles.sendReviewBtnText}>Publicar Avaliação</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={styles.lockWarning}>
                                                <Ionicons name="lock-closed" size={18} color="#999" />
                                                <Text style={styles.lockText}>Apenas clientes que realizaram agendamentos podem avaliar.</Text>
                                            </View>
                                        )}

                                        <View style={{marginTop: 20}}>
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
                                    </View>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* MODAL: IMAGEM EXPANDIDA */}
                    <Modal visible={!!selectedImage} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ position: 'absolute', top: 50, right: 25, zIndex: 10 }} onPress={() => setSelectedImage(null)}>
                                <Ionicons name="close-circle" size={40} color="#FFF" />
                            </TouchableOpacity>
                            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '70%', resizeMode: 'contain' }} />}
                        </View>
                    </Modal>

                    {/* POPUP: REVISÃO ANTES DE AGENDAR */}
                    <Modal visible={showConfirmPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={styles.confirmCard}>
                                <Text style={styles.confirmTitle}>Confirmar Agendamento?</Text>
                                <View style={styles.confirmInfoBox}>
                                    <DetailItem icon="cut" label="Serviço" value={selectedService?.name} />
                                    <DetailItem icon="person" label="Profissional" value={selectedProf?.name} />
                                    <DetailItem icon="calendar" label="Data" value={new Date(selectedDate + "T12:00:00").toLocaleDateString('pt-BR', { dateStyle: 'long' })} />
                                    <DetailItem icon="time" label="Horário" value={selectedTime} />
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

                    {/* POPUP: SUCESSO (COM INFORMAÇÕES) */}
                    <Modal visible={showSuccessPopup} transparent animationType="fade">
                        <View style={styles.modalConfirmOverlay}>
                            <View style={[styles.confirmCard, {alignItems: 'center'}]}>
                                <View style={styles.successIconContainer}><Ionicons name="checkmark" size={50} color="#FFF" /></View>
                                <Text style={[styles.confirmTitle, {marginTop: 10}]}>Tudo Pronto!</Text>
                                <Text style={{color: '#666', marginBottom: 20}}>Agendamento realizado com sucesso.</Text>

                                <View style={[styles.confirmInfoBox, {width: '100%', backgroundColor: '#F9F9F9', borderWidth: 0}]}>
                                    <DetailItem icon="person" label="Com" value={selectedProf?.name} />
                                    <DetailItem icon="calendar" label="Dia" value={new Date(selectedDate + "T12:00:00").toLocaleDateString('pt-BR')} />
                                    <DetailItem icon="time" label="Às" value={selectedTime} />
                                </View>

                                <TouchableOpacity style={[styles.confirmFinalBtn, {width: '100%', marginTop: 20}]} onPress={handleCloseSuccess}>
                                    <Text style={styles.confirmFinalBtnText}>Entendido</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {activeTab === 'Serviços' && (
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.bookBtn, !canConfirm && { backgroundColor: '#EEE' }]} disabled={!canConfirm} onPress={() => setShowConfirmPopup(true)}>
                                <Text style={[styles.bookBtnText, !canConfirm && { color: '#999' }]}>{canConfirm ? `Agendar para as ${selectedTime}` : "Selecione os detalhes"}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const DetailItem = ({ icon, label, value }: any) => (
    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <View style={{width: 28, height: 28, borderRadius: 6, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
            <Ionicons name={icon} size={14} color={COLORS.primary} />
        </View>
        <View>
            <Text style={{fontSize: 9, color: '#999', textTransform: 'uppercase'}}>{label}</Text>
            <Text style={{fontSize: 13, fontWeight: 'bold', color: COLORS.textMain}} numberOfLines={1}>{value}</Text>
        </View>
    </View>
);