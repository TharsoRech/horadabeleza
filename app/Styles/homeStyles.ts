import {COLORS, SHADOWS} from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: COLORS.textMain },
    subTitle: { fontSize: 14, color: COLORS.textSub },
    profileBadge: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        ...SHADOWS.light
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 10,
        height: 50,
        ...SHADOWS.light,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: '100%' },

    // --- CATEGORIES ---
    sectionContainer: { marginTop: 16, paddingTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 15 },
    categoriesList: { paddingHorizontal: 15 },
    categoryCard: {
        alignItems: 'center',
        marginRight: 20
    },
    categoryIconCircle: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    categoryName: {
        marginTop: 8,
        fontSize: 13,
        color: '#444'
    },

    // --- SALONS (Restored missing properties) ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 16,
    },
    seeAllText: { color: COLORS.secondary, fontWeight: 'bold' },
    salonsScrollContainer: { paddingHorizontal: 15 },
    salonCard: {
        marginHorizontal: 16,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        width: 200,
        ...SHADOWS.light
    },
    salonImagePlaceholder: {
        height: 150,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    salonInfo: {
        padding: 15
    },
    salonName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textMain
    },
    salonAddress: {
        fontSize: 13,
        color: COLORS.muted,
        marginTop: 4
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 12,
        color: COLORS.textSub
    },

    // --- BADGES ---
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: COLORS.secondary,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white
    },
    badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' }
});