import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";
import {SalonManagerCardStyles as styles} from "@/app/Styles/SalonManagerCardStyles"; // Reutilizando a base de estilos


interface Props {
    salon: Salon;
    onPress: (salon: Salon) => void;
}

export const SalonManagerCard = ({ salon, onPress }: Props) => {
    // Verifica se a imagem é base64 (vinda do seu repo) ou um asset
    const imageSource = salon.image?.startsWith('data:image')
        ? { uri: salon.image }
        : typeof salon.image === 'string' ? { uri: salon.image } : salon.image;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(salon)}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                {imageSource ? (
                    <Image source={imageSource} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="business" size={30} color="#CCC" />
                    </View>
                )}
                {/* Badge de Status */}
                <View style={[styles.statusBadge, { backgroundColor: salon.userHasVisited ? '#4CAF50' : '#FF9800' }]}>
                    <Text style={styles.statusText}>
                        {salon.published ? 'Publicado' : 'Rascunho'}
                    </Text>
                </View>
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{salon.name}</Text>
                <Text style={styles.address} numberOfLines={1}>
                    <Ionicons name="location-outline" size={12} /> {salon.address}
                </Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="content-cut" size={14} color={COLORS.primary} />
                        <Text style={styles.statText}>{salon.serviceIds?.length || 0} Serviços</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="people-outline" size={14} color={COLORS.primary} />
                        <Text style={styles.statText}>{salon.professionalIds?.length || 0} Profissionais</Text>
                    </View>
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
        </TouchableOpacity>
    );
};

