import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const professionalCardStyles = StyleSheet.create({
    card: {
        width: 110,
        alignItems: 'center',
        marginRight: 16,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    image: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    placeholder: {
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
        color: COLORS.textMain,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    specialty: {
        fontSize: 12,
        color: COLORS.muted,
        textAlign: 'center',
    }
});