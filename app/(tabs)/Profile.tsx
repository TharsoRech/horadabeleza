import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Image,
    TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { profileStyles } from "@/app/Styles/profileStyles";
import { useAuth } from '../Managers/AuthManager';
import { COLORS } from "@/constants/theme";
import { AuthGuardPlaceholder } from "@/app/Components/AuthGuardPlaceholder";
import { UserProfile, UserRole } from '../Models/UserProfile';
import { formatDate } from "@/app/Helpers/FormatStrings";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout, isAuthenticated, updateProfile, deleteUserAccount } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [editName, setEditName] = useState(currentUser?.name || '');
    const [editEmail, setEditEmail] = useState(currentUser?.email || '');
    const [editDob, setEditDob] = useState(currentUser?.dob || '');
    const [editCountry, setEditCountry] = useState(currentUser?.country || '');
    const [editRole, setEditRole] = useState<UserRole>(currentUser?.role || UserRole.CLIENT);
    const [editPassword, setEditPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(
        currentUser?.base64Image ? `data:image/jpeg;base64,${currentUser.base64Image}` : null
    );
    const [base64Image, setBase64Image] = useState<string | undefined>(currentUser?.base64Image);

    if (!isAuthenticated) {
        return <AuthGuardPlaceholder title="Seu Perfil" description="Faça login para gerenciar suas informações." icon="person-circle-outline" />;
    }

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

    const handleUpdate = async () => {
        if (editPassword && editPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        setLoadingAction(true);
        try {
            const updated = new UserProfile({
                ...currentUser,
                name: editName,
                email: editEmail,
                dob: editDob,
                country: editCountry,
                role: editRole,
                base64Image: base64Image,
                ...(editPassword ? { password: editPassword } : {})
            });

            await updateProfile(updated);
            setIsEditing(false);
            setEditPassword('');
            setConfirmPassword('');
            setShowPasswordSection(false);
        } catch (e) {
            Alert.alert("Erro", "Falha ao atualizar.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Excluir Conta", "Tem certeza? Isso é irreversível.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir permanentemente", style: "destructive", onPress: () => deleteUserAccount() }
        ]);
    };

    const RoleButton = ({ role, label, icon }: { role: UserRole, label: string, icon: any }) => {
        const isSelected = editRole === role;
        return (
            <TouchableOpacity
                onPress={() => setEditRole(role)}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: isSelected ? COLORS.primary : '#F0F0F0',
                    gap: 5,
                    borderWidth: 1,
                    borderColor: isSelected ? COLORS.primary : '#EEE'
                }}
            >
                <MaterialCommunityIcons name={icon} size={18} color={isSelected ? '#FFF' : COLORS.textSub} />
                <Text style={{ color: isSelected ? '#FFF' : COLORS.textSub, fontWeight: 'bold', fontSize: 12 }}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: '#FFF' }}
        >
            <View style={[profileStyles.container, { paddingTop: insets.top }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 }}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity onPress={() => { setIsEditing(false); setShowPasswordSection(false); }}>
                                <Text style={{ color: COLORS.muted, fontSize: 16 }}>Cancelar</Text>
                            </TouchableOpacity>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Editar Perfil</Text>
                            <TouchableOpacity onPress={handleUpdate} disabled={loadingAction}>
                                {loadingAction ? <ActivityIndicator size="small" color={COLORS.primary} /> :
                                    <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Meu Perfil</Text>
                        </View>
                    )}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    <View style={[profileStyles.profileHeader, { marginTop: 10 }]}>
                        <TouchableOpacity disabled={!isEditing} onPress={pickImage} style={profileStyles.avatarCircle}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                            ) : (
                                <Ionicons name="person" size={50} color={COLORS.secondary} />
                            )}
                            {isEditing && (
                                <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 15, padding: 5, borderWidth: 2, borderColor: '#FFF' }}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {!isEditing && (
                            <View style={{ alignItems: 'center', paddingHorizontal: 20, width: '100%' }}>
                                <Text style={[profileStyles.userName, { textAlign: 'center' }]} numberOfLines={2}>
                                    {String(currentUser?.name || '')}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
                                    <MaterialCommunityIcons
                                        name={currentUser?.role === UserRole.PROFISSIONAL ? "shield-check" : "account"}
                                        size={14}
                                        color={COLORS.textSub}
                                    />
                                    {/* FIX: Garantindo que o e-mail e a role sejam strings puras */}
                                    <Text style={profileStyles.userEmail}>
                                        {`${currentUser?.email || ''} (${String(currentUser?.role || '')})`}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={[profileStyles.menuContainer, { marginTop: 15 }]}>
                        {isEditing ? (
                            <View style={{ paddingHorizontal: 20, gap: 15 }}>
                                <View>
                                    <Text style={profileStyles.label}>Nome</Text>
                                    <TextInput style={profileStyles.input} value={editName} onChangeText={setEditName} autoComplete="off" autoCorrect={false} />
                                </View>
                                <View>
                                    <Text style={profileStyles.label}>E-mail</Text>
                                    <TextInput style={profileStyles.input} value={editEmail} onChangeText={setEditEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="off" autoCorrect={false} textContentType="oneTimeCode" />
                                </View>

                                <View>
                                    <Text style={profileStyles.label}>Tipo de Perfil</Text>
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 5, marginBottom: 10 }}>
                                        <RoleButton role={UserRole.CLIENT} label="Cliente" icon="account-outline" />
                                        <RoleButton role={UserRole.PROFISSIONAL} label="Profissional" icon="shield-crown-outline" />
                                    </View>

                                    <View style={{ backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.primary }}>
                                        <Text style={{ fontSize: 13, color: COLORS.textMain, lineHeight: 18 }}>
                                            {editRole === UserRole.CLIENT ? (
                                                <Text>
                                                    <Text style={{ fontWeight: 'bold' }}>Perfil Cliente: </Text>
                                                    Ideal para quem deseja buscar e agendar serviços na plataforma com facilidade.
                                                </Text>
                                            ) : (
                                                <Text>
                                                    <Text style={{ fontWeight: 'bold' }}>Perfil Profissional: </Text>
                                                    Além de consumir, você poderá <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>cadastrar seus próprios serviços</Text> e gerenciar seu negócio.
                                                </Text>
                                            )}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={profileStyles.label}>Nascimento</Text>
                                        <TextInput style={profileStyles.input} value={editDob} onChangeText={(v) => setEditDob(formatDate(v))} placeholder="DD/MM/AAAA" keyboardType="numeric" autoComplete="off" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={profileStyles.label}>País</Text>
                                        <TextInput style={profileStyles.input} value={editCountry} onChangeText={setEditCountry} autoComplete="off" />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => setShowPasswordSection(!showPasswordSection)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingVertical: 10 }}>
                                    <Ionicons name={showPasswordSection ? "chevron-down" : "chevron-forward"} size={18} color={COLORS.muted} />
                                    <Text style={{ color: COLORS.muted, fontWeight: '600', marginLeft: 5 }}>Alterar Senha</Text>
                                </TouchableOpacity>

                                {showPasswordSection && (
                                    <View style={{ gap: 12, padding: 15, backgroundColor: '#FAFAFA', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' }}>
                                        <View>
                                            <Text style={profileStyles.label}>Nova Senha</Text>
                                            <View style={profileStyles.passwordContainer}>
                                                <TextInput style={{ flex: 1, fontSize: 16 }} secureTextEntry={!showPassword} value={editPassword} onChangeText={setEditPassword} placeholder="Mínimo 6 caracteres" autoComplete="off" textContentType="oneTimeCode" />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.muted} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={profileStyles.label}>Confirmar Nova Senha</Text>
                                            <TextInput style={profileStyles.input} secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} autoComplete="off" textContentType="oneTimeCode" />
                                        </View>
                                    </View>
                                )}

                                <TouchableOpacity onPress={handleDelete} style={{ marginTop: 25, padding: 15, borderRadius: 10, backgroundColor: '#FFF1F1', alignItems: 'center' }}>
                                    <Text style={{ color: '#FF3B30', fontWeight: 'bold' }}>Excluir Conta</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity style={profileStyles.menuItem} onPress={() => setIsEditing(true)}>
                                    <Ionicons name="person-outline" size={24} color={COLORS.textMain} />
                                    <Text style={profileStyles.menuText}>Meu Perfil</Text>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                                </TouchableOpacity>

                                <TouchableOpacity style={profileStyles.menuItem}>
                                    <MaterialCommunityIcons name="calendar-check" size={24} color={COLORS.textMain} />
                                    <Text style={profileStyles.menuText}>Meus Serviços</Text>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                                </TouchableOpacity>

                                <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginHorizontal: 20 }} />

                                <TouchableOpacity style={profileStyles.menuItem} onPress={logout}>
                                    <Ionicons name="log-out-outline" size={24} color={COLORS.secondary} />
                                    <Text style={[profileStyles.menuText, profileStyles.logoutText]}>Sair da Conta</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <Text style={{ textAlign: 'center', color: '#CCC', fontSize: 12, marginTop: 40 }}>Versão 1.0.0</Text>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}