import { UserProfile } from "../Models/UserProfile";
import { IUserRepository } from "./Interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
    async updateProfile(user: UserProfile): Promise<boolean> {
        try {
            // Exemplo de chamada de API
            // const response = await fetch('https://sua-api.com/user/update', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(user)
            // });

            // return response.ok;

            // Simulando latência do servidor
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Usuário atualizado no back-end:", user.name);
            return true;
        } catch (error) {
            console.error("Erro ao atualizar no back-end:", error);
            return false;
        }
    }

    async deleteAccount(userId: string): Promise<boolean> {
        try {
            // Exemplo: await fetch(`https://api.com/user/${userId}`, { method: 'DELETE' });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação
            console.log("Conta excluída no back-end:", userId);
            return true;
        } catch (error) {
            console.error("Erro ao deletar conta:", error);
            return false;
        }
    }
}