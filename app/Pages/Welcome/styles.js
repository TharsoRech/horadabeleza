import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        marginTop: 40
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
});