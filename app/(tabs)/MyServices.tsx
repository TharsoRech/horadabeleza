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

// Styles & Components
import { myServicesStyles as styles } from "../Styles/myServicesStyles";
import { AnimatedSkeleton } from "@/app/Components/AnimatedSkeleton";
import { SalonManagerCard } from "@/app/Components/SalonManagerCard";
import { ServiceOptionsModal } from "@/app/Components/ServiceOptionsModal";
import { SalonEditModal } from "@/app/Components/SalonEditModal";

export default function MyServices() {
    const insets = useSafeAreaInsets();

    // --- ESTADOS ---
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

    // Controle de Visibilidade dos Modais
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Repositório
    const salonRepo = useMemo(() => new SalonRepository(), []);

    // --- CARGA DE DADOS ---
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            // Utiliza o seu método searchAll filtrando por 'Salão'
            const data = await salonRepo.searchAll("", "Salão", 1);
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

    // --- HANDLERS DE AÇÃO ---

    // 1. Abre o menu rápido de opções ao clicar no Card
    const handleOpenOptions = (salon: Salon) => {
        setSelectedSalon(salon);
        setOptionsVisible(true);
    };

    // 2. Abre o Modal Principal de Edição (Hub) vindo do menu de opções
    const handleOpenEdit = (salon: Salon) => {
        setSelectedSalon(salon);
        setOptionsVisible(false);
        // Delay para evitar conflito de animação entre modais
        setTimeout(() => setEditModalVisible(true), 300);
    };

    // 3. Abre o Modal para criar um novo salão (campos vazios)
    const handleAddNew = () => {
        setSelectedSalon(null);
        setEditModalVisible(true);
    };

    // 4. Salva as alterações (Atualização local no estado)
    const handleSaveSalon = (updatedSalon: Salon) => {
        setSalons(prev => {
            const index = prev.findIndex(s => s.id === updatedSalon.id);
            if (index !== -1) {
                // Atualiza salão existente
                const newSalons = [...prev];
                newSalons[index] = updatedSalon;
                return newSalons;
            }
            // Adiciona novo salão no topo da lista
            return [updatedSalon, ...prev];
        });
    };

    // 5. Deleta um salão
    const handleDelete = (salon: Salon) => {
        Alert.alert(
            "Excluir Unidade",
            `Tem certeza que deseja remover o "${salon.name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => {
                        setSalons(prev => prev.filter(s => s.id !== salon.id));
                        setOptionsVisible(false);
                    }
                }
            ]
        );
    };

    // --- RENDERS ---

    const renderSkeletons = () => (
        <View style={{ padding: 20 }}>
            {[1, 2, 3].map(i => (
                <AnimatedSkeleton
                    key={i}
                    height={110}
                    width="100%"
                    borderRadius={16}
                    style={{ marginBottom: 16 }}
                />
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* Header com Título e Botão de Adicionar */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Minhas Unidades</Text>
                    {!loading && (
                        <Text style={{ color: COLORS.textSub, fontSize: 14 }}>
                            {salons.length} estabelecimentos ativos
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddNew}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {/* Listagem Principal */}
            {loading ? (
                renderSkeletons()
            ) : (
                <FlatList
                    data={salons}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20 }}>
                            <SalonManagerCard
                                salon={item}
                                onPress={handleOpenOptions}
                            />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={loadData}
                            colors={[COLORS.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 100 }}>
                            <Ionicons name="business-outline" size={80} color="#EEE" />
                            <Text style={{ color: '#AAA', fontSize: 16, marginTop: 10 }}>
                                Nenhuma unidade cadastrada.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Modal de Opções Rápidas (Editar/Excluir/Ver) */}
            <ServiceOptionsModal
                visible={optionsVisible}
                salon={selectedSalon}
                onClose={() => setOptionsVisible(false)}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            {/* Modal de Edição Completa (O Hub de informações) */}
            <SalonEditModal
                visible={editModalVisible}
                salon={selectedSalon}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveSalon}
                // Placeholders para os próximos modais que você criar
                onManageServices={(s) => Alert.alert("Serviços", `Gerenciar catálogo de ${s.name}`)}
                onManageProfessionals={(s) => Alert.alert("Equipe", `Gerenciar profissionais de ${s.name}`)}
            />

        </View>
    );
}