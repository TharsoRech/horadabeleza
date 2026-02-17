import 'react-native-reanimated';
import {Stack} from "expo-router";
export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Home screen */}
            <Stack.Screen name="Pages/Welcome/WelcomeScreen" />
            {/* Map the names to the full folder paths */}
            <Stack.Screen name="Pages/Login/LoginScreen" />
            <Stack.Screen name="Pages/Register/RegisterScreen" />
        </Stack>
    );
}
