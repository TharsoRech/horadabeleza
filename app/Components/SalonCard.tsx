import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Estilos específicos do Card
import { salonCardStyles as styles } from "@/app/Styles/salonCardStyles";

// Models & Theme
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";

interface SalonProps {
    salon: Salon;
    onPress?: () => void;
}

export const SalonCard = ({ salon, onPress }: SalonProps) => {

    const getImageSource = () => {
        if (!salon.image) return null;
        // Se for string (Base64 ou URL), usa uri. Se for require, usa direto.
        return typeof salon.image === 'string' ? { uri: salon.image } : salon.image;
    };

    const imageSource = getImageSource();

    return (
        <TouchableOpacity
            style={styles.salonCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={styles.salonImagePlaceholder}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.salonImagePlaceholder}>
                    <Ionicons name="image-outline" size={30} color={COLORS.muted} />
                </View>
            )}

            <View style={styles.salonInfo}>
                <Text style={styles.salonName} numberOfLines={1}>
                    {salon.name}
                </Text>
                <Text style={styles.salonAddress} numberOfLines={1}>
                    {salon.address}
                </Text>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {salon.rating} ({salon.reviews} avaliações)
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};