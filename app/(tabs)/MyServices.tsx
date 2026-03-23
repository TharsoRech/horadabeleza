import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Logic & Models
import { Salon } from "@/app/Models/Salon";
import { SalonRepository } from "@/app/Repository/SalonRepository";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/app/Managers/AuthManager";

// Styles & Components
import { myServicesStyles as styles } from "../Styles/myServicesStyles";
import { AnimatedSkeleton } from "@/app/Components/AnimatedSkeleton";
import { SalonManagerCard } from "@/app/Components/SalonManagerCard";
import { ServiceOptionsModal } from "@/app/Components/ServiceOptionsModal";
import { SalonEditModal } from "@/app/Components/SalonEditModal";
import { SalonDetailModal } from "@/app/Components/SalonDetailModal"; // Importado o modal de cliente
import { AuthGuardPlaceholder } from "@/app/Components/AuthGuardPlaceholder";

export default function MyServices() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();

    // --- ESTADOS ---
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

    // Controle de Visibilidade dos Modais
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false); // Modal de Cliente

    const salonRepo = useMemo(() => new SalonRepository(), []);

    // 1. Guard de Autenticação
    if (!isAuthenticated) {
        return (
            <AuthGuardPlaceholder
                title="Minhas Unidades"
                description="Você precisa estar logado para gerenciar ou visualizar suas unidades."
                icon="business-outline"
            />
        );
    }

    // 2. Carga de Dados
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await salonRepo.getMyUnits();
            setSalons(data as Salon[]);
        } catch (error) {
            console.error("Erro ao carregar salões:", error);
            Alert.alert("Erro", "Não foi possível carregar suas unidades.");
        } finally {
            setLoading(false);
        }
    }, [salonRepo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // --- LOGICA DE DECISÃO (ADMIN vs CLIENTE) ---
    const handleCardPress = (salon: Salon) => {
        setSelectedSalon(salon);

        // Verifica a flag interna do objeto Salon
        if (salon.isAdmin) {
            // Se for admin, abre o menu de gestão (Editar/Excluir)
            setOptionsVisible(true);
        } else {
            // Se não for admin, abre a tela de agendamento (Visão Cliente)
            setDetailModalVisible(true);
        }
    };

    // --- HANDLERS ---

    const handleOpenEdit = (salon: Salon) => {
        setSelectedSalon(salon);
        setOptionsVisible(false);
        setTimeout(() => setEditModalVisible(true), 300);
    };

    const handleSaveSalon = async (updatedSalon: Salon) => {
        setSalons(prev => {
            const index = prev.findIndex(s => s.id === updatedSalon.id);
            if (index !== -1) {
                const newSalons = [...prev];
                newSalons[index] = updatedSalon;
                return newSalons;
            }
            return [updatedSalon, ...prev];
        });

        await loadData();
    };

    const handleDelete = (salon: Salon) => {
        Alert.alert(
            "Excluir Unidade",
            `Deseja remover o "${salon.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await salonRepo.deleteUnit(salon.id);
                            setSalons(prev => prev.filter(s => s.id !== salon.id));
                        } catch (error) {
                            console.error('Erro ao remover unidade:', error);
                            Alert.alert('Erro', 'Não foi possível remover a unidade.');
                        } finally {
                            setOptionsVisible(false);
                        }
                    }
                }
            ]
        );
    };

    const renderSkeletons = () => (
        <View style={{ padding: 20 }}>
            {[1, 2, 3].map(i => (
                <AnimatedSkeleton key={i} height={110} width="100%" borderRadius={16} style={{ marginBottom: 16 }} />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Minhas Unidades</Text>
                    {!loading && (
                        <Text style={{ color: COLORS.textSub, fontSize: 14 }}>
                            {salons.length} unidades encontradas
                        </Text>
                    )}
                </View>
                {/* Botão de adicionar geralmente é para criar novas unidades (Admin) */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => { setSelectedSalon(null); setEditModalVisible(true); }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {/* Listagem */}
            {loading ? renderSkeletons() : (
                <FlatList
                    data={salons}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20 }}>
                            <SalonManagerCard
                                salon={item}
                                onPress={() => handleCardPress(item)} // Lógica baseada no isAdmin
                            />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} colors={[COLORS.primary]} />}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 100 }}>
                            <Ionicons name="business-outline" size={80} color="#EEE" />
                            <Text style={{ color: '#AAA', fontSize: 16, marginTop: 10 }}>Nenhuma unidade vinculada.</Text>
                        </View>
                    }
                />
            )}

            {/* Modais de ADMIN */}
            <ServiceOptionsModal
                visible={optionsVisible}
                salon={selectedSalon}
                onClose={() => setOptionsVisible(false)}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            <SalonEditModal
                visible={editModalVisible}
                salon={selectedSalon}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveSalon}
            />

            {/* Modal de CLIENTE (Agendamento) */}
            <SalonDetailModal
                visible={detailModalVisible}
                salon={selectedSalon}
                repository={salonRepo}
                onClose={() => setDetailModalVisible(false)}
            />

        </View>
    );
}