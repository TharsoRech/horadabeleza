import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "@/app/Managers/AuthManager";
import { useEffect } from "react";

function RootLayoutNav() {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        // Aguarda o carregamento do estado de autenticação e da navegação
        if (loading || !navigationState?.key) return;

        const routeSegments = segments as string[];
        const rootSegment = routeSegments[0];

        if (isAuthenticated) {
            // Se logado e estiver em telas de Welcome/Login, manda para as Tabs
            if (rootSegment === 'Pages') {
                router.replace('/(tabs)' as any);
            }
        } else {
            // Se NÃO logado e tentar acessar a raiz inicial (index), manda para Welcome
            // Permitimos o acesso ao '(tabs)' aqui para o fluxo de convidado
            const isAtRoot = !rootSegment || rootSegment === 'index';

            if (isAtRoot) {
                router.replace('/Pages/Welcome/WelcomeScreen' as any);
            }
        }
    }, [isAuthenticated, loading, segments, navigationState?.key]);

    if (loading || !navigationState?.key) return null;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="Pages/Welcome/WelcomeScreen" />
            <Stack.Screen name="Pages/Login/LoginScreen" />
            <Stack.Screen name="Pages/Register/RegisterScreen" />
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