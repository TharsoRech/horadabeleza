import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../Models/UserProfile';
import CacheManager from '../Managers/CacheManager';
import { useRouter } from 'expo-router';

interface AuthContextData {
    isAuthenticated: boolean;
    currentUser: UserProfile | null;
    login: (profile: UserProfile) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
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
                    const agora = Date.now();

                    if (agora - timestamp < umMesEmMilissegundos) {
                        // Garantimos que estamos instanciando o modelo corretamente
                        setCurrentUser(new UserProfile(profile));
                    } else {
                        await CacheManager.remove(profileKey);
                        setCurrentUser(null);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar cache:", error);
            } finally {
                // O loading PRECISA ser false para o RootLayout prosseguir
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    const login = async (userProfile: UserProfile) => {
        const dataToCache = {
            profile: userProfile,
            timestamp: Date.now()
        };

        await CacheManager.save(profileKey, dataToCache);
        setCurrentUser(userProfile);

        // CORREÇÃO: Caminho absoluto e limpo para as tabs
        // O replace aqui dispara a mudança que o RootLayout vai ouvir
        router.replace('/(tabs)');
    };

    const logout = async () => {
        await CacheManager.remove(profileKey);
        setCurrentUser(null);

        // CORREÇÃO: Caminho absoluto
        router.replace('/Pages/Welcome/WelcomeScreen' as any);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!currentUser,
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