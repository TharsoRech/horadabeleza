import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/theme";

const { height } = Dimensions.get('window');

export const ProfessionalEditModalStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    headerTitle: { fontSize: 17, fontWeight: 'bold' },
    cancelText: { color: '#666' },
    saveText: { color: COLORS.primary, fontWeight: 'bold' },

    addForm: { padding: 20, backgroundColor: '#F9F9F9', margin: 15, borderRadius: 15 },
    input: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
    addButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
    addButtonText: { color: '#FFF', fontWeight: 'bold' },

    profCard: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
    info: { flex: 1 },
    name: { fontWeight: 'bold', fontSize: 16 },
    details: { color: '#999', fontSize: 13 },

    // OVERLAY E CARD
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    adjustmentCard: { backgroundColor: '#FFF', width: '90%', height: height * 0.8, borderRadius: 20, padding: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subLabel: { fontWeight: 'bold', color: '#666', marginBottom: 10 },

    // SERVIÇOS EM CHIPS
    servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    serviceChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
    activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { fontSize: 12, color: '#666' },
    activeChipText: { color: '#FFF' },

    // AGENDA
    daysRow: { flexDirection: 'row', marginBottom: 15 },
    dayButton: { padding: 10, marginRight: 8, borderRadius: 10, backgroundColor: '#F0F0F0', minWidth: 50, alignItems: 'center' },
    activeDay: { backgroundColor: COLORS.primary },
    dayText: { fontWeight: 'bold', color: '#666' },
    activeDayText: { color: '#FFF' },

    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeSlot: { width: '22%', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
    activeTime: { backgroundColor: '#E3F2FD', borderColor: COLORS.primary },
    timeSlotText: { fontSize: 12, color: '#666' },
    activeTimeText: { color: COLORS.primary, fontWeight: 'bold' },

    // FOOTER
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
    btnCancel: { padding: 12, flex: 1, alignItems: 'center' },
    btnSave: { backgroundColor: COLORS.primary, padding: 12, flex: 2, borderRadius: 10, alignItems: 'center', marginLeft: 10 },
    txtCancel: { color: '#999', fontWeight: 'bold' },
    txtSave: { color: '#FFF', fontWeight: 'bold' }
});