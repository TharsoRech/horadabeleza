import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Logic & Models
import { Service } from "@/app/Models/Service";
import { COLORS } from "@/constants/theme";

// Styles
import { myServicesStyles as styles } from "../Styles/myServicesStyles";

interface RenderServiceItemProps {
    item: Service;
    onPress: (service: Service) => void;
}

export const RenderServiceItem = ({ item, onPress }: RenderServiceItemProps) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onPress(item)}
        >
            {/* ÍCONE CONDICIONAL: Só renderiza se existir e não for vazio */}
            {item.icon && item.icon.trim() !== "" && (
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                </View>
            )}

            <View style={styles.infoContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <Text style={[styles.serviceName, { flex: 1 }]}>{item.name}</Text>

                    {/* BADGE DE PUBLICAÇÃO */}
                    <View style={[
                        styles.statusBadge,
                        item.published ? styles.publishedBadge : styles.draftBadge
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: item.published ? '#2E7D32' : '#EF6C00' }
                        ]}>
                            {item.published ? 'Ativo' : 'Rascunho'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.serviceDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.footerRow}>
                    <MaterialCommunityIcons name="layers-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.subServicesCount}>
                        {item.subServices.length} sub-serviços
                    </Text>
                </View>
            </View>

            {/* ÍCONE DE OPÇÕES (MAIS INTUITIVO PARA EDIÇÃO) */}
            <View style={{ paddingLeft: 10 }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#BBB" />
            </View>
        </TouchableOpacity>
    );
};