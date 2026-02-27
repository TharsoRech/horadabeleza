import React, { useState } from 'react';
import {
    Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView,
    Platform, ScrollView, Image, Alert, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { authStyles } from "@/app/Styles/authStyles";
import { useAuth } from '../../Managers/AuthManager';
import { UserProfile, UserRole } from '../../Models/UserProfile';
import { formatDate, formatDoc } from "@/app/Helpers/FormatStrings";

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { register } = useAuth(); // Usando o método register corrigido

    // States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [doc, setDoc] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    // Validações originais
    const isEmailValid = (ev: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev);
    const isDocValid = doc.replace(/\D/g, "").length >= 11;
    const isPasswordStrong = password.length >= 6;

    const isFormValid =
        name.trim().length > 3 &&
        isEmailValid(email) &&
        isDocValid &&
        birthDate.length === 10 &&
        isPasswordStrong;

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

    const handleRegister = async () => {
        if (!isFormValid) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos corretamente.");
            return;
        }

        setLoading(true);
        try {
            // Chamando o register do Manager passando os dados planos
            await register({
                name,
                email: email.toLowerCase().trim(),
                dob: birthDate,
                role,
                country: 'Brasil',
                base64Image,
            });
        } catch (error: any) {
            console.error("Erro ao registrar:", error);
            Alert.alert("Erro", error.message || "Falha ao criar conta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <LinearGradient colors={['#FF4B91', '#FF76CE']} style={authStyles.background} />

            <TouchableOpacity
                onPress={() => router.back()}
                style={{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10, padding: 5 }}
            >
                <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[
                        authStyles.content,
                        { paddingTop: insets.top + 50, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[authStyles.textSection, { marginBottom: 15 }]}>
                        <Text style={[authStyles.title, { fontSize: 26 }]}>Criar Conta</Text>
                        <Text style={authStyles.subtitle}>Preencha seus dados abaixo</Text>
                    </View>

                    {/* ROLE SELECTOR ORIGINAL */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15, marginLeft: 16, marginRight: 16 }}>
                        <TouchableOpacity
                            style={[
                                authStyles.roleCard,
                                { flex: 1, padding: 10, height: 70 },
                                role === UserRole.CLIENT && authStyles.roleCardActive
                            ]}
                            onPress={() => { setRole(UserRole.CLIENT); setDoc(''); }}
                        >
                            <MaterialCommunityIcons name="account-heart" size={24} color={role === UserRole.CLIENT ? 'white' : 'rgba(255,255,255,0.6)'} />
                            <Text style={[authStyles.roleText, { fontSize: 12 }, role === UserRole.CLIENT && authStyles.roleTextActive]}>Cliente</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                authStyles.roleCard,
                                { flex: 1, padding: 10, height: 70 },
                                role === UserRole.PROFISSIONAL && authStyles.roleCardActive
                            ]}
                            onPress={() => { setRole(UserRole.PROFISSIONAL); setDoc(''); }}
                        >
                            <MaterialCommunityIcons name="content-cut" size={24} color={role === UserRole.PROFISSIONAL ? 'white' : 'rgba(255,255,255,0.6)'} />
                            <Text style={[authStyles.roleText, { fontSize: 12 }, role === UserRole.PROFISSIONAL && authStyles.roleTextActive]}>Profissional</Text>
                        </TouchableOpacity>
                    </View>

                    {/* IMAGE PICKER ORIGINAL */}
                    <TouchableOpacity
                        onPress={pickImage}
                        style={[authStyles.imagePickerContainer, { marginBottom: 15, alignSelf: 'center' }]}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={[authStyles.profileImage, { width: 90, height: 90, borderRadius: 45 }]} />
                        ) : (
                            <View style={[authStyles.placeholderCircle, { width: 90, height: 90, borderRadius: 45 }]}>
                                <Ionicons name="camera" size={28} color="white" />
                                <Text style={[authStyles.placeholderText, { fontSize: 10 }]}>Foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* FORM ORIGINAL */}
                    <View style={[authStyles.buttonContainer, { marginTop: 0 }]}>
                        <TextInput
                            placeholder="Nome Completo"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={[authStyles.input, { marginBottom: 10 }]}
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput
                            placeholder="E-mail"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={[authStyles.input, { marginBottom: 10 }]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                            <TextInput
                                placeholder={role === UserRole.CLIENT ? "CPF" : "CPF/CNPJ"}
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, { flex: 1.2 }]}
                                keyboardType="numeric"
                                value={doc}
                                onChangeText={(v) => setDoc(formatDoc(v, role))}
                            />
                            <TextInput
                                placeholder="Nascimento"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, { flex: 1 }]}
                                keyboardType="numeric"
                                value={birthDate}
                                onChangeText={(v) => setBirthDate(formatDate(v))}
                            />
                        </View>

                        <TextInput
                            placeholder="Senha (mín. 6 caracteres)"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            style={[authStyles.input, { marginBottom: 20 }]}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            disabled={!isFormValid || loading}
                            style={[
                                authStyles.signUpBtn,
                                {
                                    marginTop: 0,
                                    opacity: isFormValid ? 1 : 0.6,
                                    height: 55
                                }
                            ]}
                            onPress={handleRegister}
                        >
                            {loading ? <ActivityIndicator color="#FF4B91" /> : <Text style={authStyles.signUpText}>Finalizar Cadastro</Text>}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}