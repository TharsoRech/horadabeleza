import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get('window');

export const ServiceOptionsModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fundo escurecido suave
        justifyContent: 'flex-end', // Alinha o conteúdo no rodapé
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 34, // Espaço extra para iPhones com notch
        width: '100%',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSub,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textMain,
        flex: 1,
    },
    closeButton: {
        backgroundColor: '#F5F5F7',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666',
    },
});