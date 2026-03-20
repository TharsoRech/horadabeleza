import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../Models/UserProfile';
import CacheManager from '../Managers/CacheManager';
import { useRouter } from 'expo-router';
import { UserRepository } from '../Repository/UserRepository';
import { LoginRepository } from '../Repository/LoginRepository';
import { API_CONFIG } from '../Config/apiConfig';

interface AuthContextData {
    isAuthenticated: boolean;
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
    currentUser: UserProfile | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (userData: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
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
    const refreshTokenKey = "refresh_token_cache";

    const userRepository = new UserRepository();
    const loginRepository = new LoginRepository();

    // Registra callback de logout automático quando o provider monta
    useEffect(() => {
        API_CONFIG.setOnLogoutCallback(async () => {
            console.log('🔄 Callback de logout automático executado');
            await logout();
        });
    }, []);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const cachedData = await CacheManager.load<{profile: any, timestamp: number}>(profileKey);
                const cachedRefreshToken = await CacheManager.load<string>(refreshTokenKey);
                
                if (cachedData) {
                    const { profile, timestamp } = cachedData;
                    const umMes = 30 * 24 * 60 * 60 * 1000;
                    if (Date.now() - timestamp < umMes) {
                        setCurrentUser(profile);
                        
                        // Restaura refresh token se disponível
                        if (cachedRefreshToken) {
                            API_CONFIG.setRefreshToken(cachedRefreshToken);
                        }
                    } else {
                        await CacheManager.remove(profileKey);
                        await CacheManager.remove(refreshTokenKey);
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
        
        // Se o backend retornar um refresh token, armazena
        const refreshToken = (userProfile as any)?.refreshToken;
        if (refreshToken) {
            await CacheManager.save(refreshTokenKey, refreshToken);
            API_CONFIG.setRefreshToken(refreshToken);
        }
        
        setCurrentUser(cleanProfile);
        setIsGuest(false);
        router.replace('/(tabs)');
    };

    const register = async (userData: any) => {
        const newUser = await loginRepository.register(userData);
        const cleanProfile = JSON.parse(JSON.stringify(newUser));

        await CacheManager.save(profileKey, { profile: cleanProfile, timestamp: Date.now() });
        
        // Se o backend retornar um refresh token, armazena
        const refreshToken = (newUser as any)?.refreshToken;
        if (refreshToken) {
            await CacheManager.save(refreshTokenKey, refreshToken);
            API_CONFIG.setRefreshToken(refreshToken);
        }
        
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
        await CacheManager.remove(refreshTokenKey);
        API_CONFIG.clearToken(); // Também limpa o refresh token
        setCurrentUser(null);
        setIsGuest(false);
        router.replace('/Pages/Welcome/WelcomeScreen' as any);
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            // Verifica se temos um usuário logado e um token válido
            if (!currentUser || !API_CONFIG.getToken()) {
                console.warn('⚠️ Sem usuário ou token para fazer refresh');
                return false;
            }

            console.log('🔄 Tentando renovar token via AuthManager...');

            // Faz uma chamada para renovar o token
            const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify({
                    refreshToken: API_CONFIG.getRefreshToken()
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Se o backend retornar um novo token, atualiza
                if (data.token) {
                    console.log('✅ Token renovado com sucesso via AuthManager');
                    API_CONFIG.setToken(data.token);
                    
                    // Se o backend retornar novo refresh token, atualiza também
                    if (data.refreshToken) {
                        API_CONFIG.setRefreshToken(data.refreshToken);
                        await CacheManager.save(refreshTokenKey, data.refreshToken);
                    }
                    
                    return true;
                }
                
                console.warn('⚠️ Resposta de refresh sem novo token');
                await logout();
                return false;
            } else {
                console.error(`❌ Falha ao renovar token: ${response.status}`);
                await logout();
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao renovar token no AuthManager:', error);
            await logout();
            return false;
        }
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
            login, register, logout, refreshToken,
            updateProfile, deleteUserAccount, requestPasswordReset, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);