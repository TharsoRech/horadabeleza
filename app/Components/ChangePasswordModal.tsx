import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";
import CustomAlert from './CustomAlert';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    onClose,
    onPasswordChange
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            await CustomAlert.show("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (newPassword !== confirmPassword) {
            await CustomAlert.show("Erro", "As senhas novas não coincidem.");
            return;
        }

        if (newPassword.length < 6) {
            await CustomAlert.show("Erro", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            await onPasswordChange(currentPassword, newPassword);
            await CustomAlert.show("Sucesso", "Senha alterada com sucesso!");
            onClose();
            // Limpa os campos
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            await CustomAlert.show("Erro", "Falha ao alterar senha. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Limpa os campos ao fechar
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    backgroundColor: '#FFF',
                    borderRadius: 20,
                    padding: 25,
                    width: '100%',
                    maxWidth: 400
                }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: COLORS.primary + '20',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="key-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.textMain }}>Alterar Senha</Text>
                                <Text style={{ fontSize: 12, color: COLORS.muted }}>Proteja sua conta</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#F0F0F0',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={{ gap: 15 }}>
                        {/* Senha Atual */}
                        <View>
                            <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: '600' }}>Senha Atual</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#E0E0E0',
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                backgroundColor: '#FAFAFA'
                            }}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        fontSize: 16
                                    }}
                                    placeholder="Digite sua senha atual"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showCurrentPassword}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    <Ionicons name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Nova Senha */}
                        <View>
                            <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: '600' }}>Nova Senha</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#E0E0E0',
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                backgroundColor: '#FAFAFA'
                            }}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        fontSize: 16
                                    }}
                                    placeholder="Digite sua nova senha"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showNewPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                    <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirmar Nova Senha */}
                        <View>
                            <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: '600' }}>Confirmar Nova Senha</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#E0E0E0',
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                backgroundColor: '#FAFAFA'
                            }}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        fontSize: 16
                                    }}
                                    placeholder="Confirme sua nova senha"
                                    placeholderTextColor="#999"
                                    secureTextEntry={true}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Dicas de Segurança */}
                        <View style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: 10,
                            padding: 12,
                            borderLeftWidth: 3,
                            borderLeftColor: COLORS.primary
                        }}>
                            <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600', marginBottom: 4 }}>Dicas de Segurança:</Text>
                            <Text style={{ fontSize: 10, color: COLORS.muted }}>
                                • Use pelo menos 6 caracteres
                            </Text>
                            <Text style={{ fontSize: 10, color: COLORS.muted }}>
                                • Não use informações pessoais
                            </Text>
                            <Text style={{ fontSize: 10, color: COLORS.muted }}>
                                • Altere periodicamente
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                backgroundColor: '#F0F0F0',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={loading}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <Ionicons name="refresh-outline" size={20} color="#FFF" />
                            ) : (
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFF' }}>Alterar Senha</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};