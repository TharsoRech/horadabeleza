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
});