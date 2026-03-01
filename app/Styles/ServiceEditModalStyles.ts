import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const ServiceEditModalStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: 'white'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    cancelText: { color: '#666', fontSize: 16 },
    saveText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    section: { backgroundColor: 'white', padding: 20, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    subLabel: { fontSize: 12, color: '#999' },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowItems: { flexDirection: 'row', marginTop: 10 },
    toggleBtn: { padding: 10, borderRadius: 20 },
    toggleOn: { backgroundColor: '#2E7D32' },
    toggleOff: { backgroundColor: '#666' },
    subServiceCard: {
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#FFF'
    },
    subServiceTitleInput: { fontSize: 16, fontWeight: '600', color: COLORS.textMain, flex: 1 },
    miniLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
    miniInput: { backgroundColor: '#F5F5F5', borderRadius: 4, padding: 8, fontSize: 14 },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        marginTop: 10
    },
    addBtnText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 8 },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EDEFEF',
    },
    manageButtonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    metricsBox: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 15,
        marginTop: 10
    },
    metricItem: {
        flex: 1,
        alignItems: 'center'
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    metricLabel: {
        fontSize: 12,
        color: '#888'
    },
    coverContainer: {
        width: '100%',
        height: 150,
        backgroundColor: '#EEE',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 5
    },
    fullImage: {
        width: '100%',
        height: '100%'
    },
    thumb: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
        marginTop: 10
    },
    addThumb: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    editBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white'
    },
    removeBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,0,0,0.8)',
        borderRadius: 12,
        padding: 2
    },
    publishCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1
    },
    switchTrack: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
        justifyContent: 'center'
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    }
});