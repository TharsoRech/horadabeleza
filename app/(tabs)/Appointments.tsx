import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { appointmentStyles as styles } from "@/app/Styles/appointmentStyles";
import { Appointment } from '@/app/Models/Appointment';
import { Salon } from '@/app/Models/Salon';
import { COLORS } from '@/constants/theme';

import { AppointmentRepository } from '@/app/Repository/AppointmentRepository';
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { useAuth } from "@/app/Managers/AuthManager";

import { SearchResultSkeleton } from '@/app/Components/AnimatedSkeleton';
import { AppointmentCard } from '@/app/Components/AppointmentCard';
import { AppointmentDetailModal } from '@/app/Components/AppointmentDetailModal';
import { AuthGuardPlaceholder } from '@/app/Components/AuthGuardPlaceholder';

type SubTab = 'unidade' | 'meus_horarios';

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated, currentUser } = useAuth();

    // Idealmente, esses seriam injetados via Context ou Props se usássemos Clean Architecture pura
    const appointmentRepo = useMemo(() => new AppointmentRepository(), []);
    const salonRepo = useMemo(() => new SalonRepository(), []);

    const [activeTab, setActiveTab] = useState<SubTab>('unidade');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState<Appointment['status']>('Confirmado');
    const [showCancelled, setShowCancelled] = useState(false);

    const [units, setUnits] = useState<Salon[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [apptModalVisible, setApptModalVisible] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    // 1. Guard de Autenticação
    if (!isAuthenticated) {
        return (
            <AuthGuardPlaceholder
                title="Sua Agenda"
                description="Faça login para gerenciar seus agendamentos."
                icon="calendar-outline"
            />
        );
    }

    // 2. Carrega as Unidades - CORRIGIDO
    useEffect(() => {
        let isMounted = true;
        const fetchUnits = async () => {
            if (!currentUser?.id) return;

            setLoading(true);
            try {
                const mySalons = await salonRepo.getSalonsByProfessional(currentUser.id);
                if (isMounted) {
                    setUnits(mySalons);
                    if (mySalons.length > 0) {
                        setSelectedUnit(mySalons[0]);
                    } else {
                        // Se não tem unidades, para o loading aqui pois loadData não será útil
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar unidades:", error);
                if (isMounted) setLoading(false);
            }
        };

        fetchUnits();
        return () => { isMounted = false; };
    }, [currentUser?.id, salonRepo]);

    // 3. Gerador de Calendário
    const daysHeader = useMemo(() => {
        const days = [];
        const baseDate = new Date(selectedDate);
        for (let i = 0; i < 12; i++) {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + i);
            days.push(date);
        }
        return days;
    }, [selectedDate]);

    // 4. Carga de Agendamentos
    const loadData = useCallback(async () => {
        if (!currentUser) return;

        // Se estiver na aba unidade e não houver unidades, limpamos e saímos
        if (activeTab === 'unidade' && units.length === 0) {
            setAppointments([]);
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
                if (!showCancelled) {
                    data = data.filter(app => app.status !== 'Cancelado');
                }
            } else if (activeTab === 'meus_horarios') {
                data = await appointmentRepo.getAppointmentsByStatus(selectedStatus);
            }
            setAppointments(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [currentUser, activeTab, selectedDate, selectedStatus, selectedUnit, units.length, showCancelled, appointmentRepo]);

    // Dispara loadData sempre que mudar tab, data, status ou a unidade selecionada
    useEffect(() => {
        loadData();
    }, [loadData]);

    // --- RENDERS ---

    const renderCalendarHeader = () => (
        <View style={styles.calendarContainer}>
            <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                </Text>
                {selectedUnit?.isAdmin && (
                    <View style={styles.adminToggleRow}>
                        <Text style={styles.toggleLabel}>Ver Cancelados</Text>
                        <Switch
                            value={showCancelled}
                            onValueChange={setShowCancelled}
                            trackColor={{ false: "#DDD", true: COLORS.primary }}
                            style={{ transform: [{ scale: 0.7 }] }}
                        />
                    </View>
                )}
            </View>

            <View style={styles.calendarHeaderContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateBar}>
                    {daysHeader.map((date, idx) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' })
                            .replace('.', '').substring(0, 3).toUpperCase();

                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.dateChip, isSelected && styles.activeDateChip]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text style={[styles.dateDayName, isSelected && styles.activeDateText]}>{dayName}</Text>
                                <Text style={[styles.dateDayNumber, isSelected && styles.activeDateText]}>{date.getDate()}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity style={styles.miniCalendarBtn} onPress={() => setDatePickerVisibility(true)}>
                    <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Agendamentos</Text>
                <View style={styles.subTabRow}>
                    <TouchableOpacity onPress={() => setActiveTab('unidade')} style={[styles.subTabBtn, activeTab === 'unidade' && styles.subTabBtnActive]}>
                        <Text style={[styles.subTabText, activeTab === 'unidade' && styles.subTabTextActive]}>Unidade</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('meus_horarios')} style={[styles.subTabBtn, activeTab === 'meus_horarios' && styles.subTabBtnActive]}>
                        <Text style={[styles.subTabText, activeTab === 'meus_horarios' && styles.subTabTextActive]}>Pessoal</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Ionicons name={activeTab === 'unidade' ? (selectedUnit?.isAdmin ? "shield-checkmark" : "business") : "person-circle"} size={22} color={COLORS.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoTitle}>
                        {activeTab === 'unidade' ? (selectedUnit?.isAdmin ? "Gestão Administrativa" : "Agenda da Unidade") : "Minha Agenda Pessoal"}
                    </Text>
                    <Text style={styles.infoText}>
                        {activeTab === 'unidade'
                            ? (selectedUnit ? `Atuando em ${selectedUnit.name}` : (loading ? "Buscando unidades..." : "Nenhuma unidade vinculada"))
                            : "Filtre seus atendimentos por status."}
                    </Text>
                </View>
            </View>

            {activeTab === 'unidade' ? (
                units.length > 0 ? (
                    <>
                        <Text style={styles.sectionLabel}>Minhas Unidades</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelectorBar} contentContainerStyle={{ paddingHorizontal: 20 }}>
                            {units.map((unit) => (
                                <TouchableOpacity
                                    key={unit.id}
                                    style={[styles.unitChip, selectedUnit?.id === unit.id && styles.activeUnitChip]}
                                    onPress={() => setSelectedUnit(unit)}
                                >
                                    {unit.isAdmin && <Ionicons name="shield-checkmark" size={12} color={selectedUnit?.id === unit.id ? "#FFF" : COLORS.primary} style={{marginRight: 4}} />}
                                    <Text style={[styles.unitText, selectedUnit?.id === unit.id && styles.activeUnitText]}>{unit.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {renderCalendarHeader()}
                    </>
                ) : (
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="business-outline" size={50} color="#DDD" />
                            <Text style={styles.emptyText}>Você não possui unidades vinculadas.</Text>
                        </View>
                    )
                )
            ) : (
                <View style={{ marginTop: 5 }}>
                    <Text style={styles.sectionLabel}>Filtrar por Status</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                        {['Confirmado', 'Pendente', 'Concluído', 'Cancelado'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[styles.filterChip, selectedStatus === status && styles.activeFilterChip]}
                                onPress={() => setSelectedStatus(status as any)}
                            >
                                <Text style={[status === selectedStatus ? styles.activeFilterText : styles.filterText]}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {loading ? (
                <SearchResultSkeleton />
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AppointmentCard
                            item={item}
                            isProfessionalView={true}
                            canEdit={selectedUnit?.isAdmin || item.professionalId === currentUser?.id}
                            onPress={(it) => { setSelectedAppt(it); setApptModalVisible(true); }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={40} color="#DDD" />
                            <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
                        </View>
                    }
                />
            )}

            <AppointmentDetailModal
                visible={apptModalVisible}
                appointment={selectedAppt}
                userRole={currentUser?.role}
                onClose={() => setApptModalVisible(false)}
                onRefresh={loadData}
                onNavigateToSalon={(id) => console.log(id)}
                onNavigateToProfessional={(id) => console.log(id)}
            />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={selectedDate}
                onConfirm={(date) => { setSelectedDate(date); setDatePickerVisibility(false); }}
                onCancel={() => setDatePickerVisibility(false)}
            />
        </View>
    );
}