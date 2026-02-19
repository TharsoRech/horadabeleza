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
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// New Modular Styles
import { authStyles } from "@/app/Styles/authStyles";

// Logic & Models
import { useAuth } from '../../Managers/AuthManager';
import { UserProfile, UserRole } from '../../Models/UserProfile';

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { login } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);

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
                name, email, password, dob: birthDate,
                role, country: 'Brasil', base64Image,
            });
            await login(newUser);
        } catch (error) {
            console.error("Erro ao registrar:", error);
        }
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
                        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.textSection}>
                        <Text style={authStyles.title}>Criar Conta</Text>
                        <Text style={authStyles.subtitle}>Como você pretende usar o app?</Text>
                    </View>

                    {/* ROLE SELECTOR */}
                    <View style={authStyles.roleContainer}>
                        <TouchableOpacity
                            style={[authStyles.roleCard, role === UserRole.CLIENT && authStyles.roleCardActive]}
                            onPress={() => setRole(UserRole.CLIENT)}
                        >
                            <MaterialCommunityIcons
                                name="account-search-outline"
                                size={32}
                                color={role === UserRole.CLIENT ? 'white' : 'rgba(255,255,255,0.6)'}
                            />
                            <Text style={[authStyles.roleText, role === UserRole.CLIENT && authStyles.roleTextActive]}>
                                Buscar Serviço
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[authStyles.roleCard, role === UserRole.OWNER && authStyles.roleCardActive]}
                            onPress={() => setRole(UserRole.OWNER)}
                        >
                            <MaterialCommunityIcons
                                name="store-plus-outline"
                                size={32}
                                color={role === UserRole.OWNER ? 'white' : 'rgba(255,255,255,0.6)'}
                            />
                            <Text style={[authStyles.roleText, role === UserRole.OWNER && authStyles.roleTextActive]}>
                                Oferecer Serviço
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* IMAGE PICKER */}
                    <TouchableOpacity onPress={pickImage} style={authStyles.imagePickerContainer}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={authStyles.profileImage} />
                        ) : (
                            <View style={authStyles.placeholderCircle}>
                                <Ionicons name="camera-outline" size={40} color="white" />
                                <Text style={authStyles.placeholderText}>Foto de Perfil</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* FORM */}
                    <View style={[authStyles.buttonContainer, { marginTop: 20 }]}>
                        <TextInput
                            placeholder="Nome Completo"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input} // Uses the shared input style
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="CPF"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input}
                            keyboardType="numeric"
                            value={cpf}
                            onChangeText={setCpf}
                        />
                        <TextInput
                            placeholder="Data de Nascimento"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input}
                            value={birthDate}
                            onChangeText={setBirthDate}
                        />
                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={authStyles.input}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            disabled={!isFormValid}
                            style={[
                                authStyles.signUpBtn,
                                { marginTop: 10, opacity: isFormValid ? 1 : 0.5 }
                            ]}
                            onPress={handleRegister}
                        >
                            <Text style={authStyles.signUpText}>Finalizar Cadastro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
                            style={authStyles.guestBtn}
                        >
                            <Text style={authStyles.guestText}>Já possui uma conta? Faça Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}