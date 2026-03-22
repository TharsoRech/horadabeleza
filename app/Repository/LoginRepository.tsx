import {UserProfile, UserRole} from "@/app/Models/UserProfile";
import { apiClient } from "@/app/Utils/apiClient";
import { API_CONFIG } from "@/app/Config/apiConfig";
import { LoginResponse } from "@/app/Types/apiTypes";
import { hashPassword } from "@/app/Utils/passwordHash";
import { mapApiTypeToUserRole } from "@/app/Helpers/userRoleMapper";

export interface ILoginRepository {
    login(email: string, pass: string): Promise<UserProfile>;
    resetPassword(email: string): Promise<boolean>;
    register(userData: Partial<UserProfile>): Promise<UserProfile>;
}

export class LoginRepository implements ILoginRepository {
    async login(email: string, pass: string): Promise<UserProfile> {
        try {
            const hashedPassword = await hashPassword(pass);

            const response: LoginResponse = await apiClient.post('/auth/login', {
                email,
                password: hashedPassword,
                legacyPassword: pass
            });

            // Armazena o token JWT
            if (response.token) {
                API_CONFIG.setToken(response.token);
            }
            
            // Armazena o refresh token se disponível
            if (response.refreshToken) {
                API_CONFIG.setRefreshToken(response.refreshToken);
            }

            // Retorna o usuário autenticado
            return new UserProfile({
                id: response.id,
                name: response.name,
                email: response.email,
                role: mapApiTypeToUserRole(response.role ?? response.type),
                dob: response.dob || '',
                country: response.country || 'Brasil',
                base64Image: response.base64Image || '',
                refreshToken: response.refreshToken
            });
        } catch (error) {
            console.error('Login error:', error);
            throw new Error("Credenciais inválidas");
        }
    }

    async resetPassword(email: string): Promise<boolean> {
        try {
            await apiClient.post('/auth/reset-password', {
                email
            });
            return true;
        } catch (error) {
            console.error('Reset password error:', error);
            throw new Error("Não foi possível enviar o e-mail de recuperação");
        }
    }

    async register(userData: Partial<UserProfile>): Promise<UserProfile> {
        try {
            // Mapeia os tipos de usuário para os valores esperados pelo backend
            // Backend: Client = 1, Professional = 2
            const userTypeMap: Record<UserRole, number> = {
                [UserRole.CLIENT]: 0,
                [UserRole.PROFISSIONAL]: 1
            };

            const userType = userTypeMap[userData.role || UserRole.CLIENT];
            const hashedPassword = await hashPassword(userData.password || '');
            
            const registerData = {
                Name: userData.name || '',
                Email: userData.email || '',
                Password: hashedPassword,
                Type: userType, // Envia como número, não string
                Phone: userData.phone,
                Doc: userData.doc,
                Dob: userData.dob,
                Base64Image: userData.base64Image
            };
            
            const response: LoginResponse = await apiClient.post('/auth/register', registerData);

            // Se o registro for bem-sucedido, faz login automático
            if (response.token) {
                API_CONFIG.setToken(response.token);
            }
            
            // Armazena o refresh token se disponível
            if (response.refreshToken) {
                API_CONFIG.setRefreshToken(response.refreshToken);
            }

            return new UserProfile({
                id: response.id,
                name: response.name,
                email: response.email,
                role: mapApiTypeToUserRole(response.role ?? response.type),
                dob: response.dob || '',
                country: response.country || 'Brasil',
                base64Image: response.base64Image || '',
                refreshToken: response.refreshToken
            });
        } catch (error: any) {
            console.error('Register error:', error);
            console.error('Register error details:', error.response?.data || error.data);
            console.error('Register error status:', error.status);
            console.error('Register error config:', error.config);
            
            // Melhora a mensagem de erro baseada na resposta do backend
            if (error.message && error.message.includes('Email address is already registered')) {
                throw new Error("Este e-mail já está em uso.");
            } else if (error.response?.data?.error) {
                // Retorna o erro exato do backend
                throw new Error(error.response.data.error);
            } else if (error.response?.data?.message) {
                // Retorna a mensagem exata do backend
                throw new Error(error.response.data.message);
            } else if (error.response?.data?.errors) {
                // Retorna os erros de validação do backend
                const errors = error.response.data.errors;
                const errorMessages = Array.isArray(errors) ? errors.join('\n') : errors;
                throw new Error(errorMessages);
            } else if (error.response?.data?.title) {
                // Retorna o título do erro do backend (padrão .NET)
                throw new Error(error.response.data.title);
            } else if (error.response?.data?.detail) {
                // Retorna o detalhe do erro do backend (padrão .NET)
                throw new Error(error.response.data.detail);
            } else if (error.response?.data?.cpfAlreadyExists) {
                // Erro específico para CPF duplicado
                throw new Error("Já existe um usuário cadastrado com este CPF/CNPJ.");
            } else if (error.message) {
                throw new Error(error.message);
            } else if (error.status === 400) {
                throw new Error("Verifique os dados informados e tente novamente.");
            } else if (error.status === 409) {
                throw new Error("Conflito: Este recurso já existe.");
            } else if (error.status === 500) {
                // Mostra o erro 500 exatamente como vem do backend
                const errorMessage = error.response?.data?.message || error.response?.data?.error || "Erro interno do servidor";
                throw new Error(`Erro ${error.status}: ${errorMessage}`);
            } else {
                throw new Error(`Erro ${error.status || 'desconhecido'}: ${error.message || "Não foi possível registrar. Por favor, tente novamente."}`);
            }
        }
    }

    async logoutRemote(refreshToken?: string | null): Promise<void> {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        try {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            await fetch(`${API_CONFIG.baseURL}/auth/logout`, {
                method: 'POST',
                headers: API_CONFIG.getAuthHeaders(),
                body: JSON.stringify({ refreshToken: refreshToken || null }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
        } catch (error) {
            // Logout local deve seguir mesmo quando logout remoto falha.
            console.warn('Logout remoto falhou, seguindo com logout local:', error);
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }
}
