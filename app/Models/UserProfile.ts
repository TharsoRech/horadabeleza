import * as Crypto from 'expo-crypto';

export enum UserRole {
    PROFISSIONAL = 'profissional',
    CLIENT = 'client',
    STAFF = 'staff'
}

export class UserProfile {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    dob?: string;
    country?: string;
    role?: UserRole;
    base64Image?: string;

    constructor(data: Partial<UserProfile> = {}) {
        this.id = data.id || Crypto.randomUUID();
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.dob = data.dob;
        this.country = data.country;
        this.role = data.role;
        this.base64Image = data.base64Image;
    }

    static mock(): UserProfile {
        return new UserProfile({
            name: "Alex Sterling",
            email: "alex.sterling@example.com",
            password: "secured_password_123",
            dob: "1992-11-24",
            country: "Brasil",
            role: UserRole.PROFISSIONAL,
        });
    }
}