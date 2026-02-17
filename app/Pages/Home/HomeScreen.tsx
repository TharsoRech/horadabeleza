import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {styles} from "@/app/Pages/styles";
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORIES = [
    { id: '1', name: 'Cabelo', icon: 'cut-outline' },
    { id: '2', name: 'Unhas', icon: 'brush-outline' },
    { id: '3', name: 'Maquiagem', icon: 'color-palette-outline' },
    { id: '4', name: 'Massagem', icon: 'leaf-outline' },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Olá, Maria!</Text>
                    <Text style={styles.subTitle}>Encontre seu serviço de hoje</Text>
                </View>
                <TouchableOpacity style={styles.profileBadge}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Barra de Busca */}
                <View style={styles.searchSection}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar salão ou serviço..."
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Banner de Promoção */}
                <View style={styles.promoBanner}>
                    <LinearGradient
                        colors={['#FF4B91', '#FF76CE']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.promoGradient}
                    >
                        <View>
                            <Text style={styles.promoTitle}>30% OFF</Text>
                            <Text style={styles.promoSub}>No primeiro corte de cabelo</Text>
                            <TouchableOpacity style={styles.promoBtn}>
                                <Text style={styles.promoBtnText}>Aproveitar</Text>
                            </TouchableOpacity>
                        </View>
                        <Ionicons name="sparkles" size={60} color="rgba(255,255,255,0.3)" />
                    </LinearGradient>
                </View>

                {/* Categorias */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Categorias</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                                <View style={styles.categoryIconCircle}>
                                    <Ionicons name={cat.icon as any} size={24} color="#FF4B91" />
                                </View>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Destaques (Salões Populares) */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Salões Populares</Text>
                    <View style={styles.salonCard}>
                        <View style={styles.salonImagePlaceholder} />
                        <View style={styles.salonInfo}>
                            <Text style={styles.salonName}>Studio Glamour</Text>
                            <Text style={styles.salonAddress}>Av. Paulista, 1000 - SP</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>4.9 (120 avaliações)</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
