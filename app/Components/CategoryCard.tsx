import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Modular Style and Theme Imports
import { homeStyles } from "@/app/Styles/homeStyles";

// Models
import { Category } from "@/app/Models/Category";
import {COLORS} from "@/constants/theme";

interface CategoryProps {
    category: Category;
    onPress?: () => void;
}

export const CategoryCard = ({ category, onPress }: CategoryProps) => (
    <TouchableOpacity
        style={homeStyles.categoryCard}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={homeStyles.categoryIconCircle}>
            <Ionicons
                name={category.icon as any}
                size={24}
                color={COLORS.secondary} // Use central theme color
            />
        </View>
        <Text style={homeStyles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
);