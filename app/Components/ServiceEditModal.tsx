import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TouchableOpacity, ScrollView,
    TextInput, Alert, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service, SubService } from "@/app/Models/Service";
import { COLORS } from "@/constants/theme";
import { ServiceEditModalStyles as styles } from "../Styles/ServiceEditModalStyles";

interface Props {
    visible: boolean;
    services: Service[];
    onClose: () => void;
    onSave: (updatedServices: Service[]) => void;
}

export const ServiceEditModal = ({ visible, services, onClose, onSave }: Props) => {
    const [localServices] = useState<Service[]>([]); // Mantendo consistência
    const [displayServices, setDisplayServices] = useState<Service[]>([]);

    const iconOptions = ['cut-outline', 'brush-outline', 'color-palette-outline', 'leaf-outline', 'sparkles-outline', 'eye-outline', 'water-outline'];

    // Estados para a Categoria (Pai)
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('cut-outline');

    // Estados para Itens (Filhos)
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [subName, setSubName] = useState('');
    const [subPrice, setSubPrice] = useState('');
    const [subDuration, setSubDuration] = useState('');

    useEffect(() => {
        if (visible) setDisplayServices(services || []);
    }, [visible, services]);

    const formatPrice = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned) return '';
        return (parseFloat(cleaned) / 100).toFixed(2).replace('.', ',');
    };

    // --- CATEGORIA PAI ---
    const handleAddCategory = () => {
        if (!newName.trim() || !newDesc.trim()) {
            return Alert.alert("Campos Vazios", "Dê um nome e uma breve descrição para a categoria.");
        }

        const newCategory: Service = {
            id: Math.random().toString(36).substr(2, 9),
            name: newName.trim(),
            icon: selectedIcon,
            description: newDesc.trim(),
            subServices: [] // Começa vazia para o usuário preencher
        };

        setDisplayServices([newCategory, ...displayServices]);
        setNewName(''); setNewDesc('');
        Keyboard.dismiss();
    };

    const handleRemoveCategory = (id: string) => {
        setDisplayServices(prev => prev.filter(s => s.id !== id));
    };

    // --- SUB-SERVIÇOS ---
    const handleAddSubItem = () => {
        if (!subName.trim() || !subPrice || !subDuration.trim()) {
            return Alert.alert("Atenção", "O item precisa de nome, preço e tempo estimados.");
        }

        const newSub: SubService = {
            id: Math.random().toString(36).substr(2, 9),
            name: subName.trim(),
            price: parseFloat(subPrice.replace(',', '.')),
            duration: subDuration.includes('min') ? subDuration : `${subDuration} min`,
            description: ''
        };

        const updated = { ...editingService! };
        updated.subServices = [...updated.subServices, newSub];
        setEditingService(updated);
        setDisplayServices(prev => prev.map(s => s.id === updated.id ? updated : s));

        setSubName(''); setSubPrice(''); setSubDuration('');
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>Categorias de Serviço</Text>
                    <TouchableOpacity onPress={() => { onSave(displayServices); onClose(); }}><Text style={styles.saveText}>Concluir</Text></TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* FORMULÁRIO CATEGORIA */}
                    <View style={styles.addForm}>
                        <Text style={styles.sectionTitle}>Criar Nova Categoria</Text>

                        <Text style={styles.label}>Ícone Representativo:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                            {iconOptions.map(icon => (
                                <TouchableOpacity
                                    key={icon}
                                    onPress={() => setSelectedIcon(icon)}
                                    style={{
                                        padding: 12, borderRadius: 12, marginRight: 10,
                                        backgroundColor: selectedIcon === icon ? COLORS.primary : '#F5F5F5',
                                        borderWidth: 1, borderColor: selectedIcon === icon ? COLORS.primary : '#EEE'
                                    }}
                                >
                                    <Ionicons name={icon as any} size={24} color={selectedIcon === icon ? 'white' : '#666'} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TextInput style={styles.input} placeholder="Ex: Estética Facial, Massoterapia..." value={newName} onChangeText={setNewName} />
                        <TextInput style={[styles.input, { height: 60 }]} placeholder="Descrição da categoria" value={newDesc} onChangeText={setNewDesc} multiline />

                        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                            <Text style={styles.addButtonText}>CRIAR CATEGORIA</Text>
                        </TouchableOpacity>
                    </View>

                    {/* LISTA DE CATEGORIAS */}
                    <Text style={styles.sectionTitle}>Suas Categorias ({displayServices.length})</Text>

                    {displayServices.map((service) => (
                        <TouchableOpacity key={service.id} style={styles.serviceCard} onPress={() => setEditingService(service)} activeOpacity={0.7}>
                            <View style={styles.iconCircle}>
                                <Ionicons name={(service.icon as any)} size={22} color={COLORS.primary} />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.name}>{service.name}</Text>
                                <Text style={styles.desc} numberOfLines={1}>{service.description}</Text>
                                <View style={styles.priceTag}>
                                    <Ionicons name="layers-outline" size={14} color={COLORS.primary} />
                                    <Text style={[styles.duration, { marginLeft: 5, color: COLORS.primary, fontWeight: 'bold' }]}>
                                        {service.subServices.length} itens cadastrados
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemoveCategory(service.id)}>
                                <Ionicons name="trash-outline" size={18} color="#FF5252" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* MODAL DE ITENS DA CATEGORIA */}
                {editingService && (
                    <Modal visible={!!editingService} animationType="fade" transparent>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                            <View style={{ backgroundColor: 'white', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Itens de {editingService.name}</Text>
                                    <TouchableOpacity onPress={() => setEditingService(null)}>
                                        <Ionicons name="close-circle" size={30} color="#DDD" />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ backgroundColor: '#F9F9F9', padding: 15, borderRadius: 15, marginBottom: 20 }}>
                                    <TextInput style={styles.input} placeholder="Nome do item (Ex: Limpeza de Pele)" value={subName} onChangeText={setSubName} />
                                    <View style={styles.row}>
                                        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Preço (R$)" keyboardType="numeric" value={subPrice} onChangeText={(t) => setSubPrice(formatPrice(t))} />
                                        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Minutos" keyboardType="numeric" value={subDuration} onChangeText={setSubDuration} />
                                    </View>
                                    <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.primary, marginTop: 5 }]} onPress={handleAddSubItem}>
                                        <Text style={styles.addButtonText}>ADICIONAR ITEM À CATEGORIA</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView>
                                    {editingService.subServices.map(sub => (
                                        <View key={sub.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                                            <View>
                                                <Text style={{ fontWeight: '600', fontSize: 15 }}>{sub.name}</Text>
                                                <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginTop: 2 }}>
                                                    R$ {sub.price.toFixed(2).replace('.', ',')} <Text style={{ color: '#999', fontWeight: 'normal' }}>• {sub.duration}</Text>
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                const updated = { ...editingService };
                                                updated.subServices = updated.subServices.filter(s => s.id !== sub.id);
                                                setEditingService(updated);
                                                setDisplayServices(prev => prev.map(s => s.id === updated.id ? updated : s));
                                            }}>
                                                <Ionicons name="trash-outline" size={20} color="#FFCDD2" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </Modal>
    );
};