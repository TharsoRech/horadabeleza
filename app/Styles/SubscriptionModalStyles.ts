import {StyleSheet} from "react-native";

export const SubscriptionModalStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
    content: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, maxHeight: '80%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
    planCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 12
    },
    iconBadge: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    planTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    planDesc: { fontSize: 12, color: '#999', marginVertical: 2 },
    planPrice: { fontSize: 14, fontWeight: 'bold' },
    summaryBox: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 12, alignItems: 'center' },
    summaryLabel: { fontSize: 14, color: '#666' },
    summaryValue: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
    summaryPrice: { fontSize: 18, color: '#333', marginTop: 5 },
    trialText: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 20, lineHeight: 20 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 8, marginBottom: 10 },
    termsText: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 15 },
    confirmBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    confirmBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    trialBox: { alignItems: 'center', padding: 20 },
});