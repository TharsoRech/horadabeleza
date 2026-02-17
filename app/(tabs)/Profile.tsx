import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../Managers/AuthManager';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout } = useAuth();

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
            {/* Cabeçalho do Perfil */}
            <View style={style.profileHeader}>
                <View style={style.avatarCircle}>
                    <Ionicons name="person" size={50} color="#FF4B91" />
                </View>
                <Text style={style.userName}>{currentUser?.name || 'Usuário'}</Text>
                <Text style={{ color: '#666' }}>{currentUser?.email || 'email@exemplo.com'}</Text>
            </View>

            {/* Opções de Menu */}
            <View style={{ padding: 20 }}>
                <TouchableOpacity style={style.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={style.menuText}>Configurações</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={style.menuItem} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF4B91" />
                    <Text style={[style.menuText, { color: '#FF4B91' }]}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    profileHeader: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' }
});