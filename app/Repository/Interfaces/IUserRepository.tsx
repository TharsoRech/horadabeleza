import {UserProfile} from "@/app/Models/UserProfile";

export interface IUserRepository {
    updateProfile(user: UserProfile): Promise<boolean>;
    deleteAccount(userId: string): Promise<boolean>; // Novo método
}