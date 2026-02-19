import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Professional } from '../Models/Professional';
import { professionalCardStyles } from "@/app/Styles/professionalCardStyles";

interface ProfessionalCardProps {
    professional: Professional;
    onPress: () => void;
}

export const ProfessionalCard = ({ professional, onPress }: ProfessionalCardProps) => {
    return (
        <TouchableOpacity
            style={professionalCardStyles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={professionalCardStyles.imageContainer}>
                {professional.image ? (
                    <Image source={{ uri: professional.image }} style={professionalCardStyles.image} />
                ) : (
                    <View style={[professionalCardStyles.image, professionalCardStyles.placeholder]}>
                        <Ionicons name="person" size={30} color={COLORS.muted} />
                    </View>
                )}
                <View style={professionalCardStyles.ratingBadge}>
                    <Ionicons name="star" size={10} color="#FFD700" />
                    <Text style={professionalCardStyles.ratingText}>{professional.rating.toFixed(1)}</Text>
                </View>
            </View>

            <Text numberOfLines={1} style={professionalCardStyles.name}>{professional.name}</Text>
            <Text numberOfLines={1} style={professionalCardStyles.specialty}>{professional.specialty}</Text>

            {professional.salon && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4,marginLeft: 24 }}>
                    <Ionicons name="business-outline" size={10} color={COLORS.muted} />
                    <Text numberOfLines={1} style={{ fontSize: 10, color: COLORS.muted, marginLeft: 4, flex: 1 }}>
                        {professional.salon.name}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};