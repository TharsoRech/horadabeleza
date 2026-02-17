import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { localStyles, styles } from '../styles';
import { useRouter } from 'expo-router'; // ADD THIS

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter(); // INITIALIZE ROUTER
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF4B91', '#FF76CE']} style={styles.background} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={[
                    styles.content,
                    { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }
                ]}>
                    <View style={styles.textSection}>
                        <Text style={styles.title}>Bem-vinda de Volta</Text>
                        <Text style={styles.subtitle}>Sentimos sua falta!</Text>
                    </View>

                    <View style={[styles.buttonContainer, { marginTop: 40 }]}>
                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.signUpBtn}>
                            <Text style={styles.signUpText}>Entrar</Text>
                        </TouchableOpacity>

                        {/* CHANGE navigation.navigate TO router.push */}
                        <TouchableOpacity onPress={() => router.push('/Pages/Login/RegisterScreen' as any)} style={styles.guestBtn}>
                            <Text style={styles.guestText}>Não tem uma conta? Cadastre-se</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.guestBtn}>
                            <Text style={styles.guestText}
                                  onPress={() => router.push('/Pages/Welcome/WelcomeScreen' as any)}>
                                Ou volte para o inicio</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}