import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";
import { ServiceEditModalStyles as styles } from "../Styles/ServiceEditModalStyles";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onSave: (updatedSalon: Salon) => void;
    onManageServices: () => void; // Abre o modal de serviços
    onManageProfessionals: () => void; // Abre o modal de profissionais
}

export const SalonEditModal = ({
                                   visible,
                                   salon,
                                   onClose,
                                   onSave,
                                   onManageServices,
                                   onManageProfessionals
                               }: Props) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [published, setPublished] = useState(false);

    // Sincroniza os dados ao abrir
    useEffect(() => {
        if (salon) {
            setName(salon.name);
            setAddress(salon.address);
            setDescription(salon.description || '');
            setPhone(salon.phone || '');
            setWhatsApp(salon.whatsApp || '');
            setPublished(salon.published);
        }
    }, [salon, visible]);

    const handleSave = () => {
        if (!name.trim() || !address.trim()) {
            return Alert.alert("Erro", "Nome e Endereço são obrigatórios.");
        }

        const updated: Salon = {
            ...salon!,
            name,
            address,
            description,
            phone,
            whatsApp,
            published,
        };
        onSave(updated);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Unidade</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveText}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Seção: Informações Básicas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados da Unidade</Text>

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
                            placeholder="Av. Paulista, 1000..."
                        />

                        <Text style={styles.label}>Descrição / Bio</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            placeholder="Conte um pouco sobre o salão..."
                        />
                    </View>

                    {/* Seção: Contato */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contato</Text>

                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="5511..."
                        />

                        <Text style={styles.label}>WhatsApp</Text>
                        <TextInput
                            style={styles.input}
                            value={whatsApp}
                            onChangeText={setWhatsApp}
                            keyboardType="phone-pad"
                            placeholder="5511..."
                        />
                    </View>

                    {/* Seção: Visibilidade */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.sectionTitle}>Status de Publicação</Text>
                                <Text style={styles.subLabel}>Tornar visível para clientes?</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setPublished(!published)}
                                style={[styles.toggleBtn, published ? styles.toggleOn : styles.toggleOff]}
                            >
                                <Ionicons
                                    name={published ? "eye" : "eye-off"}
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Seção: Gestão de Equipe e Serviços (Hubs para outros modais) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Configurações Avançadas</Text>

                        {/* Botão Serviços */}
                        <TouchableOpacity style={styles.manageButton} onPress={onManageServices}>
                            <View style={styles.rowItems}>
                                <MaterialCommunityIcons name="content-cut" size={24} color={COLORS.primary} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.manageButtonTitle}>Gerenciar Serviços</Text>
                                    <Text style={styles.subLabel}>{salon?.serviceIds.length || 0} categorias vinculadas</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>

                        {/* Botão Profissionais */}
                        <TouchableOpacity style={styles.manageButton} onPress={onManageProfessionals}>
                            <View style={styles.rowItems}>
                                <Ionicons name="people-outline" size={24} color={COLORS.primary} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.manageButtonTitle}>Corpo Profissional</Text>
                                    <Text style={styles.subLabel}>{salon?.professionalIds.length || 0} especialistas</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};