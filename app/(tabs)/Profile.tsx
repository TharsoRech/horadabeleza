import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Image,
    TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal
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

import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";
import { Subscription } from "@/app/Models/Subscription";
import { SubscriptionModal } from '../Components/SubscriptionModal';

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { currentUser, logout, isAuthenticated, updateProfile } = useAuth();
    const subRepo = new SubscriptionRepository();

    // --- ESTADOS DE DADOS ---
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);

    // --- ESTADOS DE UI ---
    const [isEditing, setIsEditing] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [subModalVisible, setSubModalVisible] = useState(false);
    const [cardModalVisible, setCardModalVisible] = useState(false);

    // --- ESTADOS DE FORMULÁRIO PERFIL ---
    const [editName, setEditName] = useState(currentUser?.name || '');
    const [editEmail, setEditEmail] = useState(currentUser?.email || '');
    const [editDob, setEditDob] = useState(currentUser?.dob || '');
    const [editCountry, setEditCountry] = useState(currentUser?.country || '');
    const [editRole, setEditRole] = useState<UserRole>(currentUser?.role || UserRole.CLIENT);
    const [editPassword, setEditPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(currentUser?.base64Image ? `data:image/jpeg;base64,${currentUser.base64Image}` : null);
    const [base64Image, setBase64Image] = useState<string | undefined>(currentUser?.base64Image);

    // --- ESTADO NOVO CARTÃO ---
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

    // Função centralizada para carregar dados (pode ser chamada no mount ou após update)
    const loadInitialData = useCallback(async () => {
        try {
            const [subData, cardsData] = await Promise.all([
                subRepo.getSubscription(),
                subRepo.getSavedCards()
            ]);
            setSubscription(subData);
            setSavedCards(cardsData || []);
        } catch (error) {
            console.error("Erro ao carrergar dados do perfil:", error);
        } finally {
            setLoadingInitial(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadInitialData();
        }
    }, [isAuthenticated, loadInitialData]);

    // --- MÁSCARAS E FORMATADORES ---
    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        return cleaned.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        return cleaned;
    };

    // --- LÓGICA DE STATUS DA ASSINATURA ---
    const getSubscriptionStatus = () => {
        const defaultStatus: { label: string, color: string, icon: MaterialIconName } = {
            label: "Nenhum Plano Ativo",
            color: "#FF3B30",
            icon: "alert-circle-outline"
        };

        if (!subscription) return defaultStatus;

        // Caso 1: Plano Pago Ativo (Premium, Gold, etc)
        if (subscription.isActive &&  subscription.planType !== 'trial') {
            return {
                label: `PLANO ${subscription.planType.toUpperCase()}`,
                color: '#4CAF50',
                icon: "shield-check" as MaterialIconName
            };
        }

        // Caso 2: Plano FREE (Trial de 30 dias)
        if (subscription.trialEndDate) {
            const end = new Date(subscription.trialEndDate).getTime();
            const now = new Date().getTime();
            const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 3600 * 24)));

            if (daysLeft > 0) {
                return {
                    label: `PLANO FREE (${daysLeft} dias rest.)`,
                    color: '#FF9800',
                    icon: "clock-outline" as MaterialIconName
                };
            }
        }

        return defaultStatus;
    };

    const subStatus = getSubscriptionStatus();

    // --- AÇÕES ---
    const handleUpdate = async () => {
        if (editPassword && editPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        setLoadingAction(true);
        try {
            const updated = new UserProfile({
                ...currentUser,
                name: editName, email: editEmail, dob: editDob,
                country: editCountry, role: editRole, base64Image: base64Image,
                ...(editPassword ? { password: editPassword } : {})
            });
            await updateProfile(updated);
            setIsEditing(false);
            setEditPassword(''); setConfirmPassword(''); setShowPasswordSection(false);
            Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
        } catch (e) {
            Alert.alert("Erro", "Falha ao atualizar perfil.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleAddCard = async () => {
        const { number, expiry, cvv, name } = newCard;
        if (number.length < 19 || expiry.length < 5 || cvv.length < 3 || !name) {
            Alert.alert("Erro", "Dados do cartão inválidos.");
            return;
        }
        setLoadingAction(true);
        try {
            const cardToSave = {
                id: Date.now().toString(),
                last4: number.slice(-4),
                expiry: expiry,
                isDefault: savedCards.length === 0
            };
            await subRepo.saveCard(cardToSave);
            setSavedCards(prev => [...prev, cardToSave]);
            setNewCard({ number: '', expiry: '', cvv: '', name: '' });
            Alert.alert("Sucesso", "Cartão adicionado!");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteCard = (id: string) => {
        Alert.alert("Remover", "Excluir este cartão?", [
            { text: "Não" },
            { text: "Sim", style: 'destructive', onPress: async () => {
                    await subRepo.deleteCard(id);
                    setSavedCards(prev => prev.filter(c => c.id !== id));
                }}
        ]);
    };

    const handleSetDefault = async (id: string) => {
        await subRepo.setDefaultCard(id);
        setSavedCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={[profileStyles.container, { paddingTop: insets.top }]}>

                {/* HEADER */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 }}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity onPress={() => setIsEditing(false)}><Text style={{ color: COLORS.muted }}>Cancelar</Text></TouchableOpacity>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Editar Perfil</Text>
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
                        {!isEditing && (
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <Text style={profileStyles.userName}>{currentUser?.name}</Text>
                                <Text style={profileStyles.userEmail}>{currentUser?.email} ({currentUser?.role})</Text>
                            </View>
                        )}
                    </View>

                    <View style={profileStyles.menuContainer}>
                        {isEditing ? (
                            <View style={{ paddingHorizontal: 20, gap: 15 }}>
                                <View><Text style={profileStyles.label}>Nome</Text><TextInput style={profileStyles.input} value={editName} onChangeText={setEditName} /></View>
                                <View><Text style={profileStyles.label}>E-mail</Text><TextInput style={profileStyles.input} value={editEmail} onChangeText={setEditEmail} autoCapitalize="none" /></View>
                                <View>
                                    <Text style={profileStyles.label}>Tipo de Perfil</Text>
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 5 }}>
                                        <RoleButton role={UserRole.CLIENT} label="Cliente" icon="account-outline" />
                                        <RoleButton role={UserRole.PROFISSIONAL} label="Profissional" icon="shield-crown-outline" />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}><Text style={profileStyles.label}>Nascimento</Text><TextInput style={profileStyles.input} value={editDob} onChangeText={v => setEditDob(formatDate(v))} keyboardType="numeric" /></View>
                                    <View style={{ flex: 1 }}><Text style={profileStyles.label}>País</Text><TextInput style={profileStyles.input} value={editCountry} onChangeText={setEditCountry} /></View>
                                </View>
                                <TouchableOpacity onPress={() => setShowPasswordSection(!showPasswordSection)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Ionicons name={showPasswordSection ? "chevron-down" : "chevron-forward"} size={18} color={COLORS.muted} />
                                    <Text style={{ color: COLORS.muted, fontWeight: '600', marginLeft: 5 }}>Alterar Senha</Text>
                                </TouchableOpacity>
                                {showPasswordSection && (
                                    <View style={{ gap: 12, padding: 15, backgroundColor: '#FAFAFA', borderRadius: 12 }}>
                                        <View style={profileStyles.passwordContainer}>
                                            <TextInput style={{ flex: 1 }} secureTextEntry={!showPassword} value={editPassword} onChangeText={setEditPassword} placeholder="Nova Senha" />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#999" /></TouchableOpacity>
                                        </View>
                                        <TextInput style={profileStyles.input} secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirmar Senha" />
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={{ paddingHorizontal: 15 }}>
                                <TouchableOpacity style={profileStyles.menuItem} onPress={() => setIsEditing(true)}>
                                    <View style={profileStyles.menuIconContainer}><Ionicons name="person-outline" size={22} color={COLORS.primary} /></View>
                                    <Text style={profileStyles.menuText}>Dados Pessoais</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                </TouchableOpacity>

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

                                <TouchableOpacity style={profileStyles.menuItem} onPress={() => setCardModalVisible(true)}>
                                    <View style={profileStyles.menuIconContainer}><Ionicons name="card-outline" size={22} color="#4CAF50" /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={profileStyles.menuText}>Métodos de pagamento</Text>
                                        <Text style={{ fontSize: 11, color: COLORS.muted, marginLeft:8 }}>{savedCards.length} cartão(ões) salvo(s)</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                </TouchableOpacity>

                                <TouchableOpacity style={[profileStyles.menuItem, { marginTop: 20 }]} onPress={logout}>
                                    <View style={profileStyles.menuIconContainer}><Ionicons name="log-out-outline" size={22} color={COLORS.secondary} /></View>
                                    <Text style={[profileStyles.menuText, { color: COLORS.secondary }]}>Sair da Conta</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>

            <SubscriptionModal
                visible={subModalVisible}
                onClose={() => setSubModalVisible(false)}
                isTrialEligible={!subscription?.trialStartDate}
                onSubscriptionSuccess={(newSub) => {
                    // Atualiza o estado local imediatamente
                    setSubscription(newSub);
                    // Recarrega do repositório para garantir persistência
                    loadInitialData();
                }}
            />

            <Modal visible={cardModalVisible} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '85%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Gerenciar Cartões</Text>
                            <TouchableOpacity onPress={() => setCardModalVisible(false)}><Ionicons name="close-circle" size={30} color="#DDD" /></TouchableOpacity>
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
                                <TextInput
                                    style={[profileStyles.input, { marginTop: 10 }]}
                                    placeholder="Número do Cartão"
                                    keyboardType="numeric"
                                    value={newCard.number}
                                    onChangeText={t => setNewCard({...newCard, number: formatCardNumber(t)})}
                                    maxLength={19}
                                />
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                    <TextInput
                                        style={[profileStyles.input, { flex: 1 }]}
                                        placeholder="MM/AA"
                                        keyboardType="numeric"
                                        value={newCard.expiry}
                                        onChangeText={t => setNewCard({...newCard, expiry: formatExpiry(t)})}
                                        maxLength={5}
                                    />
                                    <TextInput
                                        style={[profileStyles.input, { flex: 1 }]}
                                        placeholder="CVV"
                                        keyboardType="numeric"
                                        value={newCard.cvv}
                                        onChangeText={t => setNewCard({...newCard, cvv: t.replace(/\D/g, '')})}
                                        maxLength={4}
                                    />
                                </View>
                                <TouchableOpacity onPress={handleAddCard} disabled={loadingAction} style={{ backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' }}>
                                    {loadingAction ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Adicionar Cartão</Text>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}