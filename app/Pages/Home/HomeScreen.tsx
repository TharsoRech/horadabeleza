import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "@/app/Pages/styles";

// Componentes
import { CategoryCard } from "@/app/Components/CategoryCard";
import { SalonCard } from "@/app/Components/SalonCard";
import { NotificationPopup } from "@/app/Components/NotificationPopup";

// Repositórios e Interfaces
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { SalonRepository } from '@/app/Repository/SalonRepository';
import { INotificationRepository } from "@/app/Repository/Interfaces/INotificationRepository";
import { NotificationRepository } from "@/app/Repository/NotificationRepository";

// Modelos
import { Salon } from '@/app/Models/Salon';
import { Category } from "@/app/Models/Category";
import { Notification } from "@/app/Models/Notification";

import { useAuth } from '@/app/Managers/AuthManager';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser } = useAuth();

    // Repositórios
    const salonRepository: ISalonRepository = new SalonRepository();
    const notificationRepository: INotificationRepository = new NotificationRepository();

    // Estados
    const [salons, setSalons] = useState<Salon[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifVisible, setNotifVisible] = useState(false);

    const displayName = currentUser?.name || "Convidado";

    // Contador de notificações não lidas
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        async function loadData() {
            try {
                // Carrega Salões, Categorias e Notificações em paralelo
                const [salonsData, categoriesData, notificationsData] = await Promise.all([
                    salonRepository.getPopularSalons(),
                    salonRepository.getCategories(),
                    notificationRepository.getNotifications()
                ]);

                setSalons(salonsData);
                setCategories(categoriesData);
                setNotifications(notificationsData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {/* Modal de Notificações */}
            <NotificationPopup
                visible={notifVisible}
                onClose={() => setNotifVisible(false)}
                notifications={notifications}
            />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Olá, {displayName}!</Text>
                    <Text style={styles.subTitle}>
                        {currentUser ? "Encontre seu serviço de hoje" : "Faça login para agendar serviços"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.profileBadge}
                    onPress={() => setNotifVisible(true)}
                >
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                {/* Barra de Busca Rápida */}
                <View style={styles.searchSection}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar salão ou serviço..."
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Seção de Categorias */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Categorias</Text>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FF4B91" />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                            {categories.map((cat) => (
                                <CategoryCard
                                    key={cat.id}
                                    category={cat}
                                    onPress={() => console.log(`Clicou em ${cat.name}`)}
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Seção de Salões Populares */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Salões Populares</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#FF4B91" size="large" style={{ marginTop: 20 }} />
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.salonsScrollContainer}
                        >
                            {salons.map((salon) => (
                                <SalonCard
                                    key={salon.id}
                                    salon={salon}
                                    onPress={() => console.log(`Clicou no ${salon.name}`)}
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}