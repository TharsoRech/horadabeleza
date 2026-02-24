import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center', // Centraliza a imagem horizontalmente
        marginTop: 40,
    },
    illustrationPlaceholder: {
        width: width * 0.85,
        height: width * 0.75,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textSection: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 30,
        gap: 12,
    },
    signUpBtn: {
        backgroundColor: '#D63484',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    signUpText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logInBtn: {
        backgroundColor: 'transparent',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    logInText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    guestBtn: {
        marginTop: 8,
        alignItems: 'center',
    },
    guestText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    // --- RESTORED IMAGE PICKER PROPERTIES ---
    imagePickerContainer: {
        alignSelf: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'white',
    },
    placeholderCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    // --- RESTORED ROLE SELECTION PROPERTIES ---
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        gap: 12,
        width: '100%',
        paddingHorizontal: 20,
    },
    roleCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent'
    },
    roleCardActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'white',
    },
    roleText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    roleTextActive: {
        color: 'white'
    },
    // --- RESTORED INPUT STYLE ---
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 5,
    }
});