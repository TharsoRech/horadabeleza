import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../Models/UserProfile';
import CacheManager from '../Managers/CacheManager';
import { useRouter } from 'expo-router';

interface AuthContextData {
    isAuthenticated: boolean;
    isGuest: boolean; // Adicionado
    setIsGuest: (value: boolean) => void; // Adicionado
    currentUser: UserProfile | null;
    login: (profile: UserProfile) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isGuest, setIsGuest] = useState(false); // Estado para o convidado
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const profileKey = "user_profile_cache";

    useEffect(() => {
        async function loadStorageData() {
            try {
                const cachedData = await CacheManager.load<{profile: UserProfile, timestamp: number}>(profileKey);
                if (cachedData) {
                    const { profile, timestamp } = cachedData;
                    const umMesEmMilissegundos = 30 * 24 * 60 * 60 * 1000;
                    if (Date.now() - timestamp < umMesEmMilissegundos) {
                        setCurrentUser(new UserProfile(profile));
                    } else {
                        await CacheManager.remove(profileKey);
                        setCurrentUser(null);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar cache:", error);
            } finally {
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    const login = async (userProfile: UserProfile) => {
        const dataToCache = { profile: userProfile, timestamp: Date.now() };
        await CacheManager.save(profileKey, dataToCache);
        setCurrentUser(userProfile);
        setIsGuest(false); // Se logou, não é mais convidado
        router.replace('/(tabs)');
    };

    const logout = async () => {
        await CacheManager.remove(profileKey);
        setCurrentUser(null);
        setIsGuest(false);
        router.replace('/Pages/Welcome/WelcomeScreen' as any);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!currentUser,
            isGuest,
            setIsGuest,
            currentUser,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);