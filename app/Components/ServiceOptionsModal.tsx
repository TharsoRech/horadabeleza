import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from "@/app/Models/Salon";
import { COLORS } from "@/constants/theme";
import { ServiceOptionsModalStyles as styles } from "../Styles/ServiceOptionsModalStyles";

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    onEdit: (salon: Salon) => void;
    onDelete: (salon: Salon) => void;
}

export const ServiceOptionsModal = ({ visible, salon, onClose, onEdit, onDelete }: Props) => {
    if (!salon) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.content}>
                    <View style={styles.indicator} />

                    <Text style={styles.title}>Gerenciar Unidade</Text>
                    <Text style={styles.subtitle}>{salon.name}</Text>

                    <View style={styles.optionsContainer}>
                        {/* EDITAR PERFIL */}
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => { onEdit(salon); onClose(); }}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="business-outline" size={22} color="#1976D2" />
                            </View>
                            <Text style={styles.optionText}>Editar Unidade</Text>
                        </TouchableOpacity>

                        {/* EXCLUIR */}
                        <TouchableOpacity
                            style={[styles.option, { borderBottomWidth: 0 }]}
                            onPress={() => { onDelete(salon); onClose(); }}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                <Ionicons name="trash-outline" size={22} color="#D32F2F" />
                            </View>
                            <Text style={[styles.optionText, { color: "#D32F2F" }]}>Remover Unidades</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};