import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { COLORS } from "@/constants/theme";
import { useAuth } from '../../Managers/AuthManager';
import { UserProfile } from '../../Models/UserProfile';
import { formatDate, convertToISO8601 } from "@/app/Helpers/FormatStrings";

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { currentUser, updateProfile, deleteUserAccount } = useAuth();

    const [isSaving, setIsSaving] = useState(false);

    // Estados dos campos do UserProfile
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [doc, setDoc] = useState(currentUser?.doc || '');
    const [dob, setDob] = useState(currentUser?.dob || '');
    const [country, setCountry] = useState(currentUser?.country || 'Brasil');
    const [imageUri, setImageUri] = useState<string | null>(
        currentUser?.base64Image ? `data:image/jpeg;base64,${currentUser.base64Image}` : null
    );
    const [base64Image, setBase64Image] = useState<string | undefined>(currentUser?.base64Image);

    // Estados de Senha
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setBase64Image(result.assets[0].base64 ?? undefined);
        }
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        // Converter data de DD/MM/YYYY (ou outro formato) para YYYY-MM-DD
        const isoDate = convertToISO8601(dob);
        
        // Validação extra para garantir que a data seja válida para o SQL Server
        if (dob && !isoDate) {
            Alert.alert("Erro", "Data de nascimento inválida. Use o formato DD/MM/YYYY.");
            return;
        }

        if (isoDate) {
            const birthDateObj = new Date(isoDate);
            const minDate = new Date('1753-01-01');
            const maxDate = new Date('9999-12-31');
            
            if (birthDateObj < minDate || birthDateObj > maxDate) {
                Alert.alert("Erro", "Data de nascimento inválida. Por favor, insira uma data entre 01/01/1753 e 31/12/9999.");
                return;
            }
        }

        setIsSaving(true);
        try {
            const updatedUser = new UserProfile({
                ...currentUser,
                name,
                email,
                phone: phone || '',
                doc,
                dob: isoDate || dob, // Usar data convertida
                country,
                base64Image,
                password: password || currentUser?.password
            });

            console.log('🔄 Atualizando perfil...', { 
                name, 
                email, 
                phone,
                dob: isoDate 
            });
            await updateProfile(updatedUser);
            console.log('✅ Perfil atualizado!');
            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            router.back();
        } catch (error: any) {
            console.error('❌ Erro ao atualizar perfil:', error);
            const errorMsg = error?.message || "Não foi possível salvar as alterações.";
            Alert.alert("Erro", errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Excluir Conta",
            "Esta ação é permanente e apagará todos os seus dados. Deseja continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir permanentemente",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsSaving(true);
                            await deleteUserAccount();
                        } catch (e) {
                            Alert.alert("Erro", "Falha ao excluir conta.");
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {/* Header */}
            <View style={{
                paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 15,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                borderBottomWidth: 1, borderBottomColor: '#EEE'
            }}>
                <TouchableOpacity onPress={() => router.back()} disabled={isSaving}>
                    <Ionicons name="close" size={28} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Editar Perfil</Text>
                <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> :
                        <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>

                    {/* Foto */}
                    <View style={{ alignItems: 'center', marginBottom: 25 }}>
                        <TouchableOpacity onPress={pickImage} style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F0F0', overflow: 'hidden' }}>
                            {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} /> :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="camera" size={35} color="#CCC" /></View>}
                        </TouchableOpacity>
                        <Text style={{ marginTop: 8, color: COLORS.primary, fontWeight: '600' }}>Alterar Foto</Text>
                    </View>

                    {/* Formulário */}
                    <View style={{ gap: 15 }}>
                        <InputLabel label="Nome Completo" value={name} onChange={setName} />
                        <InputLabel label="E-mail" value={email} onChange={setEmail} keyboardType="email-address" />
                        <InputLabel label="Telefone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
                        <InputLabel label="CPF/CNPJ" value={doc} onChange={setDoc} keyboardType="numeric" />

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <InputLabel label="Nascimento" value={dob} onChange={(v:any) => setDob(formatDate(v))} keyboardType="numeric" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <InputLabel label="País" value={country} onChange={setCountry} />
                            </View>
                        </View>

                        {/* Senha */}
                        <TouchableOpacity
                            onPress={() => setShowPasswordSection(!showPasswordSection)}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                        >
                            <Ionicons name={showPasswordSection ? "chevron-down" : "chevron-forward"} size={18} color={COLORS.muted} />
                            <Text style={{ color: COLORS.muted, fontWeight: '600', marginLeft: 5 }}>Alterar Senha</Text>
                        </TouchableOpacity>

                        {showPasswordSection && (
                            <View style={{ gap: 12, padding: 15, backgroundColor: '#FAFAFA', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' }}>
                                <InputLabel label="Nova Senha" value={password} onChange={setPassword} secure />
                                <InputLabel label="Confirmar Nova Senha" value={confirmPassword} onChange={setConfirmPassword} secure />
                            </View>
                        )}
                    </View>

                    {/* Excluir Conta */}
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        style={{ marginTop: 40, padding: 15, borderRadius: 12, backgroundColor: '#FFF0F0', alignItems: 'center' }}
                    >
                        <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Excluir minha conta</Text>
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// Sub-componente de Input para limpar o código
const InputLabel = ({ label, value, onChange, keyboardType = 'default', secure = false }: any) => (
    <View>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#888', marginBottom: 5, marginLeft: 4 }}>{label}</Text>
        <TextInput
            style={{ backgroundColor: '#F8F8F8', padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#EEE' }}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            secureTextEntry={secure}
            autoCapitalize="none"
        />
    </View>
);