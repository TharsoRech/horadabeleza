import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { appointmentStyles as styles } from "@/app/Styles/appointmentStyles";
import { Appointment } from '@/app/Models/Appointment';
import { Salon } from '@/app/Models/Salon';
import { Professional } from '@/app/Models/Professional';
import { COLORS } from '@/constants/theme';

import { AppointmentRepository } from '@/app/Repository/AppointmentRepository';
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { ProfessionalRepository } from '@/app/Repository/ProfessionalRepository';
import { useAuth } from "@/app/Managers/AuthManager";

import { SearchResultSkeleton } from '@/app/Components/AnimatedSkeleton';
import { AppointmentDetailModal } from '@/app/Components/AppointmentDetailModal';
import { AuthGuardPlaceholder } from '@/app/Components/AuthGuardPlaceholder';
import { AppointmentCard } from "@/app/Components/AppointmentCard";

import { SalonDetailModal } from '@/app/Components/SalonDetailModal';
import { ProfessionalDetailModal } from '@/app/Components/ProfessionalDetailModal';

type SubTab = 'unidade' | 'meus_horarios';

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated, currentUser } = useAuth();
    const isClient = currentUser?.role === 'client';

    const appointmentRepo = useMemo(() => new AppointmentRepository(), []);
    const salonRepo = useMemo(() => new SalonRepository(), []);
    const profRepo = useMemo(() => new ProfessionalRepository(), []);

    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState<SubTab>(isClient ? 'meus_horarios' : 'unidade');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState<Appointment['status']>('Confirmado');
    const [showCancelled, setShowCancelled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [navLoading, setNavLoading] = useState(false);

    const [units, setUnits] = useState<Salon[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<Salon | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [apptModalVisible, setApptModalVisible] = useState(false);
    const [selectedSalonData, setSelectedSalonData] = useState<Salon | null>(null);
    const [salonModalVisible, setSalonModalVisible] = useState(false);
    const [selectedProfData, setSelectedProfData] = useState<Professional | null>(null);
    const [profModalVisible, setProfModalVisible] = useState(false);

    // --- LÓGICA DE TIMELINE ---
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 8; hour <= 21; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    }, []);

    // Função auxiliar para cores de status
    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'Confirmado': return '#4CAF50'; // Verde
            case 'Pendente': return '#FF9800';   // Laranja
            case 'Concluído': return '#2196F3';  // Azul
            case 'Cancelado': return '#F44336';  // Vermelho
            default: return COLORS.primary;
        }
    };

    const changeDate = (amount: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + amount);
        setSelectedDate(newDate);
    };

    const daysHeader = useMemo(() => {
        const days = [];
        const startPoint = new Date(selectedDate);
        startPoint.setDate(selectedDate.getDate() - 2);
        for (let i = 0; i < 14; i++) {
            const date = new Date(startPoint);
            date.setDate(startPoint.getDate() + i);
            days.push(date);
        }
        return days;
    }, [selectedDate]);

    // --- NAVEGAÇÃO ---
    const handleNavigateToSalon = async (salonId?: string) => {
        const id = salonId || selectedAppt?.salonId;
        if (!id) return;
        setNavLoading(true);
        try {
            const data = await salonRepo.getSalonById(id);
            if (data) {
                setSelectedSalonData(data);
                setApptModalVisible(false);
                setProfModalVisible(false);
                setSalonModalVisible(true);
            }
        } catch (error) { console.error(error); } finally { setNavLoading(false); }
    };

    const handleNavigateToProfessional = async () => {
        if (!selectedAppt?.professionalId) return;
        setNavLoading(true);
        try {
            const profData = await profRepo.getProfessionalById(selectedAppt.professionalId);
            if (profData) {
                setSelectedProfData(profData);
                setApptModalVisible(false);
                setProfModalVisible(true);
            }
        } catch (error) { console.error(error); } finally { setNavLoading(false); }
    };

    // --- CARREGAMENTO ---
    useEffect(() => {
        if (!isAuthenticated || !currentUser?.id || isClient) {
            if(isClient) setLoading(false);
            return;
        }
        let isMounted = true;
        const fetchUnits = async () => {
            setLoading(true);
            try {
                const mySalons = await salonRepo.getSalonsByProfessional(currentUser.id);
                if (isMounted) {
                    setUnits(mySalons);
                    if (mySalons.length > 0) setSelectedUnit(mySalons[0]);
                    else setLoading(false);
                }
            } catch (error) { if (isMounted) setLoading(false); }
        };
        fetchUnits();
        return () => { isMounted = false; };
    }, [currentUser?.id, salonRepo, isAuthenticated, isClient]);

    const loadData = useCallback(async () => {
        if (!currentUser) return;
        if (!isClient && activeTab === 'unidade' && units.length === 0) {
            setAppointments([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let data: Appointment[] = [];
            if (activeTab === 'unidade' && selectedUnit) {
                data = await appointmentRepo.getAppointmentsByUnitAndDate(
                    selectedUnit.id,
                    selectedDate,
                    selectedUnit.isAdmin ? undefined : currentUser.id
                );
                if (!showCancelled) data = data.filter(app => app.status !== 'Cancelado');
            } else {
                const statusData = await appointmentRepo.getAppointmentsByStatus(selectedStatus);
                data = statusData.filter(app =>
                    isClient ? app.clientId === currentUser.id : app.professionalId === currentUser.id
                );
            }
            setAppointments(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [currentUser, activeTab, selectedDate, selectedStatus, selectedUnit, units.length, showCancelled, appointmentRepo, isClient]);

    useEffect(() => {
        if (isAuthenticated) loadData();
    }, [loadData, isAuthenticated]);

    // --- RENDERIZADORES ---
    const renderTimelineItem = (time: string) => {
        const apptsAtTime = appointments.filter(a => a.time === time);
        return (
            <View style={styles.timelineRow}>
                <View style={styles.hourCol}>
                    <Text style={styles.hourText}>{time}</Text>
                </View>
                <View style={styles.eventsCol}>
                    {apptsAtTime.length > 0 ? (
                        apptsAtTime.map((appt) => {
                            const statusColor = getStatusColor(appt.status);
                            return (
                                <TouchableOpacity
                                    key={appt.id}
                                    style={[styles.timelineCard, appt.status === 'Cancelado' && { opacity: 0.6 }]}
                                    onPress={() => { setSelectedAppt(appt); setApptModalVisible(true); }}
                                >
                                    <View style={[styles.cardIndicator, { backgroundColor: statusColor }]} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.cardHeaderRow}>
                                            <Text style={styles.clientName}>{appt.clientName}</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                                                <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                                                    {appt.status.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.profRow}>
                                            <Ionicons name="cut-outline" size={12} color="#666" />
                                            <Text style={styles.profName}>{appt.professionalName}</Text>
                                        </View>
                                        <Text style={styles.serviceName}>{appt.serviceName}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color="#CCC" />
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View style={styles.emptySlotLine} />
                    )}
                </View>
            </View>
        );
    };

    if (!isAuthenticated) {
        return <AuthGuardPlaceholder title="Sua Agenda" description="Faça login para gerenciar seus agendamentos." icon="calendar-outline" />;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {navLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}

            <View style={styles.header}>
                <Text style={styles.title}>Agendamentos</Text>
                {!isClient && (
                    <View style={styles.subTabRow}>
                        <TouchableOpacity onPress={() => setActiveTab('unidade')} style={[styles.subTabBtn, activeTab === 'unidade' && styles.subTabBtnActive]}>
                            <Text style={[styles.subTabText, activeTab === 'unidade' && styles.subTabTextActive]}>Unidade</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('meus_horarios')} style={[styles.subTabBtn, activeTab === 'meus_horarios' && styles.subTabBtnActive]}>
                            <Text style={[styles.subTabText, activeTab === 'meus_horarios' && styles.subTabTextActive]}>Pessoal</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.infoBox}>
                <Ionicons name={activeTab === 'unidade' ? (selectedUnit?.isAdmin ? "shield-checkmark" : "business") : "person-circle"} size={22} color={COLORS.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoTitle}>
                        {activeTab === 'unidade' ? (selectedUnit?.isAdmin ? "Gestão Administrativa" : "Agenda da Unidade") : "Meus Agendamentos"}
                    </Text>
                    <Text style={styles.infoText}>
                        {activeTab === 'unidade'
                            ? (selectedUnit ? `Atuando em ${selectedUnit.name}` : "Nenhuma unidade vinculada")
                            : (isClient ? "Acompanhe seus horários marcados." : "Filtre seus atendimentos por status.")}
                    </Text>
                </View>
            </View>

            {activeTab === 'unidade' ? (
                <View style={{ backgroundColor: '#FFF' }}>
                    {units.length > 0 && (
                        <View>
                            <Text style={styles.sectionLabel}>Minhas Unidades</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelectorBar} contentContainerStyle={{ paddingHorizontal: 20 }}>
                                {units.map((unit) => (
                                    <TouchableOpacity key={unit.id} style={[styles.unitChip, selectedUnit?.id === unit.id && styles.activeUnitChip]} onPress={() => setSelectedUnit(unit)}>
                                        {unit.isAdmin && <Ionicons name="shield-checkmark" size={12} color={selectedUnit?.id === unit.id ? "#FFF" : COLORS.primary} style={{marginRight: 4}} />}
                                        <Text style={[styles.unitText, selectedUnit?.id === unit.id && styles.activeUnitText]}>{unit.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.calendarContainer}>
                        <View style={styles.monthHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => changeDate(-1)} style={{ padding: 5 }}>
                                    <Ionicons name="chevron-back" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                                <Text style={[styles.monthTitle, { marginHorizontal: 8 }]}>
                                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                                </Text>
                                <TouchableOpacity onPress={() => changeDate(1)} style={{ padding: 5 }}>
                                    <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.adminToggleRow}>
                                <Text style={styles.toggleLabel}>Ver Cancelados</Text>
                                <Switch value={showCancelled} onValueChange={setShowCancelled} trackColor={{ false: "#DDD", true: COLORS.primary }} style={{ transform: [{ scale: 0.6 }] }} />
                            </View>
                        </View>

                        <View style={styles.calendarHeaderContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateBar} contentContainerStyle={{ paddingHorizontal: 20 }}>
                                {daysHeader.map((date, idx) => {
                                    const isSelected = date.toDateString() === selectedDate.toDateString();
                                    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').substring(0, 3).toUpperCase();
                                    return (
                                        <TouchableOpacity key={idx} style={[styles.dateChip, isSelected && styles.activeDateChip]} onPress={() => setSelectedDate(date)}>
                                            <Text style={[styles.dateDayName, isSelected && styles.activeDateText]}>{dayName}</Text>
                                            <Text style={[styles.dateDayNumber, isSelected && styles.activeDateText]}>{date.getDate()}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            <TouchableOpacity style={styles.miniCalendarBtn} onPress={() => setDatePickerVisibility(true)}>
                                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={{ backgroundColor: '#FFF', paddingBottom: 10 }}>
                    <Text style={styles.sectionLabel}>Filtrar por Status</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterContainer, { paddingHorizontal: 20 }]}>
                        {['Confirmado', 'Pendente', 'Concluído', 'Cancelado'].map((status) => (
                            <TouchableOpacity key={status} style={[styles.filterChip, selectedStatus === status && styles.activeFilterChip]} onPress={() => setSelectedStatus(status as any)}>
                                <Text style={[status === selectedStatus ? styles.activeFilterText : styles.filterText]}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {loading ? <SearchResultSkeleton /> : (
                <FlatList
                    data={(activeTab === 'unidade' ? timeSlots : appointments) as any[]}
                    keyExtractor={(item, index) => activeTab === 'unidade' ? `slot-${index}` : (item as Appointment).id}
                    renderItem={({ item }) => {
                        if (activeTab === 'unidade') return renderTimelineItem(item as string);
                        return (
                            <AppointmentCard
                                item={item as Appointment}
                                isProfessionalView={!isClient}
                                canEdit={!isClient && (selectedUnit?.isAdmin || (item as Appointment).professionalId === currentUser?.id)}
                                onPress={(it) => { setSelectedAppt(it); setApptModalVisible(true); }}
                            />
                        );
                    }}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={activeTab !== 'unidade' ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={40} color="#DDD" />
                            <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
                        </View>
                    ) : null}
                />
            )}

            <AppointmentDetailModal
                isManager={activeTab === 'unidade' ? selectedUnit?.isAdmin :false}
                visible={apptModalVisible} appointment={selectedAppt} userRole={currentUser?.role} repository={appointmentRepo}
                onClose={() => setApptModalVisible(false)} onRefresh={loadData} onNavigateToSalon={() => handleNavigateToSalon()} onNavigateToProfessional={handleNavigateToProfessional}
            />

            {selectedSalonData && <SalonDetailModal visible={salonModalVisible} salon={selectedSalonData} repository={salonRepo} onClose={() => setSalonModalVisible(false)} />}
            <ProfessionalDetailModal visible={profModalVisible} professional={selectedProfData} onClose={() => setProfModalVisible(false)} onOpenSalon={(salon) => handleNavigateToSalon(salon.id)} />

            <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={selectedDate} onConfirm={(date) => { setSelectedDate(date); setDatePickerVisibility(false); }} onCancel={() => setDatePickerVisibility(false)} />
        </View>
    );
}