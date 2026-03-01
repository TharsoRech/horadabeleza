import {StyleSheet} from "react-native";

export const SalonManagerCardStyles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        flexDirection: 'row',
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center'
    },
    imageContainer: {
        position: 'relative'
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F5F5F5'
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusBadge: {
        position: 'absolute',
        bottom: -5,
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
    info: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center'
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    address: {
        fontSize: 13,
        color: '#777',
        marginBottom: 10
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    statText: {
        fontSize: 12,
        color: '#555',
        marginLeft: 4,
        fontWeight: '500'
    },
    arrowContainer: {
        paddingLeft: 8
    }
});