import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Styles, Models
import { appointmentStyles as styles } from "@/app/Styles/appointmentStyles";
import { Appointment } from '@/app/Models/Appointment';
import { Salon } from '@/app/Models/Salon';
import { Professional } from '@/app/Models/Professional';

// Repositories e Interfaces
import { AppointmentRepository } from '@/app/Repository/AppointmentRepository';
import { SalonRepository } from "@/app/Repository/SalonRepository";
import { ProfessionalRepository } from "@/app/Repository/ProfessionalRepository"; // Adicionado

// Components
import { SearchResultSkeleton } from '@/app/Components/AnimatedSkeleton';
import { AppointmentCard } from '@/app/Components/AppointmentCard';
import { AppointmentDetailModal } from '@/app/Components/AppointmentDetailModal';
import { SalonDetailModal } from "@/app/Components/SalonDetailModal";
import { ProfessionalDetailModal } from "@/app/Components/ProfessionalDetailModal";

const STATUS_OPTIONS: Appointment['status'][] = ['Confirmado', 'Pendente', 'Concluído', 'Cancelado'];

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();

    // Instanciando os repositórios corretos
    const appointmentRepo = useMemo(() => new AppointmentRepository(), []);
    const salonRepo = useMemo(() => new SalonRepository(), []);
    const professionalRepo = useMemo(() => new ProfessionalRepository(), []);

    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<Appointment['status']>('Confirmado');

    const [apptModalVisible, setApptModalVisible] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    const [salonModalVisible, setSalonModalVisible] = useState(false);
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

    const [profModalVisible, setProfModalVisible] = useState(false);
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);

    const loadData = useCallback(async (status: Appointment['status']) => {
        setLoading(true);
        try {
            const data = await appointmentRepo.getAppointmentsByStatus(status);
            setAppointments(data);
        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    }, [appointmentRepo]);

    useEffect(() => {
        loadData(selectedStatus);
    }, [selectedStatus, loadData]);

    // --- HANDLERS DE TRANSIÇÃO ---

    const handleNavigateToSalon = async (salonId: string) => {
        setApptModalVisible(false);
        try {
            // USANDO SALON REPO PARA PEGAR IMAGEM CORRETAMENTE
            const data = await salonRepo.getSalonById(salonId);
            if (data) {
                setSelectedSalon(data);
                setTimeout(() => setSalonModalVisible(true), 500);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar o salão.");
        }
    };

    const handleNavigateToProfessional = async (profId: string) => {
        setApptModalVisible(false);
        try {
            // USANDO PROFESSIONAL REPO PARA PEGAR OBJETO COMPLETO
            const data = await professionalRepo.getProfessionalById(profId);
            if (data) {
                setSelectedProf(data);
                setTimeout(() => setProfModalVisible(true), 500);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar o profissional.");
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Agendamentos</Text>
            </View>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {STATUS_OPTIONS.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterChip, selectedStatus === status && styles.activeFilterChip]}
                            onPress={() => setSelectedStatus(status)}
                        >
                            <Text style={[styles.filterText, selectedStatus === status && styles.activeFilterText]}>
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? <SearchResultSkeleton /> : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AppointmentCard
                            item={item}
                            onPress={(it) => { setSelectedAppt(it); setApptModalVisible(true); }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <AppointmentDetailModal
                visible={apptModalVisible}
                appointment={selectedAppt}
                onClose={() => setApptModalVisible(false)}
                onRefresh={() => loadData(selectedStatus)}
                onNavigateToSalon={handleNavigateToSalon}
                onNavigateToProfessional={handleNavigateToProfessional}
            />

            <SalonDetailModal
                visible={salonModalVisible}
                salon={selectedSalon}
                onClose={() => setSalonModalVisible(false)}
                repository={salonRepo}
            />

            <ProfessionalDetailModal
                visible={profModalVisible}
                professional={selectedProf}
                onClose={() => setProfModalVisible(false)}
                onOpenSalon={(salon) => {
                    setProfModalVisible(false);
                    setSelectedSalon(salon);
                    setTimeout(() => setSalonModalVisible(true), 500);
                }}
            />
        </View>
    );
}