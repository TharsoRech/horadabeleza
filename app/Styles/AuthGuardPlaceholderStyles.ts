import { StyleSheet } from 'react-native';

export const AuthGuardPlaceholderStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
    iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    description: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 30 },
    loginBtn: { width: '100%', height: 55, backgroundColor: '#FF4B91', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    registerBtn: { width: '100%', height: 55, borderWidth: 2, borderColor: '#FF4B91', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    registerText: { color: '#FF4B91', fontSize: 16, fontWeight: 'bold' },
});