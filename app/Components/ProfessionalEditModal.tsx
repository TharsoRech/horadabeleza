import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TouchableOpacity, ScrollView,
    TextInput, Alert, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

    const [tempProf, setTempProf] = useState<Professional | null>(null);
    const [selectedDay, setSelectedDay] = useState('1');

    // Estados Novo Profissional
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // NOVO: Estado Admin
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (visible) setLocalProfs(professionals || []);
    }, [visible, professionals]);

    const formatCPF = (text: string) => {
        const numeric = text.replace(/\D/g, "");
        return numeric
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .substring(0, 14);
    };

    const handleAddProf = () => {
        if (!name.trim() || !specialty.trim() || !bio.trim() || !cpf.trim()) {
            return Alert.alert("Campos Incompletos", "Preencha todos os campos obrigatórios.");
        }

        const newProf: Professional = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            cpf: cpf.trim(),
            specialty: specialty.trim(),
            bio: bio.trim(),
            isAdmin: isAdmin, // Adicionado
            image: image || '',
            rating: 5.0,
            reviews: 0,
            serviceIds: [],
            schedule: {}
        } as any;

        setLocalProfs([newProf, ...localProfs]);
        // Limpar campos
        setName(''); setCpf(''); setSpecialty(''); setBio(''); setIsAdmin(false);
    };

    // FUNÇÃO PARA REMOVER
    const handleRemoveProf = (id: string) => {
        Alert.alert(
            "Remover Profissional",
            "Tem certeza que deseja remover este membro da equipe?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => setLocalProfs(prev => prev.filter(p => p.id !== id))
                }
            ]
        );
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                    <Text style={styles.headerTitle}>Equipe</Text>
                    <TouchableOpacity onPress={() => { onSave(localProfs); onClose(); }}>
                        <Text style={styles.saveText}>Concluir</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View style={styles.addForm}>
                        <Text style={styles.sectionLabel}>Novo Profissional</Text>

                        <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={(t) => setCpf(formatCPF(t))} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Cargo/Especialidade" value={specialty} onChangeText={setSpecialty} />
                        <TextInput style={[styles.input, { height: 60 }]} placeholder="Bio" multiline value={bio} onChangeText={setBio} />

                        {/* TOGGLE ADMIN NO CADASTRO */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 }}>
                            <Text style={{ color: COLORS.textMain }}>Permissão de Administrador</Text>
                            <Switch
                                value={isAdmin}
                                onValueChange={setIsAdmin}
                                trackColor={{ false: "#DDD", true: COLORS.primary + '80' }}
                                thumbColor={isAdmin ? COLORS.primary : "#f4f3f4"}
                            />
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddProf}>
                            <Text style={styles.addButtonText}>ADICIONAR À EQUIPE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listSection}>
                        <Text style={styles.sectionLabel}>Profissionais Cadastrados</Text>
                        {localProfs.map(prof => (
                            <View key={prof.id} style={styles.profCard}>
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => setTempProf({...prof})}>
                                    <View style={styles.info}>
                                        <Text style={styles.name}>{prof.name} {prof.isAdmin && <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />}</Text>
                                        <Text style={styles.details}>{prof.specialty} • {prof.cpf || 'Sem CPF'}</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                    <TouchableOpacity onPress={() => setTempProf({...prof})}>
                                        <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemoveProf(prof.id)}>
                                        <Ionicons name="trash-outline" size={22} color="#FF5252" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* MODAL DE AJUSTE */}
                {tempProf && (
                    <Modal visible={!!tempProf} transparent animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.adjustmentCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>Configurar {tempProf.name}</Text>
                                    <TouchableOpacity onPress={() => setTempProf(null)}><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* MUDAR STATUS ADMIN NA EDIÇÃO */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: 10, backgroundColor: '#F9F9F9', borderRadius: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Administrador da Unidade</Text>
                                        <Switch
                                            value={tempProf.isAdmin}
                                            onValueChange={(val) => setTempProf({...tempProf, isAdmin: val})}
                                        />
                                    </View>

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

                                    {/* AGENDA... (Resto do código mantido igual) */}
                                    <Text style={[styles.subLabel, { marginTop: 20 }]}>Agenda Semanal:</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
                                        {DAYS_OF_WEEK.map(day => (
                                            <TouchableOpacity key={day.id} style={[styles.dayButton, selectedDay === day.id && styles.activeDay]} onPress={() => setSelectedDay(day.id)}>
                                                <Text style={[styles.dayText, selectedDay === day.id && styles.activeDayText]}>{day.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <View style={styles.timeGrid}>
                                        {TIME_OPTIONS.map(time => {
                                            const isSelected = ((tempProf as any).schedule?.[selectedDay] || []).includes(time);
                                            return (
                                                <TouchableOpacity key={time} onPress={() => toggleTime(time)} style={[styles.timeSlot, isSelected && styles.activeTime]}>
                                                    <Text style={[styles.timeSlotText, isSelected && styles.activeTimeText]}>{time}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </ScrollView>

                                <View style={styles.cardFooter}>
                                    <TouchableOpacity style={styles.btnCancel} onPress={() => setTempProf(null)}><Text style={styles.txtCancel}>Cancelar</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.btnSave} onPress={saveChanges}><Text style={styles.txtSave}>Salvar Alterações</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </Modal>
    );
};