import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator, Switch
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Salon } from "@/app/Models/Salon";
import { Service } from "@/app/Models/Service";
import { Professional } from "@/app/Models/Professional";
import { Subscription } from "@/app/Models/Subscription";
import { COLORS } from "@/constants/theme";
import { SalonEditModalStyles as styles } from "../Styles/SalonEditModalStyles";
import { ServiceEditModal } from "./ServiceEditModal";
import { ProfessionalEditModal } from "./ProfessionalEditModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { SalonRepository } from "@/app/Repository/SalonRepository";
import { SubscriptionRepository } from "@/app/Repository/SubscriptionRepository";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onSave: (updatedSalon: Salon) => void;
}

export const SalonEditModal = ({ visible, salon, onClose, onSave }: Props) => {
    const salonRepo = new SalonRepository();
    const subRepo = new SubscriptionRepository();

    // --- FORM STATES ---
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [published, setPublished] = useState(false);
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);

    // --- DATA STATES ---
    const [services, setServices] = useState<Service[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    // --- UI STATES ---
    const [subModalVisible, setSubModalVisible] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [profModalVisible, setProfModalVisible] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (visible) {
            initialLoad();
        }
    }, [visible]);

    const initialLoad = async () => {
        setIsLoadingData(true);
        const sub = await subRepo.getSubscription();
        setSubscription(sub);

        if (salon) {
            setName(salon.name || '');
            setAddress(salon.address || '');
            setDescription(salon.description || '');
            setPhone(formatPhone(salon.phone || ''));
            setWhatsApp(formatPhone(salon.whatsApp || ''));
            setImageUri(salon.image || null);
            setGallery(salon.gallery || []);

            // Só mantém publicado se a assinatura permitir
            setPublished(canPublish(sub) ? (salon.published || false) : false);
            loadDetails(salon);
        } else {
            resetForm();
        }
        setIsLoadingData(false);
    };

    const canPublish = (sub: Subscription | null): boolean => {
        if (!sub) return false;
        if (sub.isActive) return true;
        if (!sub.trialStartDate) return false;

        const diff = new Date().getTime() - new Date(sub.trialStartDate).getTime();
        const days = Math.floor(diff / (1000 * 3600 * 24));
        return days < 30;
    };

    const handleTogglePublished = (value: boolean) => {
        if (value === true && !canPublish(subscription)) {
            setSubModalVisible(true);
            return;
        }
        setPublished(value);
    };

    const handleSubscriptionSuccess = (newSub: Subscription) => {
        setSubscription(newSub);
        setPublished(true); // Habilita na hora o catálogo
        Alert.alert("Assinatura Ativa", "Sua unidade agora está visível no catálogo!");
    };

    const resetForm = () => {
        setName(''); setAddress(''); setDescription(''); setPublished(false);
        setPhone(''); setWhatsApp(''); setImageUri(null); setGallery([]);
    };

    const formatPhone = (v: string) => {
        const c = v.replace(/\D/g, '');
        const m = c.match(/^(\d{2})(\d{5})(\d{4})$/);
        return m ? `(${m[1]}) ${m[2]}-${m[3]}` : c;
    };

    const handlePhoneChange = (text: string, type: 'phone' | 'whatsapp') => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        let formatted = cleaned;
        if (cleaned.length > 2 && cleaned.length <= 6) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        else if (cleaned.length > 6) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        type === 'phone' ? setPhone(formatted) : setWhatsApp(formatted);
    };

    const loadDetails = async (target: Salon) => {
        try {
            const [s, p] = await Promise.all([
                salonRepo.getSalonServices(target.serviceIds || []),
                salonRepo.getSalonProfessionals(target.professionalIds || [])
            ]);
            setServices(s); setProfessionals(p);
        } catch (e) { console.error(e); }
    };

    const handleSave = () => {
        if (!imageUri || !name.trim() || phone.length < 14) return Alert.alert("Campos Obrigatórios", "Capa, Nome e Telefone são obrigatórios.");

        onSave({
            ...salon,
            id: salon?.id || Math.random().toString(36).substr(2, 9),
            name: name.trim(), address: address.trim(), description: description.trim(),
            published, phone: phone.replace(/\D/g, ''), whatsApp: whatsApp.replace(/\D/g, ''),
            image: imageUri as any, gallery,
            serviceIds: services.map(s => s.id), professionalIds: professionals.map(p => p.id),
            rating: salon?.rating || "0", reviews: salon?.reviews || 0,
            userHasVisited: salon?.userHasVisited ?? false, isAdmin: salon?.isAdmin ?? false,
        });
        onClose();
    };

    const isSubActive = canPublish(subscription);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>{salon ? 'Gerenciar Unidade' : 'Nova Unidade'}</Text>
                    <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
                </View>

                {isLoadingData ? (
                    <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color={COLORS.primary} /></View>
                ) : (
                    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

                        {/* SEÇÃO DE PUBLICAÇÃO COM STATUS DE ASSINATURA */}
                        <View style={[styles.section, { backgroundColor: isSubActive ? '#FFF' : '#FFF9E6', borderWidth: isSubActive ? 0 : 1, borderColor: '#FFE58F' }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionTitle}>Status de Publicação</Text>
                                    <Text style={{ color: isSubActive ? (published ? '#4CAF50' : '#999') : '#D48806', fontSize: 12 }}>
                                        {isSubActive
                                            ? (published ? "Aparecendo para clientes" : "Oculto para clientes")
                                            : "🔒 Assinatura necessária para publicar"}
                                    </Text>
                                </View>
                                <Switch
                                    value={published}
                                    onValueChange={handleTogglePublished}
                                    trackColor={{ false: "#767577", true: COLORS.primary + '80' }}
                                    thumbColor={published ? COLORS.primary : "#f4f3f4"}
                                />
                            </View>
                            {!isSubActive && (
                                <TouchableOpacity onPress={() => setSubModalVisible(true)} style={{ marginTop: 10 }}>
                                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Escolher um plano para habilitar →</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* FOTO DE CAPA */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Foto de Capa *</Text>
                            <TouchableOpacity style={styles.coverContainer} onPress={async () => {
                                let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.5 });
                                if (!res.canceled) setImageUri(res.assets[0].uri);
                            }}>
                                {imageUri ? <Image source={{ uri: imageUri }} style={styles.fullImage} /> : (
                                    <View style={{ alignItems: 'center' }}><Ionicons name="camera" size={40} color={COLORS.primary} /><Text style={{ color: COLORS.primary }}>Selecionar Imagem</Text></View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* GALERIA */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Galeria de Fotos</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity style={styles.addGalleryButton} onPress={async () => {
                                    let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 0.5 });
                                    if (!res.canceled) setGallery([...gallery, ...res.assets.map(a => a.uri)]);
                                }}>
                                    <Ionicons name="add" size={30} color={COLORS.primary} />
                                </TouchableOpacity>
                                {gallery.map((uri, index) => (
                                    <View key={index} style={styles.galleryImageContainer}>
                                        <Image source={{ uri }} style={styles.galleryImage} />
                                        <TouchableOpacity style={styles.removeGalleryImage} onPress={() => {
                                            const up = [...gallery]; up.splice(index, 1); setGallery(up);
                                        }}>
                                            <Ionicons name="close-circle" size={20} color="#FF5252" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* DADOS GERAIS */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Nome da Unidade *</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do seu salão" />

                            <Text style={styles.label}>Descrição Detalhada</Text>
                            <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} multiline value={description} onChangeText={setDescription} placeholder="Conte sobre seu espaço..." />

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Telefone de Contato *</Text>
                                    <TextInput style={styles.input} value={phone} keyboardType="phone-pad" onChangeText={t => handlePhoneChange(t, 'phone')} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>WhatsApp Business</Text>
                                    <TextInput style={styles.input} value={whatsApp} keyboardType="phone-pad" onChangeText={t => handlePhoneChange(t, 'whatsapp')} />
                                </View>
                            </View>

                            <Text style={styles.label}>Endereço Completo</Text>
                            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, Número, Bairro, Cidade" />
                        </View>

                        {/* OPERAÇÃO */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Gerenciamento</Text>
                            <TouchableOpacity style={styles.manageButton} onPress={() => setServiceModalVisible(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="content-cut" size={20} color={COLORS.primary} />
                                    <Text style={{marginLeft: 10}}>Serviços ({services.length})</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.manageButton, {marginTop: 12}]} onPress={() => setProfModalVisible(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                                    <Text style={{marginLeft: 10}}>Profissionais ({professionals.length})</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                )}
            </KeyboardAvoidingView>

            <SubscriptionModal
                visible={subModalVisible}
                onClose={() => setSubModalVisible(false)}
                isTrialEligible={!subscription?.trialStartDate}
                onSubscriptionSuccess={handleSubscriptionSuccess}
            />

            <ServiceEditModal visible={serviceModalVisible} services={services} onClose={() => setServiceModalVisible(false)} onSave={setServices} />
            <ProfessionalEditModal visible={profModalVisible} professionals={professionals} allServices={services} onClose={() => setProfModalVisible(false)} onSave={setProfessionals} />
        </Modal>
    );
};