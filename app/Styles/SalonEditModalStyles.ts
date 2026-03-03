import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get('window');

export const SalonEditModalStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#FFF'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    cancelText: { color: '#666', fontSize: 16 },
    saveText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },

    section: { padding: 20, borderBottomWidth: 8, borderBottomColor: '#F8F9FA' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 10 },

    // Inputs
    input: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#333'
    },

    // Mídia / Capa
    coverContainer: {
        width: '100%',
        height: 180,
        borderRadius: 15,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    fullImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    // --- GALERIA (O que estava faltando) ---
    addGalleryButton: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed'
    },
    galleryImageContainer: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 12,
        position: 'relative'
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12
    },
    removeGalleryImage: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FFF',
        borderRadius: 10
    },

    // Operação / Botões de Gerenciamento
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        // Sombra leve
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    manageButtonTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333'
    }
});