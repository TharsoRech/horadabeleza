import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const searchProfessionalCardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16, // Um pouco mais arredondado para um ar moderno
        marginBottom: 12,
        // Sombra para iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    info: {
        flex: 1,
        marginLeft: 16
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain
    },
    specialty: {
        fontSize: 14,
        color: COLORS.muted,
        marginVertical: 2
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },
    ratingText: {
        fontSize: 12,
        color: COLORS.textMain,
        marginLeft: 4,
        fontWeight: '500'
    }
});