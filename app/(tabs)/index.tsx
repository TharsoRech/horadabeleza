// app/index.tsx
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../Managers/AuthManager';
import HomeScreen from "@/app/Pages/Home/HomeScreen";

export default function Index() {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF4B91' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }
    if (isAuthenticated) {
        return <HomeScreen />;
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF4B91' }}>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}