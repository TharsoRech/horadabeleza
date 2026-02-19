import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

// Repositories & Models
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { INotificationRepository } from "@/app/Repository/Interfaces/INotificationRepository";
import { NotificationRepository } from "@/app/Repository/NotificationRepository";
import { Salon } from '@/app/Models/Salon';
import { Service } from "@/app/Models/Service";
import { Notification } from "@/app/Models/Notification";
import { Professional } from "@/app/Models/Professional";

import { useAuth } from '@/app/Managers/AuthManager';

type SearchFilter = 'Salão' | 'Serviço' | 'Pessoas';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser } = useAuth();

    const salonRepository = useMemo<ISalonRepository>(() => new SalonRepository(), []);
    const notificationRepository = useMemo<INotificationRepository>(() => new NotificationRepository(), []);

    // Estados de Dados Iniciais
    const [salons, setSalons] = useState<Salon[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifVisible, setNotifVisible] = useState(false);

    // Estados de Busca e Paginação
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState<SearchFilter>('Salão');
    const [searchResults, setSearchResults] = useState<(Salon | Professional)[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const displayName = currentUser?.name || "Convidado";
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Carga inicial dos dados da Home
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [salonsData, servicesData, notificationsData, professionalsData] = await Promise.all([
                    salonRepository.getPopularSalons(),
                    salonRepository.getServices(),
                    notificationRepository.getNotifications(),
                    salonRepository.getTopProfessionals()
                ]);
                setSalons(salonsData);
                setServices(servicesData);
                setNotifications(notificationsData);
                setProfessionals(professionalsData);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [salonRepository, notificationRepository]);

    // Função Principal de Busca e Paginação
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
            // Define se ainda há dados para carregar (baseado no limite de 5 do repo)
            setHasMore(results.length >= 5);
        } catch (error) {
            console.error("Erro na busca:", error);
        } finally {
            setSearchLoading(false);
            setIsMoreLoading(false);
        }
    }, [salonRepository]);

    // Debounce para busca via digitação
    useEffect(() => {
        if (isSearching && searchText.length > 0) {
            setPage(1);
            const delayDebounce = setTimeout(() => {
                performSearch(searchText, activeFilter, 1);
            }, 300);
            return () => clearTimeout(delayDebounce);
        }
    }, [searchText, activeFilter, isSearching, performSearch]);

    // Handler para o "Ver Todos" e cliques em categorias
    const handleTriggerSearch = (filter: SearchFilter, text: string = "") => {
        setSearchResults([]);
        setSearchText(text);
        setActiveFilter(filter);
        setIsSearching(true);
        setPage(1);
        performSearch(text, filter, 1); // Execução imediata sem esperar debounce
    };

    const handleLoadMore = () => {
        // Trava para evitar múltiplas chamadas simultâneas
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

            {!isSearching && (
                <View style={homeStyles.header}>
                    <View>
                        <Text style={homeStyles.welcomeText}>Olá, {displayName}!</Text>
                        <Text style={homeStyles.subTitle}>Encontre seu serviço de hoje</Text>
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
                            keyExtractor={(item, index) => `${'specialty' in item ? 'p' : 's'}-${item.id}-${index}`}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <View style={{ marginBottom: 4 }}>
                                    {'specialty' in item ? (
                                        <SearchProfessionalCard professional={item as Professional} onPress={() => {}} />
                                    ) : (
                                        <SearchSalonCard salon={item as Salon} onPress={() => {}} />
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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={homeStyles.sectionContainer}>
                            <Text style={homeStyles.sectionTitle}>Serviços</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.categoriesList}>
                                {services.map((ser) => (
                                    <CategoryCard
                                        key={ser.id}
                                        category={ser}
                                        onPress={() => handleTriggerSearch('Serviço', ser.name)}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={homeStyles.sectionContainer}>
                            <View style={homeStyles.sectionHeader}>
                                <Text style={homeStyles.sectionTitle}>Salões Populares</Text>
                                <TouchableOpacity onPress={() => handleTriggerSearch('Salão')}>
                                    <Text style={homeStyles.seeAllText}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.salonsScrollContainer} snapToInterval={266} decelerationRate="fast">
                                {salons.map((salon) => (
                                    <SalonCard key={salon.id} salon={salon} onPress={() => {}} />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={[homeStyles.sectionContainer, { marginTop: 20 }]}>
                            <View style={homeStyles.sectionHeader}>
                                <Text style={homeStyles.sectionTitle}>Melhores Profissionais</Text>
                                <TouchableOpacity onPress={() => handleTriggerSearch('Pessoas')}>
                                    <Text style={homeStyles.seeAllText}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingTop: 10 }}>
                                {professionals.map((prof) => (
                                    <ProfessionalCard key={prof.id} professional={prof} onPress={() => {}} />
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                )
            )}
        </View>
    );
}