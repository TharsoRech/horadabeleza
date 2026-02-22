import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from "@/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const salonDetailStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    content: {
        height: SCREEN_HEIGHT * 0.92,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    imageHeader: { height: 220, width: '100%' },
    bannerImage: { width: '100%', height: '100%', backgroundColor: '#F0F0F0' },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        elevation: 5,
    },
    profileSection: { paddingHorizontal: 20, marginTop: -50, paddingBottom: 15 },
    logoContainer: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 5, borderColor: '#FFF',
        backgroundColor: '#EEE', overflow: 'hidden', elevation: 4,
    },
    headerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    salonName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain },
    addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
    addressText: { color: COLORS.muted, fontSize: 12, maxWidth: '60%', marginRight: 6 },
    ratingBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFBE6', paddingHorizontal: 6,
        paddingVertical: 2, borderRadius: 4,
        borderWidth: 0.5, borderColor: '#FFE58F',
    },
    ratingText: { marginLeft: 3, fontWeight: 'bold', fontSize: 11, color: '#FFA800' },
    contactBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    tabBarWrapper: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    tabBar: { paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' },
    tabItem: { paddingVertical: 15, paddingHorizontal: 15, marginRight: 5, alignItems: 'center' },
    activeTabItem: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
    tabText: { color: '#888', fontWeight: '600', fontSize: 14 },
    activeTabText: { color: COLORS.primary },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textMain, marginBottom: 12 },
    serviceRow: {
        flexDirection: 'row', padding: 16, backgroundColor: '#F9F9F9',
        borderRadius: 12, marginBottom: 8, alignItems: 'center',
        borderWidth: 1, borderColor: '#EEE',
    },
    selectedItem: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: '#F0F7FF' },
    serviceLabel: { fontSize: 15, fontWeight: '600' },
    profCard: {
        width: 90, paddingVertical: 12, borderRadius: 16,
        marginRight: 10, backgroundColor: '#F9F9F9',
        alignItems: 'center', borderWidth: 1, borderColor: '#EEE',
    },
    profImageSmall: { width: 50, height: 50, borderRadius: 25, marginBottom: 6 },
    profName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    descriptionText: { fontSize: 15, lineHeight: 24, color: '#555' },
    galleryImage: { width: 140, height: 100, borderRadius: 12, marginRight: 10, backgroundColor: '#EEE' },
    localContainer: { alignItems: 'center', paddingVertical: 40 },
    localTitle: { textAlign: 'center', marginVertical: 15, color: '#666', fontSize: 14 },
    mapBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, height: 45, borderRadius: 22, justifyContent: 'center' },
    reviewForm: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 16, marginBottom: 20 },
    reviewInput: {
        backgroundColor: '#FFF', borderRadius: 8, padding: 10,
        height: 70, textAlignVertical: 'top', marginTop: 5,
        borderWidth: 1, borderColor: '#EEE',
    },
    sendReviewBtn: {
        backgroundColor: COLORS.primary, borderRadius: 8, height: 40,
        justifyContent: 'center', alignItems: 'center', marginTop: 12,
    },
    sendReviewBtnText: { color: '#FFF', fontWeight: 'bold' },
    reviewCard: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    reviewComment: { color: '#666', marginTop: 5, fontSize: 14 },
    lockWarning: {
        flexDirection: 'row', alignItems: 'center', padding: 15,
        backgroundColor: '#F8F8F8', borderRadius: 12, marginVertical: 10
    },
    lockText: { fontSize: 12, color: '#999', marginLeft: 10, flex: 1, fontStyle: 'italic' },
    footer: {
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE',
    },
    bookBtn: { backgroundColor: COLORS.primary, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    dateCard: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        minWidth: 80
    },
    dateLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        backgroundColor: '#FFF'
    },
    selectedTimeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    timeText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    modalConfirmOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', padding: 20
    },
    confirmCard: {
        width: '100%', backgroundColor: '#FFF',
        borderRadius: 24, padding: 25,
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.2
    },
    confirmTitle: {
        fontSize: 20, fontWeight: 'bold', textAlign: 'center',
        marginVertical: 15, color: COLORS.textMain
    },
    confirmInfoBox: {
        backgroundColor: '#F8F9FA', borderRadius: 16,
        padding: 15, marginVertical: 10
    },
    confirmFinalBtn: {
        backgroundColor: COLORS.primary, height: 54,
        borderRadius: 15, justifyContent: 'center', alignItems: 'center',
        marginTop: 10
    },
    confirmFinalBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    successIconStyle : {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#25D366', justifyContent: 'center',
        alignItems: 'center', marginBottom: 10,
        elevation: 5, shadowColor: '#25D366', shadowOpacity: 0.4
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 2,
    },
    dateDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    dateWeekday: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    successIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: "#25D366",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
});