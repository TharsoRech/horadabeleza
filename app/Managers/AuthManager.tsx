import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../Models/UserProfile';
import CacheManager from '../Managers/CacheManager';
import { useRouter } from 'expo-router';
import { UserRepository } from '../Repository/UserRepository';
import { LoginRepository } from '../Repository/LoginRepository';

interface AuthContextData {
    isAuthenticated: boolean;
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
    currentUser: UserProfile | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (userData: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updatedProfile: UserProfile) => Promise<void>;
    deleteUserAccount: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<boolean>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const profileKey = "user_profile_cache";

    const userRepository = new UserRepository();
    const loginRepository = new LoginRepository();

    useEffect(() => {
        async function loadStorageData() {
            try {
                const cachedData = await CacheManager.load<{profile: any, timestamp: number}>(profileKey);
                if (cachedData) {
                    const { profile, timestamp } = cachedData;
                    const umMes = 30 * 24 * 60 * 60 * 1000;
                    if (Date.now() - timestamp < umMes) {
                        setCurrentUser(profile);
                    } else {
                        await CacheManager.remove(profileKey);
                    }
                }
            } catch (error) {
                console.error("Erro cache:", error);
            } finally {
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    const login = async (email: string, pass: string) => {
        const userProfile = await loginRepository.login(email, pass);
        // Limpeza profunda para evitar erro de objeto no React
        const cleanProfile = JSON.parse(JSON.stringify(userProfile));

        await CacheManager.save(profileKey, { profile: cleanProfile, timestamp: Date.now() });
        setCurrentUser(cleanProfile);
        setIsGuest(false);
        router.replace('/(tabs)');
    };

    const register = async (userData: any) => {
        const newUser = await loginRepository.register(userData);
        const cleanProfile = JSON.parse(JSON.stringify(newUser));

        await CacheManager.save(profileKey, { profile: cleanProfile, timestamp: Date.now() });
        setCurrentUser(cleanProfile);
        setIsGuest(false);
        router.replace('/(tabs)');
    };

    const requestPasswordReset = async (email: string) => {
        try { return await loginRepository.resetPassword(email); }
        catch { return false; }
    };

    const logout = async () => {
        await CacheManager.remove(profileKey);
        setCurrentUser(null);
        setIsGuest(false);
        router.replace('/Pages/Welcome/WelcomeScreen' as any);
    };

    const updateProfile = async (updatedProfile: UserProfile) => {
        const success = await userRepository.updateProfile(updatedProfile);
        if (!success) throw new Error("Erro servidor");
        const clean = JSON.parse(JSON.stringify(updatedProfile));
        await CacheManager.save(profileKey, { profile: clean, timestamp: Date.now() });
        setCurrentUser(clean);
    };

    const deleteUserAccount = async () => {
        if (!currentUser) return;
        await userRepository.deleteAccount(currentUser.id);
        await logout();
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!currentUser,
            isGuest, setIsGuest, currentUser,
            login, register, logout, updateProfile,
            deleteUserAccount, requestPasswordReset, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);