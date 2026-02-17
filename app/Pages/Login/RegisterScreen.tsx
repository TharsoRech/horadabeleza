import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { localStyles, styles } from '../styles';
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    // 1. State for all fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');

    // 2. Logic to check if all fields are filled
    const isFormValid =
        name.trim() !== '' &&
        email.trim() !== '' &&
        cpf.trim() !== '' &&
        birthDate.trim() !== '' &&
        password.trim() !== '';

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF4B91', '#FF76CE']} style={styles.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.content,
                        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.textSection}>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Comece sua jornada de beleza hoje.</Text>
                    </View>

                    <View style={[styles.buttonContainer, { marginTop: 30 }]}>
                        <TextInput
                            placeholder="Nome Completo"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="CPF (000.000.000-00)"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            keyboardType="numeric"
                            value={cpf}
                            onChangeText={setCpf}
                        />
                        <TextInput
                            placeholder="Data de Nascimento (DD/MM/AAAA)"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            keyboardType="numeric"
                            value={birthDate}
                            onChangeText={setBirthDate}
                        />
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={localStyles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* 3. Conditional Styling and Disabled State */}
                        <TouchableOpacity
                            disabled={!isFormValid}
                            style={[
                                styles.signUpBtn,
                                {
                                    marginTop: 10,
                                    opacity: isFormValid ? 1 : 0.5 // Dims button when disabled
                                }
                            ]}
                            onPress={() => {
                                if(isFormValid) {
                                    console.log("Cadastro realizado!");
                                    // Handle registration logic here
                                }
                            }}
                        >
                            <Text style={styles.signUpText}>Finalizar Cadastro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
                            style={styles.guestBtn}
                        >
                            <Text style={styles.guestText}>Já possui uma conta? Faça Login</Text>
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