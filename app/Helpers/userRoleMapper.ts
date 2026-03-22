import { UserRole } from "@/app/Models/UserProfile";

// Normaliza o tipo vindo da API (.NET enum numérico ou string) para o enum usado no app.
export const mapApiTypeToUserRole = (value: unknown): UserRole => {
    if (typeof value === "number") {
        return value === 1 ? UserRole.PROFISSIONAL : UserRole.CLIENT;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (normalized === "1" || normalized === "professional" || normalized === "profissional") {
            return UserRole.PROFISSIONAL;
        }

        if (normalized === "0" || normalized === "client" || normalized === "cliente") {
            return UserRole.CLIENT;
        }
    }

    return UserRole.CLIENT;
};

export const mapUserRoleToApiType = (role?: UserRole): number =>
    role === UserRole.PROFISSIONAL ? 1 : 0;

