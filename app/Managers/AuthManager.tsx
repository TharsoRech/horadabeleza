import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
    const accessTokenKey = "access_token_cache";

    const userRepository = useMemo(() => new UserRepository(), []);
    const loginRepository = useMemo(() => new LoginRepository(), []);

    const clearLocalSession = useCallback(async () => {
        await CacheManager.remove(profileKey);
        await CacheManager.remove(refreshTokenKey);
        await CacheManager.remove(accessTokenKey);
        API_CONFIG.clearToken(); // Também limpa o refresh token
        setCurrentUser(null);
        setIsGuest(false);
        router.replace('/Pages/Welcome/WelcomeScreen' as any);
    }, [accessTokenKey, profileKey, refreshTokenKey, router]);

    const logout = useCallback(async () => {
        await loginRepository.logoutRemote(API_CONFIG.getRefreshToken());
        await clearLocalSession();
    }, [clearLocalSession, loginRepository]);

    // Registra callback de logout automático quando o provider monta
    useEffect(() => {
        API_CONFIG.setOnLogoutCallback(async () => {
            console.log('🔄 Callback de logout automático executado');
            await clearLocalSession();
        });
    }, [clearLocalSession]);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const cachedData = await CacheManager.load<{profile: any, timestamp: number}>(profileKey);
                const cachedRefreshToken = await CacheManager.load<string>(refreshTokenKey);
                const cachedAccessToken = await CacheManager.load<string>(accessTokenKey);
                
                if (cachedData) {
                    const { profile, timestamp } = cachedData;
                    const umMes = 30 * 24 * 60 * 60 * 1000;
                    if (Date.now() - timestamp < umMes) {
                        // Só considera sessão válida se houver token de acesso restaurado.
                        if (cachedAccessToken) {
                            API_CONFIG.setToken(cachedAccessToken);
                            setCurrentUser(profile);
                        } else {
                            await CacheManager.remove(profileKey);
                            await CacheManager.remove(refreshTokenKey);
                            await CacheManager.remove(accessTokenKey);
                            setCurrentUser(null);
                        }
                        
                        if (cachedRefreshToken) {
                            API_CONFIG.setRefreshToken(cachedRefreshToken);
                        }
                    } else {
                        await CacheManager.remove(profileKey);
                        await CacheManager.remove(refreshTokenKey);
                        await CacheManager.remove(accessTokenKey);
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

        const accessToken = API_CONFIG.getToken();
        if (accessToken) {
            await CacheManager.save(accessTokenKey, accessToken);
        }
        
        // Se o backend retornar um refresh token, armazena
        const refreshToken = userProfile.refreshToken;
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

        const accessToken = API_CONFIG.getToken();
        if (accessToken) {
            await CacheManager.save(accessTokenKey, accessToken);
        }
        
        // Se o backend retornar um refresh token, armazena
        const refreshToken = newUser.refreshToken;
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


    const refreshToken = async (): Promise<boolean> => {
        try {
            // Refresh deve depender do refresh token, não do access token expirado.
            if (!currentUser || !API_CONFIG.getRefreshToken()) {
                console.warn('⚠️ Sem usuário ou refresh token para renovar sessão');
                return false;
            }

            console.log('🔄 Tentando renovar token via AuthManager...');

            // Faz uma chamada para renovar o token
            const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                    await CacheManager.save(accessTokenKey, data.token);
                    
                    // Se o backend retornar novo refresh token, atualiza também
                    if (data.refreshToken) {
                        API_CONFIG.setRefreshToken(data.refreshToken);
                        await CacheManager.save(refreshTokenKey, data.refreshToken);
                    }
                    
                    return true;
                }
                
                console.warn('⚠️ Resposta de refresh sem novo token');
                return false;
            } else {
                console.error(`❌ Falha ao renovar token: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao renovar token no AuthManager:', error);
            return false;
        }
    };

    const updateProfile = async (updatedProfile: UserProfile) => {
        await userRepository.updateProfile(updatedProfile);
        const serverProfile = await userRepository.getMyProfile();
        const clean = JSON.parse(JSON.stringify(serverProfile));
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