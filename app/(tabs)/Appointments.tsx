import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Modular Styles and Theme
import { appointmentStyles } from "@/app/Styles/appointmentStyles";
import {COLORS} from "@/constants/theme";

const APPOINTMENTS = [
    { id: '1', salon: 'Studio Glamour', service: 'Corte de Cabelo', date: '24 Out - 14:00', status: 'Confirmado' },
    { id: '2', salon: 'Unhas Design', service: 'Manicure', date: '26 Out - 10:30', status: 'Pendente' },
];

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[appointmentStyles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={appointmentStyles.header}>
                <Text style={appointmentStyles.title}>Meus Agendamentos</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={appointmentStyles.listContent}
            >
                {APPOINTMENTS.map((item) => (
                    <View key={item.id} style={appointmentStyles.appointmentCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={appointmentStyles.salonName}>{item.salon}</Text>
                            <Text style={appointmentStyles.serviceText}>{item.service}</Text>

                            <View style={appointmentStyles.timeRow}>
                                <Ionicons name="time-outline" size={16} color={COLORS.secondary} />
                                <Text style={appointmentStyles.timeText}>{item.date}</Text>
                            </View>
                        </View>

                        {/* Status Badge */}
                        <LinearGradient
                            colors={item.status === 'Confirmado' ? ['#4CAF50', '#81C784'] : ['#FFB300', '#FFD54F']}
                            style={appointmentStyles.statusBadge}
                        >
                            <Text style={appointmentStyles.statusText}>{item.status}</Text>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}