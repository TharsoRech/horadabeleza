import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TouchableOpacity, ScrollView,
    TextInput, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Professional } from "@/app/Models/Professional";
import { Service } from "@/app/Models/Service";
import { COLORS } from "@/constants/theme";
import { ProfessionalEditModalStyles as styles } from "../Styles/ProfessionalEditModalStyles";

interface Props {
    visible: boolean;
    professionals: Professional[];
    allServices: Service[];
    onClose: () => void;
    onSave: (updatedProfs: Professional[]) => void;
}

const DAYS_OF_WEEK = [
    { id: '0', label: 'Dom' }, { id: '1', label: 'Seg' }, { id: '2', label: 'Ter' },
    { id: '3', label: 'Qua' }, { id: '4', label: 'Qui' }, { id: '5', label: 'Sex' }, { id: '6', label: 'Sáb' }
];

const TIME_OPTIONS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

export const ProfessionalEditModal = ({ visible, professionals, allServices, onClose, onSave }: Props) => {
    const [localProfs, setLocalProfs] = useState<Professional[]>([]);

    // Estados para o Modal de Ajuste (Cópia de trabalho)
    const [tempProf, setTempProf] = useState<Professional | null>(null);
    const [selectedDay, setSelectedDay] = useState('1'); // Segunda por padrão

    // Estados Novo Profissional
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (visible) setLocalProfs(professionals || []);
    }, [visible, professionals]);

    const handleAddProf = () => {
        if (!name.trim() || !specialty.trim() || !bio.trim()) {
            return Alert.alert("Campos Incompletos", "Nome, Cargo e Bio são essenciais.");
        }

        const newProf: Professional = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            specialty: specialty.trim(),
            bio: bio.trim(),
            image: image || '',
            rating: 5.0,
            reviews: 0,
            serviceIds: [],
            // Estrutura: { '1': ['09:00'], '2': ['10:00'] }
            schedule: {}
        } as any;

        setLocalProfs([newProf, ...localProfs]);
        setName(''); setSpecialty(''); setBio(''); setImage(null);
    };

    const toggleService = (serviceId: string) => {
        if (!tempProf) return;
        const currentIds = [...tempProf.serviceIds];
        const index = currentIds.indexOf(serviceId);
        index > -1 ? currentIds.splice(index, 1) : currentIds.push(serviceId);
        setTempProf({ ...tempProf, serviceIds: currentIds });
    };

    const toggleTime = (time: string) => {
        if (!tempProf) return;
        const currentSchedule = { ...(tempProf as any).schedule || {} };
        const dayTimes = [...(currentSchedule[selectedDay] || [])];

        const index = dayTimes.indexOf(time);
        index > -1 ? dayTimes.splice(index, 1) : dayTimes.push(time);

        currentSchedule[selectedDay] = dayTimes;
        setTempProf({ ...tempProf, schedule: currentSchedule } as any);
    };

    const saveChanges = () => {
        if (tempProf) {
            setLocalProfs(prev => prev.map(p => p.id === tempProf.id ? tempProf : p));
            setTempProf(null);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* HEADER PRINCIPAL */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>Equipe</Text>
                    <TouchableOpacity onPress={() => { onSave(localProfs); onClose(); }}>
                        <Text style={styles.saveText}>Concluir</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* FORMULÁRIO DE CADASTRO */}
                    <View style={styles.addForm}>
                        <TextInput style={styles.input} placeholder="Nome do Profissional" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="Especialidade / Cargo" value={specialty} onChangeText={setSpecialty} />
                        <TextInput
                            style={[styles.input, { height: 60 }]}
                            placeholder="Bio Profissional (Experiência e Cursos)"
                            multiline value={bio} onChangeText={setBio}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddProf}>
                            <Text style={styles.addButtonText}>ADICIONAR À EQUIPE</Text>
                        </TouchableOpacity>
                    </View>

                    {localProfs.map(prof => (
                        <TouchableOpacity key={prof.id} style={styles.profCard} onPress={() => setTempProf({...prof})}>
                            <View style={styles.info}>
                                <Text style={styles.name}>{prof.name}</Text>
                                <Text style={styles.details}>{prof.specialty} • {prof.serviceIds.length -1} serviços</Text>
                            </View>
                            <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* MODAL DE AJUSTE (CARD CENTRAL) */}
                {tempProf && (
                    <Modal visible={!!tempProf} transparent animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.adjustmentCard}>
                                <Text style={styles.cardTitle}>Configurar {tempProf.name}</Text>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* SERVIÇOS */}
                                    <Text style={styles.subLabel}>Serviços que realiza:</Text>
                                    <View style={styles.servicesGrid}>
                                        {allServices.flatMap(c => c.subServices).map(sub => (
                                            <TouchableOpacity
                                                key={sub.id}
                                                style={[styles.serviceChip, tempProf.serviceIds.includes(sub.id) && styles.activeChip]}
                                                onPress={() => toggleService(sub.id)}
                                            >
                                                <Text style={[styles.chipText, tempProf.serviceIds.includes(sub.id) && styles.activeChipText]}>{sub.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* AGENDA POR DIA */}
                                    <Text style={[styles.subLabel, { marginTop: 20 }]}>Agenda Semanal:</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
                                        {DAYS_OF_WEEK.map(day => (
                                            <TouchableOpacity
                                                key={day.id}
                                                style={[styles.dayButton, selectedDay === day.id && styles.activeDay]}
                                                onPress={() => setSelectedDay(day.id)}
                                            >
                                                <Text style={[styles.dayText, selectedDay === day.id && styles.activeDayText]}>{day.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <View style={styles.timeGrid}>
                                        {TIME_OPTIONS.map(time => {
                                            const isSelected = ((tempProf as any).schedule?.[selectedDay] || []).includes(time);
                                            return (
                                                <TouchableOpacity
                                                    key={time}
                                                    onPress={() => toggleTime(time)}
                                                    style={[styles.timeSlot, isSelected && styles.activeTime]}
                                                >
                                                    <Text style={[styles.timeSlotText, isSelected && styles.activeTimeText]}>{time}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </ScrollView>

                                {/* RODAPÉ DO CARD */}
                                <View style={styles.cardFooter}>
                                    <TouchableOpacity style={styles.btnCancel} onPress={() => setTempProf(null)}>
                                        <Text style={styles.txtCancel}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnSave} onPress={saveChanges}>
                                        <Text style={styles.txtSave}>Salvar Alterações</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </Modal>
    );
};