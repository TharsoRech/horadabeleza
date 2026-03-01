import {Service} from "@/app/Models/Service";

export interface IServicesRepository {
    updateService(Service: Service): Promise<boolean>;
    
    deleteService(serviceId: string): Promise<boolean>;

   AddService(Service: Service): Promise<boolean>;

    GetServices(): Promise<Service[]>;
}