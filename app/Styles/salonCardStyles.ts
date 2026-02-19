import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const salonCardStyles = StyleSheet.create({
    salonCard: {
        width: 250,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginRight: 16,
        // Sombra para iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
        overflow: 'hidden', // Garante que a imagem respeite o border radius do card
    },
    salonImagePlaceholder: {
        width: '100%',
        height: 130,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    salonInfo: {
        padding: 12,
    },
    salonName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    salonAddress: {
        fontSize: 13,
        color: COLORS.muted,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: COLORS.textMain,
        marginLeft: 5,
        fontWeight: '500',
    },
});