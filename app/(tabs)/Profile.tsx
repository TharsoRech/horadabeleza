import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Image,
    TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

import { profileStyles } from "@/app/Styles/profileStyles";
import { useAuth } from '../Managers/AuthManager';
import { COLORS } from "@/constants/theme";
import { AuthGuardPlaceholder } from "@/app/Components/AuthGuardPlaceholder";
import { UserProfile, UserRole } from '../Models/UserProfile';
import { formatDate, convertToISO8601, formatCPF } from "@/app/Helpers/FormatStrings";
import { mapApiTypeToUserRole } from "@/app/Helpers/userRoleMapper";
import CustomAlert from '../Components/CustomAlert';
import { API_CONFIG } from '../Config/apiConfig';

import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";
import { Subscription } from "@/app/Models/Subscription";
import { SubscriptionModal } from '../Components/SubscriptionModal';
import { UserRepository } from "@/app/Repository/UserRepository";
import { ChangePasswordModal } from '../Components/ChangePasswordModal';
import { SavedCard } from '@/app/Types/apiTypes';

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type AlertButton = { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout, isAuthenticated, updateProfile } = useAuth();
    const subRepo = useMemo(() => new SubscriptionRepository(), []);
    const userRepo = useMemo(() => new UserRepository(), []);

    // --- ESTADOS DE DADOS ---
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);

    // --- ESTADOS DE UI ---
    const [isEditing, setIsEditing] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [subModalVisible, setSubModalVisible] = useState(false);
    const [cardModalVisible, setCardModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [inlineAlert, setInlineAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons?: AlertButton[];
    }>({ visible: false, title: '', message: '', buttons: undefined });
    const [cardAlert, setCardAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons?: AlertButton[];
    }>({ visible: false, title: '', message: '', buttons: undefined });

    // --- ESTADOS DE FORMULÁRIO PERFIL ---
    const [editName, setEditName] = useState(currentUser?.name || '');
    const [editEmail, setEditEmail] = useState(currentUser?.email || '');
    const [editCpf, setEditCpf] = useState(currentUser?.doc ? formatCPF(currentUser.doc) : ''); // Formatar CPF inicial
    const [editPhone, setEditPhone] = useState(currentUser?.phone || ''); // Campo de telefone
    const [editDob, setEditDob] = useState(currentUser?.dob ? formatDate(currentUser.dob) : '');
    const [editCountry, setEditCountry] = useState(currentUser?.country || '');
    const [editRole, setEditRole] = useState<UserRole>(currentUser?.role || UserRole.CLIENT);
    const [imageUri, setImageUri] = useState<string | null>(currentUser?.base64Image ? `data:image/jpeg;base64,${currentUser.base64Image}` : null);
    const [base64Image, setBase64Image] = useState<string | undefined>(currentUser?.base64Image);

    // --- ESTADO NOVO CARTÃO ---
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const showInlineAlert = useCallback((
        title: string,
        message: string,
        buttons?: AlertButton[]
    ) => {
        setInlineAlert({ visible: true, title, message, buttons });
    }, []);

    const closeInlineAlert = useCallback(() => {
        setInlineAlert({ visible: false, title: '', message: '', buttons: undefined });
    }, []);

    const showCardAlert = useCallback((
        title: string,
        message: string,
        buttons?: AlertButton[]
    ) => {
        setCardAlert({ visible: true, title, message, buttons });
    }, []);

    const closeCardAlert = useCallback(() => {
        setCardAlert({ visible: false, title: '', message: '', buttons: undefined });
    }, []);

    const toDobDisplay = useCallback((value?: string) => {
        if (!value) return '';

        // Evita efeito de fuso horário ao converter datas ISO puras (YYYY-MM-DD)
        const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoDateMatch) {
            const [, year, month, day] = isoDateMatch;
            return `${day}/${month}/${year}`;
        }

        return formatDate(value);
    }, []);

    const loadUserProfileFromAPI = useCallback(async (): Promise<UserRole> => {
        try {
            const token = API_CONFIG.getToken();
            if (!token) {
                console.warn("Sem token de autenticação disponível");
                return currentUser?.role || UserRole.CLIENT;
            }

            const response = await fetch(`${API_CONFIG.baseURL}/auth/me`, {
                method: 'GET',
                headers: API_CONFIG.getAuthHeaders(),
            });

            if (!response.ok) {
                console.error(`Erro ao carregar perfil do API: ${response.status}`);
                return currentUser?.role || UserRole.CLIENT;
            }

            const userData = await response.json();
            const resolvedRole = mapApiTypeToUserRole(userData?.role ?? userData?.type ?? currentUser?.role);
            console.log(userData)
            // Mapear dados do API para os campos do formulário
            if (userData) {
                setEditName(userData.name || currentUser?.name || '');
                setEditEmail(userData.email || currentUser?.email || '');
                setEditCpf(userData.doc ? formatCPF(userData.doc) : currentUser?.doc ? formatCPF(currentUser.doc) : '');
                setEditPhone(userData.phone || currentUser?.phone || '');
                setEditDob(userData.dob ? toDobDisplay(userData.dob) : currentUser?.dob ? toDobDisplay(currentUser.dob) : '');
                setEditCountry(userData.country || currentUser?.country || '');
                setEditRole(resolvedRole);
                
                // Se houver imagem, atualizar também
                if (userData.base64Image) {
                    setBase64Image(userData.base64Image);
                    setImageUri(`data:image/jpeg;base64,${userData.base64Image}`);
                }
            }

            return resolvedRole;
        } catch (error) {
            console.error("Erro ao carregar dados do perfil via API:", error);
            return currentUser?.role || UserRole.CLIENT;
        }
    }, [currentUser?.name, currentUser?.email, currentUser?.doc, currentUser?.phone, currentUser?.dob, currentUser?.country, currentUser?.role, toDobDisplay]);

    const loadInitialData = useCallback(async () => {
        try {
            // Carregar dados do usuário do endpoint /auth/me
            const userRole = await loadUserProfileFromAPI();

            // Assinatura e cartões são exclusivos de profissionais.
            if (userRole === UserRole.PROFISSIONAL) {
                const [subData, cardsData] = await Promise.all([
                    subRepo.getSubscription(),
                    subRepo.getSavedCards()
                ]);
                setSubscription(subData);
                setSavedCards(cardsData || []);
            } else {
                setSubscription(null);
                setSavedCards([]);
                setSubModalVisible(false);
                setCardModalVisible(false);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do perfil:", error);
        } finally {
            setLoadingInitial(false);
        }
    }, [loadUserProfileFromAPI, subRepo]);

    const handleSubscriptionSuccess = useCallback(async (newSub: Subscription) => {
        // Atualiza imediatamente a UI para refletir o sucesso retornado pelo modal.
        setSubscription(newSub);

        // Sincroniza com o backend de forma determinística, sem polling local.
        try {
            const freshCardsPromise = subRepo.getSavedCards();

            let backendSubscription: Subscription;
            if (newSub.isActive && newSub.planId && newSub.planId > 0) {
                // Garante assinatura ativa somente em fluxo de ativação/upgrade.
                backendSubscription = await subRepo.ensureSubscriptionExists(newSub.planId);
            } else {
                // Em cancelamento ou ausência de plano, apenas reflete o estado atual do backend.
                backendSubscription = await subRepo.getSubscription();
            }

            setSubscription(backendSubscription);
            setSavedCards((await freshCardsPromise) || []);
        } catch (error) {
            console.error('Erro ao sincronizar assinatura após sucesso:', error);
        }
    }, [subRepo]);

    const handleModalSubscriptionSuccess = useCallback(async (newSub: Subscription) => {
        await handleSubscriptionSuccess(newSub);
    }, [handleSubscriptionSuccess]);

    const handleCloseSubscriptionModal = useCallback(() => {
        setSubModalVisible(false);
        // Evita overlay residual da Profile após fechar modal de assinatura.
        closeInlineAlert();
    }, [closeInlineAlert]);

    const handleCloseCardModal = useCallback(() => {
        setCardModalVisible(false);
        setNewCard({ number: '', expiry: '', cvv: '', name: '' });
        // Evita overlay residual após fechar o modal de cartão.
        closeInlineAlert();
        closeCardAlert();
    }, [closeCardAlert, closeInlineAlert]);

    useEffect(() => {
        if (isAuthenticated) {
            loadInitialData();
        }
    }, [isAuthenticated, loadInitialData]);

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) {
                loadInitialData();
            }
        }, [isAuthenticated, loadInitialData])
    );


    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        return cleaned.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        return cleaned;
    };

    const getSubscriptionStatus = () => {
        const defaultStatus: { label: string, color: string, icon: MaterialIconName } = {
            label: "Nenhum Plano Ativo",
            color: "#FF3B30",
            icon: "alert-circle-outline"
        };
        if (!subscription) return defaultStatus;
        const normalizedPlanType = (subscription.planType || '').toLowerCase();
        if (subscription.isActive) {
            if (normalizedPlanType === 'trial' && subscription.trialEndDate) {
                const end = new Date(subscription.trialEndDate).getTime();
                const now = new Date().getTime();
                const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 3600 * 24)));
                if (daysLeft > 0) {
                    return { label: `PLANO FREE (${daysLeft} dias rest.)`, color: '#FF9800', icon: "clock-outline" as MaterialIconName };
                }
            }

            const planLabel = subscription.planName || (normalizedPlanType !== 'none' ? subscription.planType : 'Ativo');
            return { label: `PLANO ${String(planLabel).toUpperCase()}`, color: '#4CAF50', icon: "shield-check" as MaterialIconName };
        }
        return defaultStatus;
    };

    const subStatus = getSubscriptionStatus();
    const isProfessional = editRole === UserRole.PROFISSIONAL;

    // Função auxiliar para converter DD/MM/YYYY para YYYY-MM-DD
    const handleUpdate = useCallback(async () => {
        if (!currentUser) return;
        setLoadingAction(true);
        
        // Salvar os valores anteriores em caso de erro
        const previousValues = {
            name: editName,
            email: editEmail,
            cpf: editCpf,
            phone: editPhone,
            dob: editDob,
            country: editCountry,
            role: editRole,
            image: base64Image
        };
        
        try {
            // Converter data de DD/MM/YYYY (ou outro formato) para YYYY-MM-DD
            const normalizedDobInput = (editDob || '').trim();
            const hasDobDigits = /\d/.test(normalizedDobInput);
            const formattedDob = hasDobDigits ? convertToISO8601(normalizedDobInput) : '';
            
            console.log('🔄 Iniciando atualização de perfil...', {
                name: editName,
                email: editEmail,
                doc: editCpf,
                dob: formattedDob,
                phone: editPhone,
                country: editCountry
            });
            
            // Validar data
            if (hasDobDigits && !formattedDob) {
                showInlineAlert("Erro", `Data de nascimento inválida (${normalizedDobInput}). Use formato DD/MM/YYYY.`);
                return;
            }
            
            const updated = new UserProfile({
                ...currentUser,
                name: editName,
                email: editEmail,
                doc: editCpf.replace(/\D/g, ''), // Remover máscara do CPF
                dob: formattedDob || '',
                country: editCountry,
                role: editRole,
                base64Image: base64Image,
                phone: editPhone || '' // Garantir que phone nunca é undefined
            });
            
            // Aguardar a resposta da API antes de fazer qualquer alteração no UI
            await updateProfile(updated);
            
            console.log('✅ Perfil atualizado com sucesso!');
            setIsEditing(false);
            showInlineAlert("Sucesso", "Perfil atualizado com sucesso.");
        } catch (e: any) {
            // Rollback: restaurar os valores anteriores em caso de erro
            console.error("❌ Erro ao atualizar perfil:", {
                message: e?.message,
                error: e
            });
            setEditName(previousValues.name);
            setEditEmail(previousValues.email);
            setEditCpf(previousValues.cpf);
            setEditPhone(previousValues.phone);
            setEditDob(previousValues.dob);
            setEditCountry(previousValues.country);
            setEditRole(previousValues.role);
            setBase64Image(previousValues.image);
            
            const errorMessage = e?.message || "Erro ao atualizar perfil. Verifique sua conexão e tente novamente.";
            console.log('💬 Exibindo erro:', errorMessage);
            showInlineAlert("Erro", errorMessage);
        } finally {
            setLoadingAction(false);
        }
    }, [
        base64Image,
        currentUser,
        editCountry,
        editCpf,
        editDob,
        editEmail,
        editName,
        editPhone,
        editRole,
        showInlineAlert,
        updateProfile
    ]);

    const handleDeleteAccount = () => {
        if (!currentUser) return;
        showInlineAlert(
            "Excluir Conta",
            "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        setLoadingAction(true);
                        try {
                            const success = await userRepo.deleteAccount(currentUser.id);
                            if (success) {
                                logout();
                                showInlineAlert("Sucesso", "Conta excluída com sucesso.");
                            } else {
                                showInlineAlert("Erro", "Falha ao excluir conta.");
                            }
                        } catch {
                            showInlineAlert("Erro", "Não foi possível excluir a conta.");
                        } finally {
                            setLoadingAction(false);
                        }
                    }
                }
            ]
        );
    };

    const handleAddCard = async () => {
        const { number, expiry, cvv, name } = newCard;
        if (number.length < 19 || expiry.length < 5 || cvv.length < 3 || !name) {
            showCardAlert("Erro", "Dados do cartão inválidos.");
            return;
        }
        setLoadingAction(true);
        try {
            await subRepo.saveCard({
                number,
                expiry,
                cvv,
                name
            });

            setSavedCards(await subRepo.getSavedCards());

            handleCloseCardModal();
            setTimeout(() => {
                showInlineAlert("Sucesso", "Cartão adicionado!");
            }, 0);
        } catch (error: any) {
            showCardAlert("Erro", error?.message || "Não foi possível adicionar o cartão.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteCard = (id: string) => {
        showCardAlert("Remover", "Excluir este cartão?", [
            { text: "Não", style: 'cancel' },
            {
                text: "Sim",
                style: 'destructive',
                onPress: async () => {
                    try {
                        await subRepo.deleteCard(id);
                        setSavedCards(await subRepo.getSavedCards());
                    } catch (error: any) {
                        showCardAlert("Erro", error?.message || "Não foi possível excluir o cartão.");
                    }
                }
            }
        ]);
    };

    const handleSetDefault = async (id: string) => {
        try {
            await subRepo.setDefaultCard(id);
            setSavedCards(await subRepo.getSavedCards());
        } catch (error: any) {
            showCardAlert("Erro", error?.message || "Não foi possível definir o cartão padrão.");
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setBase64Image(result.assets[0].base64 ?? undefined);
        }
    };

    const RoleButton = ({ role, label, icon }: { role: UserRole, label: string, icon: any }) => {
        const isSelected = editRole === role;
        return (
            <TouchableOpacity onPress={() => setEditRole(role)} style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingVertical: 10, borderRadius: 8, backgroundColor: isSelected ? COLORS.primary : '#F0F0F0',
                gap: 5, borderWidth: 1, borderColor: isSelected ? COLORS.primary : '#EEE'
            }}>
                <MaterialCommunityIcons name={icon} size={18} color={isSelected ? '#FFF' : COLORS.textSub} />
                <Text style={{ color: isSelected ? '#FFF' : COLORS.textSub, fontWeight: 'bold', fontSize: 12 }}>{label}</Text>
            </TouchableOpacity>
        );
    };

    if (!isAuthenticated) return <AuthGuardPlaceholder title="Seu Perfil" description="Faça login." icon="person-circle-outline" />;
    if (loadingInitial) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#FFF' }}>
                <View style={[profileStyles.container, { paddingTop: insets.top }]}>

                    {/* HEADER */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 }}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity onPress={() => setIsEditing(false)}><Text style={{ color: COLORS.muted }}>Cancelar</Text></TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Dados Pessoais</Text>
                                <TouchableOpacity onPress={handleUpdate} disabled={loadingAction}>
                                    {loadingAction ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Salvar</Text>}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Meu Perfil</Text></View>
                        )}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* AVATAR */}
                        <View style={profileStyles.profileHeader}>
                            <TouchableOpacity disabled={!isEditing} onPress={pickImage} style={profileStyles.avatarCircle}>
                                {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: 50 }} /> : <Ionicons name="person" size={50} color={COLORS.secondary} />}
                                {isEditing && <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 15, padding: 5 }}><Ionicons name="camera" size={16} color="#FFF" /></View>}
                            </TouchableOpacity>
                        </View>

                        <View style={profileStyles.menuContainer}>
                            {isEditing ? (
                                <View style={{ paddingHorizontal: 20, gap: 15 }}>
                                    <View><Text style={profileStyles.label}>Nome Completo</Text><TextInput style={profileStyles.input} value={editName} onChangeText={setEditName} /></View>
                                    <View><Text style={profileStyles.label}>E-mail</Text><TextInput style={profileStyles.input} value={editEmail} onChangeText={setEditEmail} autoCapitalize="none" keyboardType="email-address" /></View>
                                    <View><Text style={profileStyles.label}>CPF</Text><TextInput style={profileStyles.input} value={editCpf} onChangeText={v => setEditCpf(formatCPF(v))} keyboardType="numeric" maxLength={14} placeholder="000.000.000-00" /></View>
                                    <View><Text style={profileStyles.label}>Telefone</Text><TextInput style={profileStyles.input} value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" placeholder="(11) 99999-9999" /></View>
                                    <View>
                                        <Text style={profileStyles.label}>Tipo de Perfil</Text>
                                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 5 }}>
                                            <RoleButton role={UserRole.CLIENT} label="Cliente" icon="account-outline" />
                                            <RoleButton role={UserRole.PROFISSIONAL} label="Profissional" icon="shield-crown-outline" />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <View style={{ flex: 1 }}><Text style={profileStyles.label}>Nascimento</Text><TextInput style={profileStyles.input} value={editDob} onChangeText={v => setEditDob(formatDate(v))} keyboardType="numeric" placeholder="DD/MM/YYYY" maxLength={10} /></View>
                                        <View style={{ flex: 1 }}><Text style={profileStyles.label}>País</Text><TextInput style={profileStyles.input} value={editCountry} onChangeText={setEditCountry} /></View>
                                    </View>

                                    {/* EXCLUIR CONTA - MOSTRANDO APENAS NOS DADOS PESSOAIS (MODO EDIÇÃO) */}
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 10, alignSelf: 'center' }}
                                        onPress={handleDeleteAccount}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                                        <Text style={{ color: "#FF3B30", fontWeight: '600', marginLeft: 8 }}>Excluir minha conta</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <TouchableOpacity style={profileStyles.menuItem} onPress={() => setIsEditing(true)}>
                                        <View style={profileStyles.menuIconContainer}><Ionicons name="person-outline" size={22} color={COLORS.primary} /></View>
                                        <Text style={profileStyles.menuText}>Dados Pessoais</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                    </TouchableOpacity>

                                    {isProfessional && (
                                        <TouchableOpacity style={profileStyles.menuItem} onPress={() => setSubModalVisible(true)}>
                                            <View style={profileStyles.menuIconContainer}><MaterialCommunityIcons name="crown-outline" size={22} color="#FFD700" /></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={profileStyles.menuText}>Minha Assinatura</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <MaterialCommunityIcons name={subStatus.icon} size={14} color={subStatus.color} />
                                                    <Text style={{ fontSize: 11, color: subStatus.color, fontWeight: '700' }}>{subStatus.label}</Text>
                                                </View>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                        </TouchableOpacity>
                                    )}

                                    {isProfessional && (
                                        <TouchableOpacity style={profileStyles.menuItem} onPress={() => setCardModalVisible(true)}>
                                            <View style={profileStyles.menuIconContainer}><Ionicons name="card-outline" size={22} color="#4CAF50" /></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={profileStyles.menuText}>Métodos de pagamento</Text>
                                                <Text style={{ fontSize: 11, color: COLORS.muted, marginLeft:8 }}>{savedCards.length} cartão(ões) salvo(s)</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                        </TouchableOpacity>
                                    )}

                                    {/* ALTERAR SENHA - SOMENTE NO MENU PRINCIPAL */}
                                    <TouchableOpacity style={profileStyles.menuItem} onPress={() => setChangePasswordModalVisible(true)}>
                                        <View style={profileStyles.menuIconContainer}><Ionicons name="key-outline" size={22} color="#2196F3" /></View>
                                        <Text style={profileStyles.menuText}>Alterar Senha</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[profileStyles.menuItem, { marginTop: 10 }]} onPress={logout}>
                                        <View style={profileStyles.menuIconContainer}><Ionicons name="log-out-outline" size={22} color={COLORS.secondary} /></View>
                                        <Text style={[profileStyles.menuText, { color: COLORS.secondary }]}>Sair da Conta</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

            {isProfessional && (
                <SubscriptionModal
                    visible={subModalVisible}
                    onClose={handleCloseSubscriptionModal}
                    isTrialEligible={subscription?.isTrialEligible ?? true}
                    currentSubscription={subscription}
                    onSubscriptionSuccess={handleModalSubscriptionSuccess}
                />
            )}

            <Modal visible={isProfessional && cardModalVisible} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '85%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Gerenciar Cartões</Text>
                            <TouchableOpacity onPress={handleCloseCardModal}><Ionicons name="close-circle" size={30} color="#DDD" /></TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {savedCards.map(card => (
                                <View key={card.id} style={{
                                    flexDirection: 'row', alignItems: 'center', backgroundColor: card.isDefault ? COLORS.primary + '10' : '#F8F9FA',
                                    padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: card.isDefault ? 1.5 : 0, borderColor: COLORS.primary
                                }}>
                                    <MaterialCommunityIcons name="credit-card-chip-outline" size={30} color={COLORS.primary} />
                                    <View style={{ flex: 1, marginLeft: 15 }}>
                                        <Text style={{ fontWeight: 'bold' }}>**** {card.last4}</Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>Vence em {card.expiry}</Text>
                                    </View>
                                    {!card.isDefault && (
                                        <TouchableOpacity onPress={() => handleSetDefault(card.id)} style={{ marginRight: 15 }}>
                                            <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: 'bold' }}>Padrão</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => handleDeleteCard(card.id)}><Ionicons name="trash-outline" size={22} color="#FF5252" /></TouchableOpacity>
                                </View>
                            ))}
                            <View style={{ marginTop: 10, padding: 18, backgroundColor: '#F9F9F9', borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD' }}>
                                <Text style={{ fontWeight: 'bold', marginBottom: 15 }}>Novo Cartão</Text>
                                <TextInput style={profileStyles.input} placeholder="Nome no Cartão" value={newCard.name} onChangeText={t => setNewCard({...newCard, name: t})} />
                                <TextInput style={[profileStyles.input, { marginTop: 10 }]} placeholder="Número do Cartão" keyboardType="numeric" value={newCard.number} onChangeText={t => setNewCard({...newCard, number: formatCardNumber(t)})} maxLength={19} />
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                    <TextInput style={[profileStyles.input, { flex: 1 }]} placeholder="MM/AA" keyboardType="numeric" value={newCard.expiry} onChangeText={t => setNewCard({...newCard, expiry: formatExpiry(t)})} maxLength={5} />
                                    <TextInput style={[profileStyles.input, { flex: 1 }]} placeholder="CVV" keyboardType="numeric" value={newCard.cvv} onChangeText={t => setNewCard({...newCard, cvv: t.replace(/\D/g, '')})} maxLength={4} />
                                </View>
                                <TouchableOpacity onPress={handleAddCard} disabled={loadingAction} style={{ backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' }}>
                                    {loadingAction ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Adicionar Cartão</Text>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <ChangePasswordModal
                visible={changePasswordModalVisible}
                onClose={() => setChangePasswordModalVisible(false)}
                onSuccess={() => showInlineAlert("Sucesso", "Senha alterada com sucesso! Outros dispositivos podem precisar fazer login novamente.")}
                onPasswordChange={async (currentPassword, newPassword) => {
                    if (!currentUser) throw new Error("Usuário não autenticado");
                    const success = await userRepo.changePassword(currentUser.id, currentPassword, newPassword);
                    if (!success) throw new Error("Falha ao alterar senha");
                }}
            />

            <CustomAlert
                visible={inlineAlert.visible && !subModalVisible && !cardModalVisible && !changePasswordModalVisible}
                title={inlineAlert.title}
                message={inlineAlert.message}
                buttons={inlineAlert.buttons}
                onConfirm={closeInlineAlert}
            />

            <CustomAlert
                visible={cardAlert.visible && cardModalVisible}
                title={cardAlert.title}
                message={cardAlert.message}
                buttons={cardAlert.buttons}
                onConfirm={closeCardAlert}
            />
        </>
    );
}



