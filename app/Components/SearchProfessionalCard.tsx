import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Professional } from '../Models/Professional';
import { searchProfessionalCardStyles } from "@/app/Styles/searchProfessionalCardStyles";

export const SearchProfessionalCard = ({ professional, onPress }: { professional: Professional, onPress: () => void }) => (
    <TouchableOpacity style={searchProfessionalCardStyles.container} onPress={onPress}>
        <View style={searchProfessionalCardStyles.imageContainer}>
            {professional.image ? (
                <Image source={{ uri: professional.image }} style={searchProfessionalCardStyles.image} />
            ) : (
                <View style={searchProfessionalCardStyles.placeholder}>
                    <Ionicons name="person" size={24} color={COLORS.muted} />
                </View>
            )}
        </View>
        <View style={searchProfessionalCardStyles.info}>
            <Text style={searchProfessionalCardStyles.name}>{professional.name}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={searchProfessionalCardStyles.specialty}>{professional.specialty}</Text>
                {professional.salon && (
                    <>
                        <Text style={{ color: COLORS.muted, marginHorizontal: 4 }}>•</Text>
                        <Ionicons name="business" size={12} color={COLORS.primary} style={{ marginRight: 2 }} />
                        <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: '600' }}>
                            {professional.salon.name}
                        </Text>
                    </>
                )}
            </View>

            <View style={searchProfessionalCardStyles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={searchProfessionalCardStyles.ratingText}>
                    {professional.rating.toFixed(1)} • {professional.reviews} avaliações
                </Text>
            </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </TouchableOpacity>
);