import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const appointmentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    appointmentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    salonThumb: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#EEE',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    salonName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    serviceText: {
        fontSize: 14,
        color: COLORS.muted,
        marginBottom: 6,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
    statusTag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        minWidth: 85,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        marginTop: 15,
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    activeFilterChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // Adicione ao seu arquivo de estilos
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
    dateBar: {
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    dateChip: {
        width: 50,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 12,
        backgroundColor: '#F8F8F8',
    },
    activeDateChip: {
        backgroundColor: COLORS.primary,
    },
    dateDayName: {
        fontSize: 10,
        textTransform: 'uppercase',
        color: '#999',
    },
    dateDayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    activeDateText: {
        color: '#FFF',
    },
    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
        marginTop: 2,
    },
    calendarHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15, // Espaço para o botão de calendário não ficar colado na borda
    },

    calendarPickerBtn: {
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginLeft: 5,
        // Sombra para destacar o botão
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        marginTop:8
    },

    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 2,
    },

    infoText: {
        fontSize: 12,
        color: '#6c757d',
        lineHeight: 16,
    },
    unitSelectorBar: {
        paddingHorizontal: 0,
        marginVertical: 10,
    },
    unitChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    activeUnitChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unitText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        fontWeight: '500',
    },
    activeUnitText: {
        color: '#FFF',
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 10,
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 1,
    },
    permBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 10,
    },
    permText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 8,
    },
    calendarContainer: {
        backgroundColor: '#FFF',
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        // Sombra leve para separar do conteúdo
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#A0A0A0', // Um cinza discreto
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 8,
        paddingHorizontal: 20, // Alinha com o início dos itens
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    monthLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.textMain,
        letterSpacing: 1,
    },
    adminToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginRight: 5,
    },
    miniCalendarBtn: {
        padding: 10,
        marginRight: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
});