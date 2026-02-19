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
import { SearchResultSkeleton } from "@/app/Components/AnimatedSkeleton";

// Repositories & Models
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { INotificationRepository } from "@/app/Repository/Interfaces/INotificationRepository";
import { NotificationRepository } from "@/app/Repository/NotificationRepository";
import { Salon } from '@/app/Models/Salon';
import { Category } from "@/app/Models/Category";
import { Notification } from "@/app/Models/Notification";
import { Professional } from "@/app/Models/Professional";

import { useAuth } from '@/app/Managers/AuthManager';

// 1. Removido 'Todos' do Type
type SearchFilter = 'Salão' | 'Serviço' | 'Pessoas';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser } = useAuth();

    const salonRepository = useMemo<ISalonRepository>(() => new SalonRepository(), []);
    const notificationRepository = useMemo<INotificationRepository>(() => new NotificationRepository(), []);

    const [salons, setSalons] = useState<Salon[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifVisible, setNotifVisible] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // 2. Estado inicial alterado para 'Salão'
    const [activeFilter, setActiveFilter] = useState<SearchFilter>('Salão');

    const [searchResults, setSearchResults] = useState<(Salon | Professional)[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const displayName = currentUser?.name || "Convidado";
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        async function loadData() {
            try {
                const [salonsData, categoriesData, notificationsData, professionalsData] = await Promise.all([
                    salonRepository.getPopularSalons(),
                    salonRepository.getCategories(),
                    notificationRepository.getNotifications(),
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
        }
        loadData();
    }, [salonRepository, notificationRepository]);

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
        if (isSearching) {
            setPage(1);
            const delayDebounce = setTimeout(() => {
                performSearch(searchText, activeFilter, 1);
            }, 300);
            return () => clearTimeout(delayDebounce);
        }
    }, [searchText, activeFilter, isSearching, performSearch]);

    const handleLoadMore = () => {
        if (!isMoreLoading && hasMore && isSearching) {
            const nextPage = page + 1;
            setPage(nextPage);
            performSearch(searchText, activeFilter, nextPage);
        }
    };

    const handleViewAll = (filter: SearchFilter) => {
        setActiveFilter(filter);
        setIsSearching(true);
        setSearchText("");
    };

    const clearSearch = () => {
        setSearchText("");
        setIsSearching(false);
        setSearchResults([]);
        setActiveFilter('Salão'); // Reset para o primeiro filtro
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
                            {/* 3. Lista de filtros atualizada sem 'Todos' */}
                            {(['Salão', 'Serviço', 'Pessoas'] as SearchFilter[]).map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => setActiveFilter(f)}
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
                        <FlatList
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
                            onEndReachedThreshold={0.2}
                            ListFooterComponent={() => isMoreLoading ? (
                                <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
                            ) : null}
                            ListEmptyComponent={() => (
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ color: COLORS.muted }}>Nenhum resultado encontrado</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View style={homeStyles.sectionContainer}>
                        <Text style={homeStyles.sectionTitle}>Categorias</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.categoriesList}>
                            {categories.map((cat) => (
                                <CategoryCard
                                    key={cat.id}
                                    category={cat}
                                    onPress={() => {
                                        setSearchText(cat.name);
                                        setIsSearching(true);
                                        // Ao clicar em uma categoria, você pode decidir qual filtro ativar. 
                                        // Ex: 'Salão' por padrão ou tentar achar via lógica.
                                        setActiveFilter('Salão');
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    <View style={homeStyles.sectionContainer}>
                        <View style={homeStyles.sectionHeader}>
                            <Text style={homeStyles.sectionTitle}>Salões Populares</Text>
                            <TouchableOpacity onPress={() => handleViewAll('Salão')}>
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
                            <TouchableOpacity onPress={() => handleViewAll('Pessoas')}>
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
            )}
        </View>
    );
}