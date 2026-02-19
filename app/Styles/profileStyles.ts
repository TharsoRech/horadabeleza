import { StyleSheet } from 'react-native';
import {COLORS} from "@/constants/theme";

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    profileHeader: {
        alignItems: 'center',
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textMain
    },
    userEmail: {
        color: COLORS.textSub,
        marginTop: 4
    },
    menuContainer: {
        padding: 20
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9'
    },
    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: COLORS.textMain
    },
    logoutText: {
        color: COLORS.secondary,
        fontWeight: '600'
    }
});