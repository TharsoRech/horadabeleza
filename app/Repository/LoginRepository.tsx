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
                country: response.country || 'Brasil'
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
            const registerData: RegisterRequest = {
                name: userData.name || '',
                email: userData.email || '',
                password: userData.password || '',
                role: userData.role || UserRole.CLIENT,
                dob: userData.dob,
                country: userData.country || 'Brasil'
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
                country: response.country || 'Brasil'
            });
        } catch (error) {
            console.error('Register error:', error);
            throw new Error("Este e-mail já está em uso.");
        }
    }
}
