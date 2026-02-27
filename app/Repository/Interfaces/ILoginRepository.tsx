import {UserProfile} from "@/app/Models/UserProfile";

export interface ILoginRepository {
    login(email: string, pass: string): Promise<UserProfile>;
    resetPassword(email: string): Promise<boolean>;
    register(userData: Partial<UserProfile>): Promise<UserProfile> 
}