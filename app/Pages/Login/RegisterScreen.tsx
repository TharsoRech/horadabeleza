import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { localStyles, styles } from '../styles';
import { useRouter } from "expo-router";
import { useAuth } from '../../Managers/AuthManager';
import { UserProfile, UserRole } from '../../Models/UserProfile';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { login } = useAuth();

    // Estados para os campos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');

    // Estados para Papel (Role) e Imagem
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);

    // Seleção de Imagem com Base64 Nativo
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setBase64Image(result.assets[0].base64 ?? undefined);
        }
    };

    const isFormValid =
        name.trim() !== '' &&
        email.trim() !== '' &&
        cpf.trim() !== '' &&
        birthDate.trim() !== '' &&
        password.trim() !== '';

    const handleRegister = async () => {
        if (!isFormValid) return;

        try {
            const newUser = new UserProfile({
                name: name,
                email: email,
                password: password,
                dob: birthDate,
                role: role,
                country: 'Brasil',
                base64Image: base64Image,
            });

            await login(newUser);
            console.log("Usuário registrado com sucesso como:", role);
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
        }
    };

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
                        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.textSection}>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Como você pretende usar o app?</Text>
                    </View>

                    {/* SELETOR DE ROLE (CLIENTE VS PROFISSIONAL) */}
                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[styles.roleCard, role === UserRole.CLIENT && styles.roleCardActive]}
                            onPress={() => setRole(UserRole.CLIENT)}
                        >
                            <MaterialCommunityIcons
                                name="account-search-outline"
                                size={32}
                                color={role === UserRole.CLIENT ? 'white' : 'rgba(255,255,255,0.6)'}
                            />
                            <Text style={[styles.roleText, role === UserRole.CLIENT && styles.roleTextActive]}>
                                Buscar Serviço
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.roleCard, role === UserRole.OWNER && styles.roleCardActive]}
                            onPress={() => setRole(UserRole.OWNER)}
                        >
                            <MaterialCommunityIcons
                                name="store-plus-outline"
                                size={32}
                                color={role === UserRole.OWNER ? 'white' : 'rgba(255,255,255,0.6)'}
                            />
                            <Text style={[styles.roleText, role === UserRole.OWNER && styles.roleTextActive]}>
                                Oferecer Serviço
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* SELETOR DE FOTO */}
                    <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderCircle}>
                                <Ionicons name="camera-outline" size={40} color="white" />
                                <Text style={styles.placeholderText}>Foto de Perfil</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* FORMULÁRIO */}
                    <View style={[styles.buttonContainer, { marginTop: 20 }]}>
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
                            placeholder="CPF"
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

                        <TouchableOpacity
                            disabled={!isFormValid}
                            style={[
                                styles.signUpBtn,
                                { marginTop: 10, opacity: isFormValid ? 1 : 0.5 }
                            ]}
                            onPress={handleRegister}
                        >
                            <Text style={styles.signUpText}>Finalizar Cadastro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
                            style={styles.guestBtn}
                        >
                            <Text style={styles.guestText}>Já possui uma conta? Faça Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}