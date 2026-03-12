import {UserProfile, UserRole} from "@/app/Models/UserProfile";
import { apiClient } from "@/app/Utils/apiClient";
import { API_CONFIG } from "@/app/Config/apiConfig";
import { LoginResponse, RegisterRequest } from "@/app/Types/apiTypes";

export interface ILoginRepository {
    login(email: string, pass: string): Promise<UserProfile>;
    resetPassword(email: string): Promise<boolean>;
    register(userData: Partial<UserProfile>): Promise<UserProfile>;
}

export class LoginRepository implements ILoginRepository {
    async login(email: string, pass: string): Promise<UserProfile> {
        try {
            const response: LoginResponse = await apiClient.post('/auth/login', {
                email,
                password: pass
            });

            // Armazena o token JWT
            if (response.token) {
                API_CONFIG.setToken(response.token);
            }

            // Retorna o usuário autenticado
            return new UserProfile({
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role as UserRole || UserRole.CLIENT,
                dob: response.dob || '',
                country: response.country || 'Brasil',
                base64Image: response.base64Image || ''
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
            const userTypeMap: Record<UserRole, number> = {
                [UserRole.CLIENT]: 1,
                [UserRole.PROFISSIONAL]: 2
            };

            const userType = userTypeMap[userData.role || UserRole.CLIENT];

            const registerData = {
                Name: userData.name || '',
                Email: userData.email || '',
                Password: userData.password || '',
                Role: userType.toString(),
                Doc: userData.doc,
                Dob: userData.dob,
                Base64Image: userData.base64Image
            };

            const response: LoginResponse = await apiClient.post('/auth/register', registerData);

            // Se o registro for bem-sucedido, faz login automático
            if (response.token) {
                API_CONFIG.setToken(response.token);
            }

            return new UserProfile({
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role as UserRole || UserRole.CLIENT,
                dob: response.dob || '',
                country: response.country || 'Brasil',
                base64Image: response.base64Image || ''
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
            } else if (error.message) {
                throw new Error(error.message);
            } else if (error.status === 400) {
                throw new Error("Verifique os dados informados e tente novamente.");
            } else {
                throw new Error("Não foi possível registrar. Por favor, tente novamente.");
            }
        }
    }
}
