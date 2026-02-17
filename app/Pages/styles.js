import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    subTitle: { fontSize: 14, color: '#666' },
    profileBadge: { padding: 10, backgroundColor: '#FFF', borderRadius: 12, elevation: 2 },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginTop: 10,
        elevation: 2,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 50 },
    promoBanner: { margin: 20, borderRadius: 20, overflow: 'hidden' },
    promoGradient: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    promoTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
    promoSub: { color: '#FFF', fontSize: 14, marginBottom: 10 },
    promoBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
    promoBtnText: { color: '#FF4B91', fontWeight: 'bold' },
    sectionContainer: { marginTop: 16 ,paddingTop:10},
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 15 },
    categoriesList: { paddingHorizontal: 15 },
    categoryCard: { alignItems: 'center', marginRight: 20 },
    categoryIconCircle: { width: 60, height: 60, backgroundColor: '#FFF', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    categoryName: { marginTop: 8, fontSize: 13, color: '#444' },
    salonCard: { marginHorizontal: 16, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 3, marginBottom: 16, width: '200' },
    salonImagePlaceholder: { height: 150, backgroundColor: '#EEE' },
    salonInfo: { padding: 15 },
    salonName: { fontSize: 16, fontWeight: 'bold' },
    salonAddress: { fontSize: 13, color: '#888', marginTop: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingText: { marginLeft: 5, fontSize: 12, color: '#666' },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        marginTop: 40
    },
    illustrationPlaceholder: {
        width: width * 0.85,
        height: width * 0.75,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textSection: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 30,
        gap: 12,
    },
    signUpBtn: {
        backgroundColor: '#D63484',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    signUpText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logInBtn: {
        backgroundColor: 'transparent',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    logInText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    guestBtn: {
        marginTop: 8,
        alignItems: 'center',
    },
    guestText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    imagePickerContainer: {
        alignSelf: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'white',
    },
    placeholderCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        gap: 12
    },
    roleCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent'
    },
    roleCardActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'white',
    },
    roleText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    roleTextActive: {
        color: 'white'
    },
    profileHeader: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 16, 
    },
    seeAllText: {
        color: '#FF4B91',
        fontWeight: 'bold',
    },
    salonsScrollContainer: {
        gap: 0, 
        paddingHorizontal: 0, 
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#FF4B91',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#fff'
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    }
}); 

export const localStyles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 5,
    }
});