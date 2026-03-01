import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";
import { ServiceEditModalStyles as styles } from "../Styles/ServiceEditModalStyles"; // Reutilizando a base de estilos

interface Props {
    visible: boolean;
    salon: Salon | null; // Se for null, o modal entra em modo "Adicionar"
    onClose: () => void;
    onSave: (salon: Salon) => Promise<void>; // Mudamos para Promise para lidar com o Repo
}

export const SalonManagerModal = ({ visible, salon, onClose, onSave }: Props) => {
    // Estados do Salão
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Inicialização (Edit vs Add)
    useEffect(() => {
        if (salon) {
            setName(salon.name);
            setAddress(salon.address);
            setDescription(salon.description || '');
            setPhone(salon.phone || '');
            setWhatsApp(salon.whatsApp || '');
        } else {
            // Reset para novo salão
            setName('');
            setAddress('');
            setDescription('');
            setPhone('');
            setWhatsApp('');
        }
    }, [salon, visible]);

    const handleSave = async () => {
        if (!name.trim() || !address.trim()) {
            return Alert.alert("Erro", "Nome e Endereço são obrigatórios.");
        }

        setIsSaving(true);

        const salonData: Salon = {
            id: salon?.id || Math.random().toString(36).substr(2, 9), // Gera ID se for novo
            name,
            address,
            description,
            phone,
            whatsApp,
            rating: salon?.rating || "0.0",
            reviews: salon?.reviews || 0,
            serviceIds: salon?.serviceIds || [],
            professionalIds: salon?.professionalIds || [],
            userHasVisited: salon?.userHasVisited || false,
            image: salon?.image || '',
            gallery: salon?.gallery || []
        };

        try {
            await onSave(salonData);
            onClose();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar os dados do salão.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header Dinâmico */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} disabled={isSaving}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {salon ? 'Editar Salão' : 'Novo Salão'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                        <Text style={[styles.saveText, isSaving && { opacity: 0.5 }]}>
                            {isSaving ? '...' : 'Salvar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Seção: Identificação */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Identificação</Text>

                        <Text style={styles.label}>Nome do Estabelecimento</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Studio Glamour"
                        />

                        <Text style={styles.label}>Endereço Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Rua, Número, Bairro, Cidade"
                        />
                    </View>

                    {/* Seção: Descrição */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sobre o Salão</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            placeholder="Conte um pouco sobre a história e especialidades do salão..."
                        />
                    </View>

                    {/* Seção: Contato */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Canais de Contato</Text>

                        <View style={styles.rowItems}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Telefone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="(11) 9999-9999"
                                />
                            </View>
                        </View>

                        <View style={styles.rowItems}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>WhatsApp (Com DDD)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={whatsApp}
                                    onChangeText={setWhatsApp}
                                    keyboardType="phone-pad"
                                    placeholder="5511999999999"
                                />
                            </View>
                        </View>
                        <Text style={styles.subLabel}>Dica: Use o formato internacional para o WhatsApp (Ex: 55 + DDD + Número).</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};