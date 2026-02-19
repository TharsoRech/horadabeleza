import { StyleSheet } from 'react-native';
import {COLORS, SHADOWS} from "@/constants/theme";

export const appointmentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    listContent: {
        padding: 20,
    },
    appointmentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    salonName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    serviceText: {
        fontSize: 14,
        color: COLORS.textSub,
        marginTop: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    timeText: {
        marginLeft: 5,
        fontSize: 13,
        color: COLORS.muted,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});