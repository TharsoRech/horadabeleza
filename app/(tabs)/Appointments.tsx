import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../Pages/styles'; // Reaproveitando seus estilos
import { LinearGradient } from 'expo-linear-gradient';

const APPOINTMENTS = [
    { id: '1', salon: 'Studio Glamour', service: 'Corte de Cabelo', date: '24 Out - 14:00', status: 'Confirmado' },
    { id: '2', salon: 'Unhas Design', service: 'Manicure', date: '26 Out - 10:30', status: 'Pendente' },
];

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Meus Agendamentos</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {APPOINTMENTS.map((item) => (
                    <View key={item.id} style={[styles.salonCard, { marginBottom: 15, padding: 15 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={styles.salonName}>{item.salon}</Text>
                                <Text style={styles.subTitle}>{item.service}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Ionicons name="time-outline" size={16} color="#FF4B91" />
                                    <Text style={{ marginLeft: 5, color: '#666' }}>{item.date}</Text>
                                </View>
                            </View>
                            <LinearGradient
                                colors={item.status === 'Confirmado' ? ['#4CAF50', '#81C784'] : ['#FFB300', '#FFD54F']}
                                style={{ padding: 5, borderRadius: 8 }}
                            >
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{item.status}</Text>
                            </LinearGradient>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}