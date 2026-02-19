import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const searchSalonCardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        // Sombra
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#F5F5F5',
    },
    placeholder: {
        width: 100,
        height: 100,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    address: {
        fontSize: 13,
        color: COLORS.muted,
        marginVertical: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMain,
        marginLeft: 4,
    }
});