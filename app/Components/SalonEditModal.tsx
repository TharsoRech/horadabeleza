import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Salon } from "@/app/Models/Salon";
import { Service } from "@/app/Models/Service";
import { Professional } from "@/app/Models/Professional";
import { COLORS } from "@/constants/theme";
import { SalonEditModalStyles as styles } from "../Styles/SalonEditModalStyles";
import { ServiceEditModal } from "./ServiceEditModal";
import { ProfessionalEditModal } from "./ProfessionalEditModal";
import { SalonRepository } from "@/app/Repository/SalonRepository";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onSave: (updatedSalon: Salon) => void;
}

export const SalonEditModal = ({ visible, salon, onClose, onSave }: Props) => {
    const salonRepo = new SalonRepository();

    // Estados dos campos
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [published, setPublished] = useState(false);
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);

    // Estados de Listas
    const [services, setServices] = useState<Service[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);

    // Visibilidade de Modais
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [profModalVisible, setProfModalVisible] = useState(false);

    const [isLoadingData, setIsLoadingData] = useState(false);

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
            loadData(salon);
        }
    }, [salon, visible]);

    // --- FORMATADORES ---
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
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

    // --- CARGA DE DATA ---
    const loadData = async (targetSalon: Salon) => {
        try {
            setIsLoadingData(true);
            const [srvs, profs] = await Promise.all([
                salonRepo.getSalonServices(targetSalon.serviceIds || []),
                salonRepo.getSalonProfessionals(targetSalon.professionalIds || [])
            ]);
            setServices(srvs);
            setProfessionals(profs);
        } catch (e) {
            console.error("Erro ao carregar dados:", e);
        } finally {
            setIsLoadingData(false);
        }
    };

    // --- MÍDIA ---
    const pickCoverImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    // --- SALVAMENTO ---
    const handleSave = () => {
        if (!name.trim()) return Alert.alert("Erro", "O nome é obrigatório.");

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
            professionalIds: professionals.map(p => p.id)
        };

        onSave(updated);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>{salon ? 'Gerenciar Unidade' : 'Nova Unidade'}</Text>
                    <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* SEÇÃO MÍDIA */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mídia <Text style={{color: 'red'}}>*</Text></Text>
                        <TouchableOpacity
                            style={[styles.coverContainer, !imageUri && {borderColor: COLORS.primary, borderWidth: 1, borderStyle: 'dashed'}]}
                            onPress={pickCoverImage}
                        >
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

                    {/* CONFIGURAÇÕES DE OPERAÇÃO */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Operação</Text>

                        {/* BOTÃO SERVIÇOS */}
                        <TouchableOpacity
                            style={[styles.manageButton, services.length === 0 && {borderColor: '#FFCDD2', borderWidth: 1}]}
                            onPress={() => setServiceModalVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="content-cut" size={22} color={COLORS.primary} />
                                <Text style={[styles.manageButtonTitle, { marginLeft: 10 }]}>Serviços Ofertados</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isLoadingData ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={{ color: services.length === 0 ? '#D32F2F' : '#AAA', fontWeight: 'bold' }}>{services.length || 'ADICIONAR'}</Text>}
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </View>
                        </TouchableOpacity>

                        {/* BOTÃO PROFISSIONAIS (NOVO) */}
                        <TouchableOpacity
                            style={[styles.manageButton, { marginTop: 12 }]}
                            onPress={() => setProfModalVisible(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="people-outline" size={22} color={COLORS.primary} />
                                <Text style={[styles.manageButtonTitle, { marginLeft: 10 }]}>Equipe de Profissionais</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isLoadingData ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={{ color: '#AAA', fontWeight: 'bold' }}>{professionals.length || '0'}</Text>}
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAIS SECUNDÁRIOS */}
            <ServiceEditModal
                visible={serviceModalVisible}
                services={services}
                onClose={() => setServiceModalVisible(false)}
                onSave={setServices}
            />

            <ProfessionalEditModal
                visible={profModalVisible}
                professionals={professionals}
                onClose={() => setProfModalVisible(false)}
                onSave={setProfessionals}
            />
        </Modal>
    );
};