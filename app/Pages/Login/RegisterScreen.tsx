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
import { UserRole } from '../../Models/UserProfile';
import { formatDate, formatDoc } from "@/app/Helpers/FormatStrings";
import CustomAlert from '../../Components/CustomAlert';
import {NotificationPopup} from '../../Components/NotificationPopup';

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { register } = useAuth(); // Usando o método register corrigido

    // States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [doc, setDoc] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

    // Validações aprimoradas
    const isEmailValid = (ev: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev);
    const isDocValid = doc.replace(/\D/g, "").length >= 11;
    const isPasswordStrong = password.length >= 6;
    const isPhoneValid = phone.replace(/\D/g, "").length >= 10;
    const isNameValid = name.trim().length > 3;
    const isBirthDateValid = birthDate.length === 10;

    // Funções de validação detalhadas
    const validateDoc = (docValue: string, userRole: UserRole) => {
        const cleanDoc = docValue.replace(/\D/g, "");
        if (cleanDoc.length === 0) return { valid: false, message: "" };
        
        if (userRole === UserRole.CLIENT) {
            // Validação de CPF
            if (cleanDoc.length !== 11) {
                return { valid: false, message: "CPF deve ter 11 dígitos" };
            }
            if (!validateCPF(cleanDoc)) {
                return { valid: false, message: "CPF inválido" };
            }
        } else {
            // Validação de CNPJ
            if (cleanDoc.length !== 14) {
                return { valid: false, message: "CNPJ deve ter 14 dígitos" };
            }
            if (!validateCNPJ(cleanDoc)) {
                return { valid: false, message: "CNPJ inválido" };
            }
        }
        return { valid: true, message: "Documento válido" };
    };

    const validatePassword = (passwordValue: string) => {
        const hasMinLength = passwordValue.length >= 6;
        const hasUppercase = /[A-Z]/.test(passwordValue);
        const hasLowercase = /[a-z]/.test(passwordValue);
        const hasNumber = /\d/.test(passwordValue);
        
        const strength = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;
        
        return {
            strength,
            valid: hasMinLength,
            message: hasMinLength ? "Senha forte" : "Mínimo 6 caracteres"
        };
    };

    const validateBirthDate = (dateValue: string) => {
        if (dateValue.length !== 10) return { valid: false, message: "Formato: DD/MM/AAAA" };
        
        const [day, month, year] = dateValue.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        
        if (isNaN(date.getTime())) return { valid: false, message: "Data inválida" };
        
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        
        if (age < 13) return { valid: false, message: "Idade mínima: 13 anos" };
        if (age > 120) return { valid: false, message: "Data de nascimento inválida" };
        
        return { valid: true, message: "Data válida" };
    };

    const isFormValid =
        isNameValid &&
        isEmailValid(email) &&
        isDocValid &&
        isPhoneValid &&
        isBirthDateValid &&
        isPasswordStrong;

    // Funções de validação de CPF/CNPJ
    const validateCPF = (cpf: string) => {
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.charAt(10));
    };

    const validateCNPJ = (cnpj: string) => {
        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let sum = 0;
        for (let i = 0; i < 12; i++) sum += parseInt(cnpj.charAt(i)) * weights1[i];
        let remainder = sum % 11;
        let digit = remainder < 2 ? 0 : 11 - remainder;
        if (parseInt(cnpj.charAt(12)) !== digit) return false;

        sum = 0;
        for (let i = 0; i < 13; i++) sum += parseInt(cnpj.charAt(i)) * weights2[i];
        remainder = sum % 11;
        digit = remainder < 2 ? 0 : 11 - remainder;
        return parseInt(cnpj.charAt(13)) === digit;
    };

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
            // Converte a data para o formato que o backend pode estar esperando (YYYY-MM-DD)
            const [day, month, year] = birthDate.split('/');
            const dobFormatted = `${year}-${month}-${day}`;

            // Validação extra para garantir que a data seja válida para o SQL Server
            const birthDateObj = new Date(dobFormatted);
            const minDate = new Date('1753-01-01');
            const maxDate = new Date('9999-12-31');
            
            if (birthDateObj < minDate || birthDateObj > maxDate) {
                Alert.alert("Erro", "Data de nascimento inválida. Por favor, insira uma data entre 01/01/1753 e 31/12/9999.");
                setLoading(false);
                return;
            }

            // Chamando o register do Manager passando os dados planos
            await register({
                name,
                email: email.toLowerCase().trim(),
                password,
                role,
                phone: phone.replace(/\D/g, ""), // Envia o telefone limpo (apenas números)
                base64Image,
                doc: doc.replace(/\D/g, ""), // Envia o CPF/CNPJ limpo (apenas números)
                dob: dobFormatted, // Envia a data no formato YYYY-MM-DD
            });
        } catch (error: any) {
            console.error("Erro ao registrar:", error);
            
            // Tratamento de erros amigável para o usuário
            let errorMessage = "Não foi possível registrar. Por favor, tente novamente.";
            let alertTitle = "Ops!";
            
            // Mensagens específicas que são amigáveis ao usuário (backend em inglês)
            if (error.message) {
                const errorMsg = error.message.toLowerCase();
                
                // Mensagens específicas que o usuário pode entender (procurando por termos em inglês)
                if (errorMsg.includes("email address is already registered") || errorMsg.includes("email already exists")) {
                    errorMessage = "Este e-mail já está cadastrado. Por favor, utilize outro e-mail ou faça login.";
                } else if (errorMsg.includes("cpf already exists") || errorMsg.includes("cnpj already exists") || errorMsg.includes("document already exists") || errorMsg.includes("cpf/cnpj")) {
                    errorMessage = "Já existe um usuário cadastrado com este CPF/CNPJ. Por favor, utilize outro documento.";
                } else if (errorMsg.includes("verify the data") || errorMsg.includes("check the data") || errorMsg.includes("invalid data") || errorMsg.includes("bad request")) {
                    errorMessage = "Verifique os dados informados e tente novamente.";
                } else if (errorMsg.includes("conflict")) {
                    errorMessage = "Conflito: Este recurso já existe.";
                } else if (errorMsg.includes("invalid credentials") || errorMsg.includes("unauthorized")) {
                    errorMessage = "As credenciais fornecidas são inválidas.";
                } else if (errorMsg.includes("internal server error") || errorMsg.includes("server error")) {
                    errorMessage = "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.";
                } else if (errorMsg.includes("could not register") || errorMsg.includes("failed to register") || errorMsg.includes("unable to register")) {
                    errorMessage = "Não foi possível registrar. Por favor, tente novamente.";
                }
                // Para outras mensagens específicas do backend que são amigáveis, mantemos
                else if (!errorMsg.includes("error") && !errorMsg.includes("http") && !errorMsg.includes("status") && !errorMsg.includes("request") && !errorMsg.includes("failed") && !errorMsg.includes("exception")) {
                    // Se a mensagem não contém termos técnicos, podemos usar
                    errorMessage = error.message;
                }
            }
            
            // Erros de status HTTP - sempre mensagens genéricas
            if (error.response?.status) {
                const status = error.response.status;
                if (status === 400) {
                    errorMessage = "Verifique os dados informados e tente novamente.";
                } else if (status === 409) {
                    errorMessage = "Conflito: Este recurso já existe.";
                } else if (status === 500) {
                    errorMessage = "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.";
                } else if (status >= 400) {
                    errorMessage = "Não foi possível processar a solicitação. Por favor, tente novamente.";
                }
            }
            
            setAlertTitle(alertTitle);
            setAlertMessage(errorMessage);
            setAlertVisible(true);
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={{ flex: 1 }}>
                    <View
                        style={[
                            authStyles.content,
                            { 
                                paddingTop: insets.top + 5, 
                                paddingBottom: insets.bottom + 5,
                            }
                        ]}
                    >
                    <View style={[authStyles.textSection, { marginBottom: 10 }]}>
                        <Text style={[authStyles.title, { fontSize: 22 }]}>Criar Conta</Text>
                        <Text style={[authStyles.subtitle, { fontSize: 14 }]}>Preencha seus dados abaixo</Text>
                    </View>

                    {/* ROLE SELECTOR */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, marginLeft: 12, marginRight: 12 }}>
                        <TouchableOpacity
                            style={[
                                authStyles.roleCard,
                                { flex: 1, padding: 8, height: 60 },
                                role === UserRole.CLIENT && authStyles.roleCardActive
                            ]}
                            onPress={() => { setRole(UserRole.CLIENT); setDoc(''); }}
                        >
                            <MaterialCommunityIcons name="account-heart" size={20} color={role === UserRole.CLIENT ? 'white' : 'rgba(255,255,255,0.6)'} />
                            <Text style={[authStyles.roleText, { fontSize: 11 }, role === UserRole.CLIENT && authStyles.roleTextActive]}>Cliente</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                authStyles.roleCard,
                                { flex: 1, padding: 8, height: 60 },
                                role === UserRole.PROFISSIONAL && authStyles.roleCardActive
                            ]}
                            onPress={() => { setRole(UserRole.PROFISSIONAL); setDoc(''); }}
                        >
                            <MaterialCommunityIcons name="content-cut" size={20} color={role === UserRole.PROFISSIONAL ? 'white' : 'rgba(255,255,255,0.6)'} />
                            <Text style={[authStyles.roleText, { fontSize: 11 }, role === UserRole.PROFISSIONAL && authStyles.roleTextActive]}>Profissional</Text>
                        </TouchableOpacity>
                    </View>

                    {/* IMAGE PICKER */}
                    <TouchableOpacity
                        onPress={pickImage}
                        style={[authStyles.imagePickerContainer, { marginBottom: 10, alignSelf: 'center' }]}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={[authStyles.profileImage, { width: 80, height: 80, borderRadius: 40 }]} />
                        ) : (
                            <View style={[authStyles.placeholderCircle, { width: 80, height: 80, borderRadius: 40 }]}>
                                <Ionicons name="camera" size={24} color="white" />
                                <Text style={[authStyles.placeholderText, { fontSize: 9 }]}>Foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* FORM */}
                    <View style={[authStyles.buttonContainer, { marginTop: 0, paddingHorizontal: 20 }]}>
                        {/* Nome */}
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                placeholder="Nome Completo"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, isNameValid ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                value={name}
                                onChangeText={setName}
                            />
                            {name.length > 0 && (
                                <Text style={[authStyles.validationText, { fontSize: 11 }, isNameValid ? { color: '#4CAF50' } : { color: '#FF4B91' }]}>
                                    {isNameValid ? "✓ Nome válido" : "Nome deve ter mais de 3 caracteres"}
                                </Text>
                            )}
                        </View>

                        {/* E-mail */}
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                placeholder="E-mail"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, isEmailValid(email) ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            {email.length > 0 && (
                                <Text style={[authStyles.validationText, { fontSize: 11 }, isEmailValid(email) ? { color: '#4CAF50' } : { color: '#FF4B91' }]}>
                                    {isEmailValid(email) ? "✓ E-mail válido" : "E-mail inválido"}
                                </Text>
                            )}
                        </View>

                        {/* Telefone */}
                        <View style={{ marginBottom: 8 }}>
                            <TextInput
                                placeholder="Telefone (ex: 11987654321)"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, isPhoneValid ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                            {phone.length > 0 && (
                                <Text style={[authStyles.validationText, { fontSize: 11 }, isPhoneValid ? { color: '#4CAF50' } : { color: '#FF4B91' }]}>
                                    {isPhoneValid ? "✓ Telefone válido" : "Telefone deve ter no mínimo 10 dígitos"}
                                </Text>
                            )}
                        </View>

                        {/* CPF/CNPJ e Data de Nascimento */}
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                            <View style={{ flex: 1.2 }}>
                                <TextInput
                                    placeholder={role === UserRole.CLIENT ? "CPF" : "CPF/CNPJ"}
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    style={[authStyles.input, validateDoc(doc, role).valid ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                    keyboardType="numeric"
                                    value={doc}
                                    onChangeText={(v) => setDoc(formatDoc(v, role))}
                                />
                                {doc.length > 0 && (
                                    <Text style={[authStyles.validationText, { fontSize: 11 }, validateDoc(doc, role).valid ? { color: '#4CAF50' } : { color: '#FF4B91' }]}>
                                        {validateDoc(doc, role).message}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    placeholder="Nascimento"
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    style={[authStyles.input, validateBirthDate(birthDate).valid ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                    keyboardType="numeric"
                                    value={birthDate}
                                    onChangeText={(v) => setBirthDate(formatDate(v))}
                                />
                                {birthDate.length > 0 && (
                                    <Text style={[authStyles.validationText, { fontSize: 11 }, validateBirthDate(birthDate).valid ? { color: '#4CAF50' } : { color: '#FF4B91' }]}>
                                        {validateBirthDate(birthDate).message}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Senha */}
                        <View style={{ marginBottom: 15 }}>
                            <TextInput
                                placeholder="Senha (mín. 6 caracteres)"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={[authStyles.input, validatePassword(password).valid ? { borderColor: '#4CAF50', borderWidth: 2 } : {}]}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                            {password.length > 0 && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        {[1, 2, 3, 4].map((index) => (
                                            <View
                                                key={index}
                                                style={{
                                                    height: 3,
                                                    flex: 1,
                                                    backgroundColor: index <= validatePassword(password).strength ? 
                                                        (validatePassword(password).strength >= 3 ? '#4CAF50' : '#FFA500') : '#E0E0E0',
                                                    marginRight: 2
                                                }}
                                            />
                                        ))}
                                    </View>
                                    <Text style={[authStyles.validationText, { marginLeft: 8, fontSize: 11, color: validatePassword(password).valid ? '#4CAF50' : '#FF4B91' }]}>
                                        {validatePassword(password).message}
                                    </Text>
                                </View>
                            )}
                        </View>

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
                </View>
            </View>
            </KeyboardAvoidingView>

            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onConfirm={() => setAlertVisible(false)}
            />

            {/* Notification Popup */}
            <NotificationPopup
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={[]}
            />
        </View>
    );
}
