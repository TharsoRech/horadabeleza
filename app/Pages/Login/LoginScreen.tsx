import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Modular Styles and Theme
import { authStyles } from "@/app/Styles/authStyles";

// Logic & Models
import { useAuth } from '../../Managers/AuthManager';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    // Agora pegamos as funções reais do Manager
    const { login, requestPasswordReset } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função de Login conectada ao Repository via Manager
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setIsLoading(true);
        try {
            // Chamada ao Manager (que chama o Repository)
            await login(email, password);
            // O redirecionamento acontece automaticamente pelo estado global de Auth
        } catch (error: any) {
            Alert.alert("Falha no Login", error.message || "E-mail ou senha incorretos.");
        } finally {
            setIsLoading(false);
        }
    };

    // Função para Recuperação de Senha
    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert("Atenção", "Digite seu e-mail no campo acima para recuperar a senha.");
            return;
        }

        Alert.alert(
            "Recuperar Senha",
            `Deseja enviar um link de redefinição para ${email}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Enviar",
                    onPress: async () => {
                        const success = await requestPasswordReset(email);
                        if (success) {
                            Alert.alert("Sucesso", "Instruções enviadas para o seu e-mail.");
                        } else {
                            Alert.alert("Erro", "Não encontramos uma conta com este e-mail.");
                        }
                    }
                }
            ]
        );
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
                            style={authStyles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View>
                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={authStyles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            {/* Botão Esqueci Senha */}
                            <TouchableOpacity
                                onPress={handleForgotPassword}
                                style={{ alignSelf: 'flex-end', marginTop: -15, marginBottom: 15, padding: 5 }}
                            >
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' , paddingTop:16}}>
                                    Esqueci minha senha
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button com Loading */}
                        <TouchableOpacity
                            style={[authStyles.signUpBtn, { marginTop: 10 }]}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FF4B91" />
                            ) : (
                                <Text style={authStyles.signUpText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        {/* Navigation Links */}
                        <TouchableOpacity
                            onPress={() => router.push('/Pages/Login/RegisterScreen' as any)}
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