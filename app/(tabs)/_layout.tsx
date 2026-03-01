import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {UserRole} from "@/app/Models/UserProfile";
import { useAuth } from '../Managers/AuthManager';

export default function TabLayout() {
    const { currentUser, isAuthenticated } = useAuth();
    
    const showProfessionalTabs = isAuthenticated && currentUser?.role === UserRole.PROFISSIONAL;
    
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF4B91', 
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 10,
                    marginTop:0,
                    padding:32,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="Appointments"
                options={{
                    title: 'Agendamentos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="MyServices"
                options={{
                    title: 'Minha Unidades',
                    tabBarIcon: ({ color }) => <Ionicons name="briefcase-outline" size={26} color={color} />,
                    // Se não for profissional, o href: null remove o botão da barra de navegação
                    href: showProfessionalTabs ? '/MyServices' : null,
                }}
            />
            
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}