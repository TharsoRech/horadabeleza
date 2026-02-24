// app/Components/AuthGuardPlaceholder.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import {AuthGuardPlaceholderStyles as styles} from "../Styles/AuthGuardPlaceholderStyles";
import {useAuth} from "@/app/Managers/AuthManager";

interface Props {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export function AuthGuardPlaceholder({ title, description, icon }: Props) {
    const router = useRouter();
    const { setIsGuest } = useAuth(); 

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name={icon} size={64} color={COLORS.secondary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                    setIsGuest(false); 
                    router.replace('/Pages/Login/LoginScreen' as any);
                }}
            >
                <Text style={styles.loginText}>Entrar na minha conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => {
                    setIsGuest(false);
                    router.replace('/Pages/Login/RegisterScreen' as any);
                }}
            >
                <Text style={styles.registerText}>Criar nova conta</Text>
            </TouchableOpacity>
        </View>
    );
}