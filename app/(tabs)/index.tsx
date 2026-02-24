import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/app/Managers/AuthManager';
import HomeScreen from "@/app/Pages/Home/HomeScreen";

export default function Index() {
    const { isAuthenticated, loading, isGuest } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF4B91' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    // Se estiver logado OU clicou em convidado, mostra a Home
    if (isAuthenticated || isGuest) {
        return <HomeScreen />;
    }

    // Se não, o RootLayout vai te mandar para a Welcome
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF4B91' }}>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}