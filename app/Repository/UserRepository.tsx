import { UserProfile } from "../Models/UserProfile";
import { IUserRepository } from "./Interfaces/IUserRepository";
import { apiClient } from "@/app/Utils/apiClient";
import { mapApiTypeToUserRole, mapUserRoleToApiType } from "@/app/Helpers/userRoleMapper";

export class UserRepository implements IUserRepository {
    async getMyProfile(): Promise<UserProfile> {
        const response = await apiClient.get<any>('/auth/me');

        return new UserProfile({
            id: String(response?.id ?? ''),
            name: response?.name,
            email: response?.email,
            phone: response?.phone,
            doc: response?.doc,
            dob: response?.dob,
            country: response?.country,
            base64Image: response?.base64Image,
            photoUrl: response?.photoUrl,
            role: mapApiTypeToUserRole(response?.role ?? response?.type),
        });
    }

    async updateProfile(user: UserProfile): Promise<void> {
        try {
            console.log('📤 Enviando atualização de perfil para API...', {
                endpoint: '/auth/me',
                data: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    doc: user.doc,
                    dob: user.dob,
                    country: user.country,
                    type: mapUserRoleToApiType(user.role),
                    hasImage: !!user.base64Image
                }
            });

            // Endpoint correto conforme documentação da API: PUT /api/auth/me
            const response = await apiClient.put(`/auth/me`, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                photoUrl: user.photoUrl,
                doc: user.doc,
                dob: user.dob,
                country: user.country,
                base64Image: user.base64Image,
                username: user.name?.toLowerCase().replace(/\s+/g, '.'),
                type: mapUserRoleToApiType(user.role)
            });

            console.log('✅ Perfil atualizado com sucesso na API:', response);
        } catch (error: any) {
            console.error('❌ Erro ao atualizar perfil no back-end:', {
                message: error?.message,
                error: error,
                stack: error?.stack
            });

            const message = error?.message || 'Falha ao atualizar perfil no servidor.';
            throw new Error(message);
        }
    }

    async deleteAccount(userId: string): Promise<boolean> {
        try {
            console.log('📤 Deletando conta:', userId);
            // Endpoint conforme documentação: DELETE /api/auth/users/{userId}
            await apiClient.delete(`/auth/users/${userId}`);
            console.log('✅ Conta deletada com sucesso');
            return true;
        } catch (error: any) {
            console.error('❌ Erro ao deletar conta:', error?.message);
            return false;
        }
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            console.log('📤 Alterando senha...');
            // Usar endpoint de update de perfil com campos de senha se disponível
            // Ou criar um endpoint específico no backend
            await apiClient.put(`/auth/me`, {
                currentPassword,
                newPassword
            });
            console.log('✅ Senha alterada com sucesso');
            return true;
        } catch (error: any) {
            console.error('❌ Erro ao alterar senha:', error?.message);
            return false;
        }
    }
}
