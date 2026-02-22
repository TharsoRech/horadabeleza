import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { salonCardStyles as styles } from "@/app/Styles/salonCardStyles";
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";

interface SalonProps {
    salon: Salon;
    onPress: (salon: Salon) => void; // Tipagem ajustada
}

export const SalonCard = ({ salon, onPress }: SalonProps) => {
    const imageSource = typeof salon.image === 'string' ? { uri: salon.image } : salon.image;

    return (
        <TouchableOpacity
            style={styles.salonCard}
            onPress={() => onPress(salon)} // Passa o salão no clique
            activeOpacity={0.8}
        >
            {imageSource ? (
                <Image source={imageSource} style={styles.salonImagePlaceholder} resizeMode="cover" />
            ) : (
                <View style={styles.salonImagePlaceholder}>
                    <Ionicons name="image-outline" size={30} color={COLORS.muted} />
                </View>
            )}

            <View style={styles.salonInfo}>
                <Text style={styles.salonName} numberOfLines={1}>{salon.name}</Text>
                <Text style={styles.salonAddress} numberOfLines={1}>{salon.address}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{salon.rating} ({salon.reviews})</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};