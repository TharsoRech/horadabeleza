import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../Managers/AuthManager';
import {styles} from "@/app/Pages/styles";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout } = useAuth();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
            {/* Cabeçalho do Perfil */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={50} color="#FF4B91" />
                </View>
                <Text style={styles.userName}>{currentUser?.name || 'Usuário'}</Text>
                <Text style={{ color: '#666' }}>{currentUser?.email || 'email@exemplo.com'}</Text>
            </View>

            {/* Opções de Menu */}
            <View style={{ padding: 20 }}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Configurações</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF4B91" />
                    <Text style={[styles.menuText, { color: '#FF4B91' }]}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}