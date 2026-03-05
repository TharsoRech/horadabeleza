import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const appointmentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    subTabRow: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 4,
        marginTop: 10,
    },
    subTabBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    subTabBtnActive: {
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    subTabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    subTabTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginTop: 15,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    infoText: {
        fontSize: 11,
        color: '#6c757d',
        marginTop: 2,
    },

    // --- SEÇÃO DE UNIDADES ---
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#ADB5BD',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        paddingHorizontal: 20,
        paddingVertical: 6,
        marginBottom: 4,
        marginTop: 5,
    },
    unitSelectorBar: {
        marginBottom: 12,
    },
    unitChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 32,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    activeUnitChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unitText: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
    },
    activeUnitText: {
        color: '#FFF',
        fontWeight: '700',
    },

    // --- CALENDÁRIO ---
    calendarContainer: {
        backgroundColor: '#FFF',
        paddingBottom: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 4,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    monthTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#212529',
        letterSpacing: 0.5,
    },
    adminToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 9,
        color: '#999',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginRight: 4,
    },
    calendarHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBar: {},
    dateChip: {
        width: 48,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    activeDateChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    dateDayName: {
        fontSize: 9,
        textTransform: 'uppercase',
        color: '#ADB5BD',
        marginBottom: 2,
    },
    dateDayNumber: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#343A40',
    },
    activeDateText: {
        color: '#FFF',
    },
    miniCalendarBtn: {
        padding: 10,
        marginRight: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },

    // --- FILTROS STATUS (Aba Pessoal) ---
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginRight: 10,
    },
    activeFilterChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 12,
        color: '#495057',
    },
    activeFilterText: {
        color: '#FFF',
        fontWeight: 'bold',
    },

    // --- ESTILOS DO APPOINTMENT CARD (RESTORED) ---
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 40,
    },
    appointmentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    salonThumb: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    salonName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    serviceText: {
        fontSize: 13,
        color: '#495057',
        marginTop: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // --- ESTADOS VAZIOS ---
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyText: {
        marginTop: 10,
        color: '#ADB5BD',
        fontSize: 14,
        textAlign: 'center',
    },
    timelineRow: {
        flexDirection: 'row',
        minHeight: 70,
    },
    hourCol: {
        width: 60,
        alignItems: 'center',
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#F0F0F0',
    },
    hourText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
    },
    eventsCol: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
    },
    timelineCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        elevation: 1,
    },
    cardIndicator: {
        width: 4,
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginRight: 10,
    },
    clientName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    profRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    profName: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    serviceName: {
        fontSize: 11,
        color: COLORS.primary,
        marginTop: 2,
        fontWeight: '500'
    },
    emptySlot: {
        height: 1,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptySlotLine: { height: 1, backgroundColor: '#F0F0F0', width: '100%' },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusBadgeText: { fontSize: 9, fontWeight: '800' },
});