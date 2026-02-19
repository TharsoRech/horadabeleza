import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// New Modular Style and Theme Imports
import { profileStyles } from "@/app/Styles/profileStyles";

// Managers
import { useAuth } from '../Managers/AuthManager';
import {COLORS} from "@/constants/theme";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout } = useAuth();

    return (
        <View style={[profileStyles.container, { paddingTop: insets.top }]}>

            {/* Profile Header */}
            <View style={profileStyles.profileHeader}>
                <View style={profileStyles.avatarCircle}>
                    <Ionicons name="person" size={50} color={COLORS.secondary} />
                </View>
                <Text style={profileStyles.userName}>
                    {currentUser?.name || 'Usuário'}
                </Text>
                <Text style={profileStyles.userEmail}>
                    {currentUser?.email || 'email@exemplo.com'}
                </Text>
            </View>

            {/* Menu Options */}
            <View style={profileStyles.menuContainer}>
                <TouchableOpacity style={profileStyles.menuItem} activeOpacity={0.6}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.textMain} />
                    <Text style={profileStyles.menuText}>Configurações</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={profileStyles.menuItem}
                    onPress={logout}
                    activeOpacity={0.6}
                >
                    <Ionicons name="log-out-outline" size={24} color={COLORS.secondary} />
                    <Text style={[profileStyles.menuText, profileStyles.logoutText]}>
                        Sair da Conta
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}