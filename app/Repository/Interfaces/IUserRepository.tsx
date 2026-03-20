import {UserProfile} from "@/app/Models/UserProfile";

export interface IUserRepository {
    updateProfile(user: UserProfile): Promise<boolean>;
    deleteAccount(userId: string): Promise<boolean>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
}
