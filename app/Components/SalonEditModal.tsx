import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Salon } from "@/app/Models/Salon";
import { Service } from "@/app/Models/Service";
import { COLORS } from "@/constants/theme";
import { SalonEditModalStyles as styles } from "../Styles/SalonEditModalStyles";
import { ServiceEditModal } from "./ServiceEditModal";
import { SalonRepository } from "@/app/Repository/SalonRepository";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onSave: (updatedSalon: Salon) => void;
    onManageProfessionals: (salon: Salon) => void;
}

export const SalonEditModal = ({ visible, salon, onClose, onSave, onManageProfessionals }: Props) => {
    const salonRepo = new SalonRepository();

    // Estados
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [published, setPublished] = useState(false);
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(false);

    useEffect(() => {
        if (salon && visible) {
            setName(salon.name || '');
            setAddress(salon.address || '');
            setDescription(salon.description || '');
            setPublished(salon.published || false);
            setPhone(formatPhone(salon.phone || ''));
            setWhatsApp(formatPhone(salon.whatsApp || ''));
            setImageUri(salon.image || null);
            setGallery(salon.gallery || []);
            loadServices(salon.serviceIds);
        }
    }, [salon, visible]);

    // --- FORMATADORES (MÁSCARAS) ---
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
        const matchOld = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (matchOld) return `(${matchOld[1]}) ${matchOld[2]}-${matchOld[3]}`;
        return cleaned;
    };

    const handlePhoneChange = (text: string, type: 'phone' | 'whatsapp') => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        let formatted = cleaned;
        if (cleaned.length > 2 && cleaned.length <= 6) {
            formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length > 6) {
            formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }
        type === 'phone' ? setPhone(formatted) : setWhatsApp(formatted);
    };

    // --- CARGA DE DADOS ---
    const loadServices = async (ids: string[]) => {
        if (!ids || ids.length === 0) return setServices([]);
        try {
            setIsLoadingServices(true);
            const data = await salonRepo.getSalonServices(ids);
            setServices(data);
        } catch (e) { console.error(e); } finally { setIsLoadingServices(false); }
    };

    // --- VALIDAÇÃO E SALVAMENTO ---
    const validateFields = () => {
        if (!name.trim()) return "O nome do estabelecimento é obrigatório.";
        if (!address.trim()) return "O endereço é obrigatório.";
        if (phone.length < 14) return "Informe um telefone válido.";
        if (whatsApp.length < 14) return "Informe um WhatsApp válido.";
        if (!description.trim()) return "A descrição é obrigatória.";
        if (!imageUri) return "A foto de capa é obrigatória.";
        if (services.length === 0) return "Adicione pelo menos um serviço.";
        return null;
    };

    const handleSave = () => {
        const error = validateFields();
        if (error) return Alert.alert("Campos Pendentes", error);

        const updated: Salon = {
            ...salon!,
            name: name.trim(),
            address: address.trim(),
            description: description.trim(),
            published,
            phone: phone.replace(/\D/g, ''),
            whatsApp: whatsApp.replace(/\D/g, ''),
            image: imageUri as any,
            gallery,
            serviceIds: services.map(s => s.id),
        };

        onSave(updated);
        onClose();
    };

    // --- MÍDIA ---
    const pickCoverImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.5 });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>{salon ? 'Gerenciar Unidade' : 'Nova Unidade'}</Text>
                    <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* SEÇÃO MÍDIA */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mídia <Text style={{color: 'red'}}>*</Text></Text>
                        <TouchableOpacity style={[styles.coverContainer, !imageUri && {borderColor: COLORS.primary, borderWidth: 1, borderStyle: 'dashed'}]} onPress={pickCoverImage}>
                            {imageUri ? <Image source={{ uri: imageUri }} style={styles.fullImage} /> : (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="camera" size={40} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, fontSize: 12 }}>Adicionar Capa Obrigatória</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* DADOS GERAIS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados Gerais</Text>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Studio VIP" />

                        <Text style={styles.label}>Endereço</Text>
                        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, Número, Bairro" />

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>Telefone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={(t) => handlePhoneChange(t, 'phone')}
                                    keyboardType="phone-pad"
                                    placeholder="(00) 00000-0000"
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>WhatsApp</Text>
                                <TextInput
                                    style={styles.input}
                                    value={whatsApp}
                                    onChangeText={(t) => handlePhoneChange(t, 'whatsapp')}
                                    keyboardType="phone-pad"
                                    placeholder="(00) 00000-0000"
                                />
                            </View>
                        </View>

                        <Text style={styles.label}>Descrição / Bio</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            placeholder="Conte sobre sua experiência..."
                        />
                    </View>

                    {/* CONFIGURAÇÕES */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Operação</Text>
                        <TouchableOpacity
                            style={[styles.manageButton, services.length === 0 && {borderColor: '#FFCDD2', borderWidth: 1}]}
                            onPress={() => setServiceModalVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="content-cut" size={22} color={COLORS.primary} />
                                <Text style={[styles.manageButtonTitle, { marginLeft: 10 }]}>Serviços Ofertados</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isLoadingServices ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={{ color: services.length === 0 ? '#D32F2F' : '#AAA', fontWeight: 'bold' }}>{services.length || 'ADICIONAR'}</Text>}
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <ServiceEditModal
                visible={serviceModalVisible}
                services={services}
                onClose={() => setServiceModalVisible(false)}
                onSave={setServices}
            />
        </Modal>
    );
};