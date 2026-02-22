import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "@/constants/theme"; // Certifique-se de que o caminho está correto

const { height } = Dimensions.get('window');

export const professionalDetailStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)', // Um pouco menos escuro para suavizar
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        height: height * 0.9,
        width: '100%',
        overflow: 'hidden',
    },
    headerFixed: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#BBB',
    },
    profileHero: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
        // Sombra leve na foto para dar profundidade
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    avatarImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 6,
        borderColor: '#F8F8F8',
    },
    activeIndicator: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#4CAF50',
        borderWidth: 4,
        borderColor: '#FFF',
    },
    mainName: {
        fontSize: 26,
        fontWeight: '900',
        color: COLORS.textMain,
    },
    tagContainer: {
        backgroundColor: COLORS.primary + '15', // 15% de opacidade da cor primária
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 8,
    },
    tagText: {
        color: COLORS.primary,
        fontWeight: '800',
        fontSize: 13,
    },
    statsGrid: {
        flexDirection: 'row',
        marginTop: 25,
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingVertical: 18,
        paddingHorizontal: 35,
        // Sombra suave estilo "iOS"
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginTop: 4,
    },
    statDesc: {
        fontSize: 10,
        color: '#BBB',
        textTransform: 'uppercase',
        fontWeight: '800',
    },
    statSeparator: {
        width: 1,
        height: '70%',
        backgroundColor: '#F0F0F0',
        alignSelf: 'center',
    },
    contentBody: {
        paddingHorizontal: 25,
        marginTop: 20,
    },
    contentSection: {
        marginBottom: 35,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 12,
    },
    aboutBody: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
    },
    salonInstruction: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: '800',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    salonCardContainer: {
        // Removemos o scale aqui para evitar cortes de layout, 
        // mas deixamos o container pronto para estilização extra
    },
    addReviewBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 20,
    },
    addReviewLabel: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 12,
        color: COLORS.textMain,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 18,
    },
    textArea: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 15,
        height: 110,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#EEE',
        fontSize: 14,
        color: COLORS.textMain,
    },
    postBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 15,
    },
    postBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    infoLocked: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 18,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        marginBottom: 20,
    },
    infoLockedText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    reviewCard: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F8F8',
    },
    reviewTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    reviewerName: {
        fontWeight: '700',
        fontSize: 14,
        color: COLORS.textMain,
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reviewRatingValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    reviewText: {
        fontSize: 13,
        color: '#777',
        lineHeight: 20,
    },
});