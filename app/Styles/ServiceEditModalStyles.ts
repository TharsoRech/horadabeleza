import { StyleSheet } from 'react-native';
import { COLORS } from "@/constants/theme";

export const ServiceEditModalStyles = StyleSheet.create({
    // Estrutura Principal
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
    },
    saveText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },

    // Formulário de Cadastro (Topo)
    addForm: {
        backgroundColor: '#FFF',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        marginLeft:8,
        marginRight: 8
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginLeft:16
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },

    // Lista de Itens Registrados
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
    },
    countBadge: {
        backgroundColor: '#EEE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    serviceCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F4FF', // Um tom azulado bem leve
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    desc: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
        lineHeight: 16,
    },
    priceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CCC',
        marginHorizontal: 8,
    },
    duration: {
        fontSize: 13,
        color: '#666',
    },
    removeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },
    emptyText: {
        color: '#AAA',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    removeIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF0F0', // Fundo avermelhado suave
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    }
});