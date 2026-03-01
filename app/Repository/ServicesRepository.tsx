import { Service,  MOCK_SERVICES } from "../Models/Service";
import {IServicesRepository} from "@/app/Repository/Interfaces/IServicesRepository";

export class ServicesRepository implements IServicesRepository {
    private services: Service[] = [...MOCK_SERVICES];

    private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    async GetServices(): Promise<Service[]> {
        await this.delay(800); // Simula latência de rede
        return this.services;
    }

    async AddService(service: Service): Promise<boolean> {
        await this.delay(500);
        this.services.push(service);
        return true;
    }

    async updateService(service: Service): Promise<boolean> {
        const index = this.services.findIndex(s => s.id === service.id);
        if (index !== -1) {
            this.services[index] = service;
            return true;
        }
        return false;
    }

    async deleteService(serviceId: string): Promise<boolean> {
        this.services = this.services.filter(s => s.id !== serviceId);
        return true;
    }
}