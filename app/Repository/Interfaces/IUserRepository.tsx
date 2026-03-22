import {UserProfile} from "@/app/Models/UserProfile";

export interface IUserRepository {
    getMyProfile(): Promise<UserProfile>;
    updateProfile(user: UserProfile): Promise<void>;
    deleteAccount(userId: string): Promise<boolean>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
}
