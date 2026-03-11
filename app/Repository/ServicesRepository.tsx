import { Service } from "../Models/Service";
import {IServicesRepository} from "@/app/Repository/Interfaces/IServicesRepository";
import { apiClient } from "@/app/Utils/apiClient";
import { ServiceResponse } from "@/app/Types/apiTypes";

export class ServicesRepository implements IServicesRepository {
    private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    async GetServices(): Promise<Service[]> {
        try {
            const response: ServiceResponse[] = await apiClient.get('/services');
            
            // Converte as respostas da API para o modelo Service
            const services: Service[] = response.map(service => ({
                id: service.id,
                name: service.name,
                icon: service.icon || '',
                description: service.description,
                subServices: service.subServices || []
            }));

            return services;
        } catch (error) {
            console.error('Get services error:', error);
            return [];
        }
    }

    async AddService(service: Service): Promise<boolean> {
        try {
            await apiClient.post('/services', {
                name: service.name,
                icon: service.icon,
                description: service.description,
                subServices: service.subServices
            });
            return true;
        } catch (error) {
            console.error('Add service error:', error);
            return false;
        }
    }

    async updateService(service: Service): Promise<boolean> {
        try {
            await apiClient.put(`/services/${service.id}`, {
                name: service.name,
                icon: service.icon,
                description: service.description,
                subServices: service.subServices
            });
            return true;
        } catch (error) {
            console.error('Update service error:', error);
            return false;
        }
    }

    async deleteService(serviceId: string): Promise<boolean> {
        try {
            await apiClient.delete(`/services/${serviceId}`);
            return true;
        } catch (error) {
            console.error('Delete service error:', error);
            return false;
        }
    }
}
