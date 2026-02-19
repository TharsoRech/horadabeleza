import { StyleSheet } from 'react-native';
import {COLORS, SHADOWS} from "@/constants/theme";

export const notificationStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingRight: 10,
        paddingTop: 70
    },
    content: {
        width: 300,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        maxHeight: 450,
        ...SHADOWS.medium, // Restored the shadow logic from your theme
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.textMain
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    unreadItem: {
        backgroundColor: '#fffcfd'
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    textContainer: {
        flex: 1,
        marginLeft: 10
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: COLORS.textMain
    },
    itemMsg: {
        fontSize: 13,
        color: COLORS.textSub,
        marginTop: 2,
        lineHeight: 18
    },
    itemTime: {
        fontSize: 11,
        color: COLORS.muted,
        marginTop: 5
    },
    unreadDot: {
        width: 8,
        height: 8,
        backgroundColor: COLORS.secondary, // Uses your #FF4B91 pink
        borderRadius: 4,
        marginTop: 5
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 30
    },
    empty: {
        textAlign: 'center',
        color: COLORS.muted,
        marginTop: 10
    }
});