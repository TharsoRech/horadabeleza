import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Importe Image
import { Ionicons } from '@expo/vector-icons';
import { styles } from "@/app/Pages/styles";
import {Salon} from "@/app/Models/Salon";

interface SalonProps {
    salon: Salon;
    onPress?: () => void;
}

export const SalonCard = ({ salon, onPress }: SalonProps) => {
    // Determina o source da imagem de forma inteligente
    const getImageSource = () => {
        if (!salon.image) return null;

        // Se for uma string que já começa com "data:" ou "http", usamos como URI
        if (typeof salon.image === 'string') {
            return { uri: salon.image };
        }

        // Se for um require(path), o React Native trata como número/objeto
        return salon.image;
    };

    const imageSource = getImageSource();

    return (
        <TouchableOpacity style={styles.salonCard} onPress={onPress}>
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={styles.salonImagePlaceholder}
                    resizeMode="cover" // Garante que a imagem preencha o espaço
                />
            ) : (
                <View style={styles.salonImagePlaceholder}>
                    <Ionicons name="image-outline" size={30} color="#ccc" />
                </View>
            )}

            <View style={styles.salonInfo}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonAddress}>{salon.address}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{salon.rating} ({salon.reviews} avaliações)</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};