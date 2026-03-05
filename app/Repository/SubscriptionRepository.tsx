import { Subscription } from "../Models/Subscription";
import {ISubscriptionRepository} from "@/app/Repository/Interfaces/ISubscriptionRepository";
import {Plan} from "@/app/Models/Plan";
import {COLORS} from "@/constants/theme";

export class SubscriptionRepository implements ISubscriptionRepository {
    async getSubscription(): Promise<Subscription> {
        // Simulando chamada de API/Firebase
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    isActive: false, // Inicia inativo para testar o modal
                    //trialStartDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), // 10 dias atrás
                    planType: 'none',
                    maxClients: 0,
                    currentClients: 15
                });
            }, 500);
        });
    }

    async getAvailablePlans(): Promise<Plan[]> {
        // Agora os dados vêm do "serviço" e não do componente UI
        return [
            {
                id: 'trial',
                title: 'Período de Teste',
                price: 'Grátis',
                desc: 'Acesso total por 30 dias',
                icon: 'clock-outline',
                color: '#4CAF50',
                type: 'trial'
            },
            {
                id: 'basic',
                title: 'Plano Basic',
                price: 'R$ 50,00/mês',
                desc: 'Gerencie até 50 clientes',
                icon: 'account-group-outline',
                color: COLORS.primary,
                type: 'paid'
            },
            {
                id: 'premium',
                title: 'Plano Premium',
                price: 'R$ 100,00/mês',
                desc: 'Mais de 100 clientes',
                icon: 'crown-outline',
                color: '#FFD700',
                type: 'paid'
            }
        ];
    }

    async activateTrial(): Promise<void> {
        console.log("Trial Ativado");
    }

    async activateFreeTrial(): Promise<Subscription> {
        return {
            isActive: false,
            trialStartDate: new Date().toISOString(),
            planType: 'trial',
            maxClients: 50,
            currentClients: 0
        };
    }

    async processPaidSubscription(planId: string): Promise<Subscription> {
        const max = planId === 'premium' ? 9999 : 50;
        return {
            isActive: true,
            trialStartDate: new Date().toISOString(),
            planType: planId as any,
            maxClients: max,
            currentClients: 10 // exemplo
        };
    }
}