import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Modular Styles and Theme
import { authStyles } from "@/app/Styles/authStyles";

// Logic & Models
import { useAuth } from '../../Managers/AuthManager';
import { UserProfile } from '../../Models/UserProfile';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Mock logic preserved
        const userMock = UserProfile.mock();
        userMock.email = email;
        await login(userMock);
    };

    return (
        <View style={authStyles.container}>
            <LinearGradient colors={['#FF4B91', '#FF76CE']} style={authStyles.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[
                        authStyles.content,
                        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={authStyles.textSection}>
                        <Text style={authStyles.title}>Bem-vinda de Volta</Text>
                        <Text style={authStyles.subtitle}>Sentimos sua falta!</Text>
                    </View>

                    {/* Form Section */}
                    <View style={[authStyles.buttonContainer, { marginTop: 40 }]}>
                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input} // Replaces localStyles.input
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input} // Replaces localStyles.input
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[authStyles.signUpBtn, { marginTop: 10 }]} // Using the primary button style
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.signUpText}>Entrar</Text>
                        </TouchableOpacity>

                        {/* Navigation Links */}
                        <TouchableOpacity
                            onPress={() => router.push('/Pages/Register/RegisterScreen' as any)}
                            style={authStyles.guestBtn}
                        >
                            <Text style={authStyles.guestText}>Não tem uma conta? Cadastre-se</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.guestBtn}
                            onPress={() => router.replace('/Pages/Welcome/WelcomeScreen' as any)}
                        >
                            <Text style={authStyles.guestText}>Ou volte para o início</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}