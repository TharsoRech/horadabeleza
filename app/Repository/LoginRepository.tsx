import {UserProfile, UserRole} from "@/app/Models/UserProfile";

export interface ILoginRepository {
    login(email: string, pass: string): Promise<UserProfile>;
    resetPassword(email: string): Promise<boolean>;
}

export class LoginRepository implements ILoginRepository {
    // Simula o delay do banco de dados (1.5 segundos)
    private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    async login(email: string, pass: string): Promise<UserProfile> {
        await this.delay(1500);

        // Simulação de erro de credenciais
        if (pass === 'erro') throw new Error("Credenciais inválidas");

        // Retorna um usuário mocado com base no e-mail
        return new UserProfile({
            id: '123',
            name: 'Usuário Mocado',
            email: email,
            role: UserRole.CLIENT,
            dob: '01/01/1990',
            country: 'Brasil'
        });
    }

    async resetPassword(email: string): Promise<boolean> {
        await this.delay(1000);
        console.log(`Solicitação de reset enviada para: ${email}`);
        return true; // Simula sucesso
    }

    // Implementação do Registro Mocado
    async register(userData: Partial<UserProfile>): Promise<UserProfile> {
        await this.delay(2000); // Simula um processamento mais pesado de criação

        if (userData.email === 'erro@teste.com') {
            throw new Error("Este e-mail já está em uso.");
        }

        // Simula a atribuição de um ID pelo banco de dados
        return new UserProfile({
            ...userData,
            id: Math.random().toString(36).substr(2, 9),
            role: userData.role || UserRole.CLIENT,
        } as UserProfile);
    }
}