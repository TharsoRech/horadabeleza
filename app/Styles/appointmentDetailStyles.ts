import {Dimensions, StyleSheet} from 'react-native';
import { COLORS } from "@/constants/theme";
const { width } = Dimensions.get('window');

export const detailStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '85%',
        paddingBottom: 30
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain
    },
    closeBtn: { padding: 5 },
    ticketCard: {
        backgroundColor: '#FFF',
        margin: 20,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    section: { padding: 20 },
    salonInfoRow: { flexDirection: 'row', alignItems: 'center' },
    salonLogo: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#EEE'
    },
    salonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain
    },
    addressText: {
        fontSize: 13,
        color: '#999',
        marginTop: 2
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    circleCutoutLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginLeft: -10
    },
    circleCutoutRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginRight: -10
    },
    dashLine: {
        flex: 1,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#DDD',
        marginHorizontal: 5
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F0F7F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    detailLabel: {
        fontSize: 12,
        color: '#999'
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textMain
    },
    priceSection: {
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        alignItems: 'center',
        paddingVertical: 25
    },
    priceLabel: {
        fontSize: 14,
        color: '#666'
    },
    priceValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 5
    },
    actionContainer: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20
    },
    primaryAction: {
        flexDirection: 'row',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    secondaryAction: {
        height: 55,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondaryActionText: {
        fontWeight: 'bold',
        fontSize: 14
    },
    alertOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    alertContainer: {
        width: width * 0.85,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 15,
    },
    alertIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    alertMessage: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    alertButtonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    alertBtnPrimary: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBtnSecondary: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBtnTextPrimary: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    alertBtnTextSecondary: {
        color: '#666',
        fontWeight: '600',
        fontSize: 15,
    },
});