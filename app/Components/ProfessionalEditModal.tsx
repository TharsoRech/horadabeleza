import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TouchableOpacity, ScrollView,
    TextInput, Alert, Image, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Professional } from "@/app/Models/Professional";
import { COLORS } from "@/constants/theme";
import { ProfessionalEditModalStyles as styles } from "../Styles/ProfessionalEditModalStyles";

interface Props {
    visible: boolean;
    professionals: Professional[];
    onClose: () => void;
    onSave: (updatedProfs: Professional[]) => void;
}

export const ProfessionalEditModal = ({ visible, professionals, onClose, onSave }: Props) => {
    const [localProfs, setLocalProfs] = useState<Professional[]>([]);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (visible) setLocalProfs(professionals || []);
    }, [visible, professionals]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const handleAdd = () => {
        if (!name.trim() || !specialty.trim() || !bio.trim()) {
            return Alert.alert("Campos Vazios", "Preencha Nome, Especialidade e Bio.");
        }

        const newProf: Professional = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            specialty: specialty.trim(),
            bio: bio.trim(),
            image: image || undefined, // Se não tiver imagem, fica undefined
            rating: 5.0,
            reviews: 0,
            serviceIds: [],
            availableTimes: ["09:00", "10:00", "14:00", "16:00"]
        };

        setLocalProfs([newProf, ...localProfs]);
        setName(''); setSpecialty(''); setBio(''); setImage(null);
        Keyboard.dismiss();
    };

    const handleRemove = (id: string) => {
        setLocalProfs(prev => prev.filter(p => p.id !== id));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Voltar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>Equipe da Unidade</Text>
                    <TouchableOpacity onPress={() => { onSave(localProfs); onClose(); }}>
                        <Text style={styles.saveText}>Concluir</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.addForm}>
                        <Text style={styles.sectionTitle}>Cadastrar Profissional</Text>

                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profImage} />
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="camera-outline" size={30} color={COLORS.primary} />
                                    <Text style={{ fontSize: 10, color: COLORS.primary }}>FOTO</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput style={styles.input} placeholder="Nome do Profissional" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="Especialidade (Ex: Barbeiro)" value={specialty} onChangeText={setSpecialty} />
                        <TextInput style={[styles.input, { height: 60 }]} placeholder="Bio/Experiência" value={bio} onChangeText={setBio} multiline />

                        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                            <Text style={styles.addButtonText}>ADICIONAR PROFISSIONAL</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Membros Atuais ({localProfs.length})</Text>

                    {localProfs.map(prof => (
                        <View key={prof.id} style={styles.profCard}>
                            {prof.image ? (
                                <Image source={{ uri: prof.image }} style={styles.thumb} />
                            ) : (
                                <View style={[styles.thumb, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Ionicons name="person" size={20} color="#AAA" />
                                </View>
                            )}
                            <View style={styles.info}>
                                <Text style={styles.name}>{prof.name}</Text>
                                <Text style={styles.specialty}>{prof.specialty}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemove(prof.id)}>
                                <Ionicons name="trash-outline" size={20} color="#FF5252" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};