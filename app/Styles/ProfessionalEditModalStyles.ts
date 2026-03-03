import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const ProfessionalEditModalStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    cancelText: { color: '#666' },
    saveText: { color: COLORS.primary, fontWeight: 'bold' },
    addForm: { padding: 20, backgroundColor: '#F9F9F9', margin: 15, borderRadius: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 10 },
    imagePicker: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEE',
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 15,
        overflow: 'hidden', borderWidth: 1, borderColor: COLORS.primary
    },
    profImage: { width: '100%', height: '100%' },
    input: {
        backgroundColor: '#FFF', padding: 12, borderRadius: 10,
        marginBottom: 10, borderWidth: 1, borderColor: '#EEE'
    },
    addButton: {
        backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center'
    },
    addButtonText: { color: '#FFF', fontWeight: 'bold' },
    profCard: {
        flexDirection: 'row', alignItems: 'center', padding: 15,
        marginHorizontal: 20, marginBottom: 10, backgroundColor: '#FFF',
        borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0'
    },
    thumb: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    info: { flex: 1 },
    name: { fontWeight: 'bold', fontSize: 15 },
    specialty: { color: '#666', fontSize: 13 },
});