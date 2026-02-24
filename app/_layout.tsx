import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "@/app/Managers/AuthManager";
import { useEffect } from "react";
import {ActivityIndicator, View} from "react-native";

function RootLayoutNav() {
    const { isAuthenticated, loading, isGuest } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const routeSegments = segments as string[];
        const rootSegment = routeSegments[0];
        const inAuthGroup = rootSegment === 'Pages';

        // 1. Se o usuário NÃO está logado
        if (!isAuthenticated) {
            // Se ele for um convidado, não fazemos nada (deixamos ele navegar livremente)
            if (isGuest) return;

            // Se ele NÃO é convidado e NÃO está nas telas de login/welcome, 
            // aí sim mandamos para a Welcome
            if (!inAuthGroup) {
                router.replace('/Pages/Welcome/WelcomeScreen' as any);
            }
        }
        // 2. Se o usuário ESTÁ logado
        else {
            // Se ele tentar voltar para as telas de Login/Welcome, mandamos para as Tabs
            if (inAuthGroup) {
                router.replace('/(tabs)');
            }
        }
    }, [isAuthenticated, isGuest, loading, segments, navigationState?.key]);

    // EM VEZ DE RETURN NULL:
    // Se estiver carregando, mostre um fundo da cor do seu app
    if (loading || !navigationState?.key) {
        return (
            <View style={{ flex: 1, backgroundColor: '#FF4B91', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="Pages/Welcome/WelcomeScreen" />
            <Stack.Screen name="Pages/Login/LoginScreen" />
            <Stack.Screen name="Pages/Register/RegisterScreen" />
            {/* O "index" aqui pode estar causando conflito se o arquivo não existir fisicamente */}
            <Stack.Screen name="index" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}