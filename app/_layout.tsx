import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "@/app/Managers/AuthManager"; // Garanta que o useAuth venha daqui
import { useEffect } from "react";

function RootLayoutNav() {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (loading || !navigationState?.key) return;

        const routeSegments = segments as string[];
        const rootSegment = routeSegments[0];

        if (isAuthenticated) {
            if (rootSegment !== '(tabs)') {
                router.replace('/(tabs)');
            }
        }
        else {
            const isAtProtectedArea = !rootSegment || rootSegment === 'index' || rootSegment === '(tabs)';
            if (isAtProtectedArea) {
                router.replace('/Pages/Welcome/WelcomeScreen');
            }
        }
    }, [isAuthenticated, loading, segments, navigationState?.key]);

    if (loading || !navigationState?.key) return null;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="Pages/Welcome/WelcomeScreen" />
            <Stack.Screen name="Pages/Login/LoginScreen" />
            <Stack.Screen name="Pages/Register/RegisterScreen" />
            <Stack.Screen name="(tabs)" />
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