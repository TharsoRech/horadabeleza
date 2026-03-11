import { UserProfile } from "../Models/UserProfile";
import { IUserRepository } from "./Interfaces/IUserRepository";
import { apiClient } from "@/app/Utils/apiClient";
import { UserProfileResponse } from "@/app/Types/apiTypes";

export class UserRepository implements IUserRepository {
    async updateProfile(user: UserProfile): Promise<boolean> {
        try {
            await apiClient.put(`/users/${user.id}`, {
                name: user.name,
                email: user.email,
                role: user.role,
                dob: user.dob,
                country: user.country
            });
            return true;
        } catch (error) {
            console.error("Erro ao atualizar no back-end:", error);
            return false;
        }
    }

    async deleteAccount(userId: string): Promise<boolean> {
        try {
            await apiClient.delete(`/users/${userId}`);
            return true;
        } catch (error) {
            console.error("Erro ao deletar conta:", error);
            return false;
        }
    }
}
