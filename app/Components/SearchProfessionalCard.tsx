import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import { Professional } from '../Models/Professional';
import {searchProfessionalCardStyles} from "@/app/Styles/searchProfessionalCardStyles";

export const SearchProfessionalCard = ({ professional, onPress }: { professional: Professional, onPress: () => void }) => (
    <TouchableOpacity style={searchProfessionalCardStyles.container} onPress={onPress}>
        <View style={searchProfessionalCardStyles.imageContainer}>
            {professional.image ? (
                <Image source={{ uri: professional.image }} style={searchProfessionalCardStyles.image} />
            ) : (
                <View style={searchProfessionalCardStyles.placeholder}><Ionicons name="person" size={24} color={COLORS.muted} /></View>
            )}
        </View>
        <View style={searchProfessionalCardStyles.info}>
            <Text style={searchProfessionalCardStyles.name}>{professional.name}</Text>
            <Text style={searchProfessionalCardStyles.specialty}>{professional.specialty}</Text>
            <View style={searchProfessionalCardStyles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={searchProfessionalCardStyles.ratingText}>{professional.rating} • {professional.reviews} avaliações</Text>
            </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
    </TouchableOpacity>
);