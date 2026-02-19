import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from '../Models/Salon';
import { COLORS } from "@/constants/theme";
import { searchSalonCardStyles as styles } from "../Styles/searchSalonCardStyles";

export const SearchSalonCard = ({ salon, onPress }: { salon: Salon; onPress: () => void }) => {
    const imageSource = typeof salon.image === 'string' ? { uri: salon.image } : salon.image;

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {imageSource ? (
                <Image source={imageSource} style={styles.image} />
) : (
        <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={24} color={COLORS.muted} />
    </View>
)}

    <View style={styles.info}>
    <Text style={styles.name} numberOfLines={1}>{salon.name}</Text>
        <Text style={styles.address} numberOfLines={2}>{salon.address}</Text>

        <View style={styles.ratingRow}>
    <Ionicons name="star" size={14} color="#FFD700" />
    <Text style={styles.ratingText}>
        {salon.rating} ({salon.reviews} avaliações)
    </Text>
    </View>
    </View>

    <View style={{ justifyContent: 'center', paddingRight: 10 }}>
    <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </View>
    </TouchableOpacity>
);
};