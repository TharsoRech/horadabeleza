import { Service } from "../Models/Service";
import {IServicesRepository} from "@/app/Repository/Interfaces/IServicesRepository";
import { apiClient } from "@/app/Utils/apiClient";
import { ServiceResponse } from "@/app/Types/apiTypes";

export class ServicesRepository implements IServicesRepository {
    private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    async GetServices(): Promise<Service[]> {
        try {
            console.log('🔍 Starting GetServices call...');
            console.log('📡 API Base URL:', 'http://localhost:5000/api');
            console.log('📡 Full URL:', 'http://localhost:5000/api/categories');
            
            const response: ServiceResponse[] = await apiClient.get('/categories');
            
            console.log('✅ GetServices response received:', response);
            console.log('📊 Response length:', response.length);
            
            // Converte as respostas da API para o modelo Service
            const services: Service[] = response.map(service => ({
                id: service.id,
                name: service.name,
                icon: service.icon || '',
                description: service.description,
                subServices: service.subServices || []
            }));

            console.log('✅ Services converted successfully:', services);
            return services;
        } catch (error) {
            console.error('❌ Get services error:', error);
            console.error('❌ Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                status: error instanceof Error && 'status' in error ? error.status : 'Unknown',
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
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
