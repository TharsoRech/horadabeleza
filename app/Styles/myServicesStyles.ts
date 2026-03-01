import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const myServicesStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        // Sombra
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FFF1F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    serviceName: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    serviceDescription: {
        fontSize: 13,
        color: COLORS.textSub,
        marginTop: 3,
        lineHeight: 18,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    subServicesCount: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 4,
    },
    skeletonContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    skeletonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    publishedBadge: {
        backgroundColor: '#E8F5E9',
    },
    draftBadge: {
        backgroundColor: '#FFF3E0',
    }
});