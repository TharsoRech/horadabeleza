import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from "@/app/Pages/styles";
import {Category} from "@/app/Models/Category";

interface CategoryProps {
    category: Category;
    onPress?: () => void;
}

export const CategoryCard = ({ category, onPress }: CategoryProps) => (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
        <View style={styles.categoryIconCircle}>
            <Ionicons name={category.icon as any} size={24} color="#FF4B91" />
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
);