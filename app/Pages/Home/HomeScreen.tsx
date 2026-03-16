import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Styled Tokens & Styles
import { homeStyles } from "@/app/Styles/homeStyles";
import { COLORS } from "@/constants/theme";

// Components
import { CategoryCard } from "@/app/Components/CategoryCard";
import { SalonCard } from "@/app/Components/SalonCard";
import { ProfessionalCard } from "@/app/Components/ProfessionalCard";
import { SearchSalonCard } from "@/app/Components/SearchSalonCard";
import { SearchProfessionalCard } from "@/app/Components/SearchProfessionalCard";
import { NotificationPopup } from "@/app/Components/NotificationPopup";
import { SearchResultSkeleton, HomeSkeleton } from "@/app/Components/AnimatedSkeleton";

// Modais
import { SalonDetailModal } from "@/app/Components/SalonDetailModal";
import { ProfessionalDetailModal } from "@/app/Components/ProfessionalDetailModal"; // Importado

// Repositories & Models
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { INotificationRepository } from "@/app/Repository/Interfaces/INotificationRepository";
import { NotificationRepository } from "@/app/Repository/NotificationRepository";
import { Salon } from '@/app/Models/Salon';
import { Notification } from "@/app/Models/Notification";
import { Professional } from "@/app/Models/Professional";
import { Category } from "@/app/Models/Category";

import { useAuth } from '@/app/Managers/AuthManager';

type SearchFilter = 'Salão' | 'Serviço' | 'Pessoas';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser } = useAuth();

    // Instância estável do repositório
    const salonRepository = useMemo(() => new SalonRepository(), []);
    const notificationRepository = useMemo<INotificationRepository>(() => new NotificationRepository(), []);

    // Estados de Dados Iniciais
    const [salons, setSalons] = useState<Salon[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifVisible, setNotifVisible] = useState(false);

    // Estados de Localização
    
    
    const [userLocation, setUserLocation] = useState<{ city: string; state: string; latitude: number; longitude: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Estados de Busca e Paginação
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState<SearchFilter>('Salão');
    const [searchResults, setSearchResults] = useState<(Salon | Professional)[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // --- ESTADOS PARA OS MODAIS ---
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
    const [salonModalVisible, setSalonModalVisible] = useState(false);

    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [profModalVisible, setProfModalVisible] = useState(false);

    const displayName = currentUser?.name || "Convidado";
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // --- HANDLERS ---

    const handleOpenSalonDetails = (salon: Salon) => {
        setSelectedSalon(salon);
        setSalonModalVisible(true);
    };

    const handleOpenProfessionalDetails = (prof: Professional) => {
        setSelectedProfessional(prof);
        setProfModalVisible(true);
    };

    const requestLocationPermission = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Precisamos da sua localização para mostrar os melhores resultados próximos a você. Por favor, permita o acesso à localização nas configurações do app.');
                return false;
            }
            setLocationError(null);
            return true;
        } catch (error) {
            console.error('Erro ao solicitar permissão de localização:', error);
            setLocationError('Ocorreu um erro ao solicitar permissão de localização. Por favor, tente novamente.');
            return false;
        }
    }, []);

    const getCurrentLocation = useCallback(async () => {
        setLocationLoading(true);
        try {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });

            const { latitude, longitude } = location.coords;

            // Obtém o nome da cidade e estado usando reverse geocoding
            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            const city = reverseGeocode[0]?.city || reverseGeocode[0]?.region || ''; // Fallback
            const state = reverseGeocode[0]?.region || ''; // Estado

            setUserLocation({ city, state, latitude, longitude });
        } catch (error) {
            console.error('Erro ao obter localização:', error);
            setLocationError('Ocorreu um erro ao obter sua localização. Por favor, tente novamente.');
        } finally {
            setLocationLoading(false);
        }
    }, [requestLocationPermission]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Primeiro, obtenha a localização do usuário
            if (!userLocation) {
                await getCurrentLocation();
            }

            // Agora, carregue os dados usando a localização
            const [salonsData, categoriesData, notificationsData, professionalsData] = await Promise.all([
                userLocation ? 
                    salonRepository.getTopSalonsByLocation(userLocation.city, userLocation.state, userLocation.latitude, userLocation.longitude) :
                    salonRepository.getPopularSalons(),
                salonRepository.getCategories(),
                notificationRepository.getNotifications(),
                userLocation ? 
                    salonRepository.getTopProfessionalsByLocation(userLocation.city, userLocation.state, userLocation.latitude, userLocation.longitude) :
                    salonRepository.getTopProfessionals()
            ]);
            setSalons(salonsData);
            setCategories(categoriesData);
            setNotifications(notificationsData);
            setProfessionals(professionalsData);
        } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
        } finally {
            setLoading(false);
        }
    }, [salonRepository, notificationRepository, userLocation, getCurrentLocation]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const performSearch = useCallback(async (text: string, filter: SearchFilter, pageNum: number) => {
        if (pageNum === 1) setSearchLoading(true);
        else setIsMoreLoading(true);

        try {
            const results = await salonRepository.searchAll(text, filter, pageNum);

            if (pageNum === 1) {
                setSearchResults(results);
            } else {
                setSearchResults(prev => [...prev, ...results]);
            }
            setHasMore(results.length >= 5);
        } catch (error) {
            console.error("Erro na busca:", error);
        } finally {
            setSearchLoading(false);
            setIsMoreLoading(false);
        }
    }, [salonRepository]);

    useEffect(() => {
        if (isSearching && searchText.trim().length > 0) {
            setPage(1);
            const delayDebounce = setTimeout(() => {
                performSearch(searchText, activeFilter, 1);
            }, 350);
            return () => clearTimeout(delayDebounce);
        }
    }, [searchText, activeFilter, isSearching, performSearch]);

    const handleTriggerSearch = (filter: SearchFilter, text: string = "") => {
        setSearchResults([]);
        setSearchText(text);
        setActiveFilter(filter);
        setIsSearching(true);
        setPage(1);
        performSearch(text, filter, 1);
    };

    const handleLoadMore = () => {
        if (!isMoreLoading && hasMore && isSearching && !searchLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            performSearch(searchText, activeFilter, nextPage);
        }
    };

    const clearSearch = () => {
        setSearchText("");
        setIsSearching(false);
        setSearchResults([]);
        setPage(1);
        setActiveFilter('Salão');
    };

    return (
        <View style={[homeStyles.container, { paddingTop: insets.top }]}>
            <NotificationPopup
                visible={notifVisible}
                onClose={() => setNotifVisible(false)}
                notifications={notifications}
            />

            {/* MODAL DE SALÃO */}
            <SalonDetailModal
                visible={salonModalVisible}
                salon={selectedSalon}
                repository={salonRepository}
                onClose={() => setSalonModalVisible(false)}
            />

            {/* MODAL DE PROFISSIONAL */}
            <ProfessionalDetailModal
                visible={profModalVisible}
                professional={selectedProfessional}
                onOpenSalon={(salon) => handleOpenSalonDetails(salon)}
                onClose={() => setProfModalVisible(false)}
            />

            {!isSearching && (
                <View style={homeStyles.header}>
                    {/* Adicione flex: 1 aqui para o texto não invadir o espaço do sino */}
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text
                            style={homeStyles.welcomeText}
                            numberOfLines={2} // Limita a 2 linhas se for um nome bizarramente longo
                        >
                            Olá, {displayName}!
                        </Text>
                        <Text style={homeStyles.subTitle}>Encontre seu serviço de hoje</Text>
            {userLocation ? (
                <Text style={homeStyles.locationText}>
                    Localização: {userLocation.city}, {userLocation.state}
                </Text>
            ) : locationError ? (
                <Text style={[homeStyles.locationText, { color: '#D63484' }]}>
                    {locationError}
                </Text>
            ) : locationLoading ? (
                <Text style={homeStyles.locationText}>
                    Obtendo localização...
                </Text>
            ) : (
                <Text style={[homeStyles.locationText, { color: '#D63484' }]}>
                    Localização não disponível. Por favor, permita o acesso à localização nas configurações do app.
                </Text>
            )}
                    </View>

                    <TouchableOpacity style={homeStyles.profileBadge} onPress={() => setNotifVisible(true)}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.textMain} />
                        {unreadCount > 0 && (
                            <View style={homeStyles.badge}>
                                <Text style={homeStyles.badgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <View style={[homeStyles.searchSection, isSearching && { marginTop: 20 }]}>
                <Ionicons name="search-outline" size={20} color={COLORS.muted} style={homeStyles.searchIcon} />
                <TextInput
                    placeholder="Buscar salão, serviço ou pessoas..."
                    style={homeStyles.searchInput}
                    placeholderTextColor={COLORS.muted}
                    value={searchText}
                    onChangeText={(t) => {
                        setSearchText(t);
                        if (t.length > 0) setIsSearching(true);
                    }}
                />
                {isSearching && (
                    <TouchableOpacity onPress={clearSearch}>
                        <Ionicons name="close-circle" size={20} color={COLORS.muted} />
                    </TouchableOpacity>
                )}
            </View>

            {isSearching ? (
                <View style={{ flex: 1 }}>
                    <View style={{ marginVertical: 16 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                            {(['Salão', 'Serviço', 'Pessoas'] as SearchFilter[]).map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => handleTriggerSearch(f, searchText)}
                                    style={{
                                        paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
                                        backgroundColor: activeFilter === f ? COLORS.primary : '#F0F0F0',
                                        marginRight: 8, height: 38, justifyContent: 'center'
                                    }}>
                                    <Text style={{ color: activeFilter === f ? '#FFF' : COLORS.textMain, fontWeight: '600' }}>{f}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {searchLoading ? (
                        <SearchResultSkeleton />
                    ) : (
                        <FlatList<Salon | Professional>
                            data={searchResults}
                            keyExtractor={(item) => `${'specialty' in item ? 'p' : 's'}-${item.id}`}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <View style={{ marginBottom: 4 }}>
                                    {'specialty' in item ? (
                                        <SearchProfessionalCard
                                            professional={item as Professional}
                                            onPress={() => handleOpenProfessionalDetails(item as Professional)}
                                        />
                                    ) : (
                                        <SearchSalonCard
                                            salon={item as Salon}
                                            onPress={handleOpenSalonDetails}
                                        />
                                    )}
                                </View>
                            )}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={() => isMoreLoading ? (
                                <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
                            ) : <View style={{ height: 20 }} />}
                            ListEmptyComponent={() => (
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ color: COLORS.muted }}>Nenhum resultado encontrado</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            ) : (
                loading ? (
                    <HomeSkeleton />
                ) : (
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={{ paddingBottom: 30 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={loadData}
                                tintColor={COLORS.primary}
                                colors={[COLORS.primary]}
                            />
                        }
                    >
                        <View style={homeStyles.sectionContainer}>
                            <Text style={homeStyles.sectionTitle}>Serviços</Text>
                            {categories.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.categoriesList}>
                                    {categories.map((category) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            onPress={() => handleTriggerSearch('Serviço', category.name)}
                                        />
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={homeStyles.emptyStateContainer}>
                                    <Ionicons name="construct-outline" size={48} color={COLORS.muted} style={homeStyles.emptyStateIcon} />
                                    <Text style={homeStyles.emptyStateText}>Nenhum serviço encontrado no momento.</Text>
                                    <Text style={homeStyles.emptyStateSubtext}>Estamos trabalhando para trazer mais opções para você!</Text>
                                </View>
                            )}
                        </View>

                        <View style={homeStyles.sectionContainer}>
                            <View style={homeStyles.sectionHeader}>
                                <Text style={homeStyles.sectionTitle}>Salões Populares</Text>
                                <TouchableOpacity onPress={() => handleTriggerSearch('Salão')}>
                                    <Text style={homeStyles.seeAllText}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                            {salons.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.salonsScrollContainer} snapToInterval={266} decelerationRate="fast">
                                    {salons.map((salon) => (
                                        <SalonCard
                                            key={salon.id}
                                            salon={salon}
                                            onPress={handleOpenSalonDetails}
                                        />
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={homeStyles.emptyStateContainer}>
                                    <Ionicons name="business-outline" size={48} color={COLORS.muted} style={homeStyles.emptyStateIcon} />
                                    <Text style={homeStyles.emptyStateText}>Nenhum salão encontrado no momento.</Text>
                                    <Text style={homeStyles.emptyStateSubtext}>Estamos trabalhando para trazer mais opções para você!</Text>
                                </View>
                            )}
                        </View>

                        <View style={[homeStyles.sectionContainer, { marginTop: 20 }]}>
                            <View style={homeStyles.sectionHeader}>
                                <Text style={homeStyles.sectionTitle}>Melhores Profissionais</Text>
                                <TouchableOpacity onPress={() => handleTriggerSearch('Pessoas')}>
                                    <Text style={homeStyles.seeAllText}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                            {professionals.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingTop: 10 }}>
                                    {professionals.map((prof) => (
                                        <ProfessionalCard
                                            key={prof.id}
                                            professional={prof}
                                            onPress={() => handleOpenProfessionalDetails(prof)}
                                        />
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={homeStyles.emptyStateContainer}>
                                    <Ionicons name="people-outline" size={48} color={COLORS.muted} style={homeStyles.emptyStateIcon} />
                                    <Text style={homeStyles.emptyStateText}>Nenhum profissional encontrado no momento.</Text>
                                    <Text style={homeStyles.emptyStateSubtext}>Estamos trabalhando para trazer mais opções para você!</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                )
            )}
        </View>
    );
}