import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, Image, StyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";
import { ServiceEditModalStyles as styles } from "../Styles/ServiceEditModalStyles";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onSave: (updatedSalon: Salon) => void;
    onManageServices: (salon: Salon) => void;
    onManageProfessionals: (salon: Salon) => void;
}

export const SalonEditModal = ({ visible, salon, onClose, onSave, onManageServices, onManageProfessionals }: Props) => {
    // Estados do formulário
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [published, setPublished] = useState(false);
    const [phone, setPhone] = useState('');
    const [whatsApp, setWhatsApp] = useState('');

    // Estados de Imagem
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);

    useEffect(() => {
        if (salon) {
            setName(salon.name || '');
            setAddress(salon.address || '');
            setDescription(salon.description || '');
            setPublished(salon.published || false);
            setPhone(salon.phone || '');
            setWhatsApp(salon.whatsApp || '');
            setImageUri(salon.image || null);
            setGallery(salon.gallery || []);
        } else {
            // Reset para novo
            setName(''); setAddress(''); setDescription(''); setPublished(false);
            setPhone(''); setWhatsApp(''); setImageUri(null); setGallery([]);
        }
    }, [salon, visible]);

    // Lógica de Image Picker (Igual ao seu ProfileScreen)
    const pickCoverImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const pickGalleryImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const newUris = result.assets.map(asset => asset.uri);
            setGallery(prev => [...prev, ...newUris]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!name.trim()) return Alert.alert("Erro", "O nome é obrigatório.");

        const updated: Salon = {
            ...salon!,
            id: salon?.id || Math.random().toString(36).substr(2, 9),
            name,
            address,
            description,
            published,
            phone,
            whatsApp,
            image: imageUri || undefined,
            gallery: gallery,
            rating: salon?.rating || "0.0",
            reviews: salon?.reviews || 0,
            serviceIds: salon?.serviceIds || [],
            professionalIds: salon?.professionalIds || [],
        };
        onSave(updated);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>{salon ? 'Gerenciar Unidade' : 'Novo Salão'}</Text>
                    <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
                </View>

                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* 1. SEÇÃO DE MÍDIA */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mídia</Text>

                        <Text style={styles.label}>Foto de Capa</Text>
                        <TouchableOpacity style={styles.coverContainer} onPress={pickCoverImage}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.fullImage} />
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="camera" size={40} color="#CCC" />
                                    <Text style={{ color: '#999', fontSize: 12 }}>Adicionar Capa</Text>
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <Ionicons name="pencil" size={14} color="white" />
                            </View>
                        </TouchableOpacity>

                        <Text style={[styles.label, { marginTop: 20 }]}>Galeria de Fotos ({gallery.length})</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                            <TouchableOpacity style={styles.addThumb} onPress={pickGalleryImage}>
                                <Ionicons name="add" size={30} color={COLORS.primary} />
                                <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: 'bold' }}>ANEXAR</Text>
                            </TouchableOpacity>

                            {gallery.map((img, index) => (
                                <View key={index} style={{ marginRight: 12, marginLeft: 4 }}>
                                    <Image source={{ uri: img }} style={styles.thumb} />
                                    <TouchableOpacity
                                        onPress={() => removeGalleryImage(index)}
                                        style={styles.removeBtn}
                                    >
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* 2. STATUS DE PUBLICAÇÃO */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setPublished(!published)}
                            style={[styles.publishCard, { backgroundColor: published ? '#F1F8E9' : '#FAFAFA', borderColor: published ? '#C5E1A5' : '#EEE' }]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: published ? '#33691E' : '#666' }}>
                                    Status: {published ? "Publicado" : "Privado"}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#888' }}>
                                    {published ? "Clientes podem ver no catálogo." : "Oculto para os clientes."}
                                </Text>
                            </View>
                            <View style={[styles.switchTrack, { backgroundColor: published ? COLORS.primary : '#CCC' }]}>
                                <View style={[styles.switchThumb, { alignSelf: published ? 'flex-end' : 'flex-start' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* 3. DADOS GERAIS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dados Gerais</Text>

                        <Text style={styles.label}>Nome do Estabelecimento</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Studio Glamour" />

                        <Text style={styles.label}>Endereço</Text>
                        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, Número, Bairro" />

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Telefone</Text>
                                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="(00) 0000-0000" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>WhatsApp</Text>
                                <TextInput style={styles.input} value={whatsApp} onChangeText={setWhatsApp} keyboardType="phone-pad" placeholder="(00) 90000-0000" />
                            </View>
                        </View>

                        <Text style={styles.label}>Descrição / Sobre</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            placeholder="Conte um pouco sobre seu negócio..."
                        />
                    </View>

                    {/* 4. CONFIGURAÇÕES (Hub) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Operação</Text>
                        <TouchableOpacity style={styles.manageButton} onPress={() => salon && onManageServices(salon)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="content-cut" size={22} color={COLORS.primary} />
                                <Text style={[styles.manageButtonTitle, { marginLeft: 10 }]}>Serviços Ofertados</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#AAA', fontSize: 13, marginRight: 5 }}>{salon?.serviceIds.length || 0}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.manageButton, { marginTop: 12 }]} onPress={() => salon && onManageProfessionals(salon)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="people" size={22} color={COLORS.primary} />
                                <Text style={[styles.manageButtonTitle, { marginLeft: 10 }]}>Profissionais</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#AAA', fontSize: 13, marginRight: 5 }}>{salon?.professionalIds.length || 0}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};