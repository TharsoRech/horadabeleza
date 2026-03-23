import {Salon} from "@/app/Models/Salon";
import {Category} from "@/app/Models/Category";
import {Professional} from "@/app/Models/Professional";
import {Service} from "@/app/Models/Service";
import {Review} from "@/app/Models/Review";

export interface ISalonRepository {
    getPopularSalons(): Promise<Salon[]>;
    getCategories(): Promise<Category[]>;
    getTopProfessionals(): Promise<Professional[]>
    getSalonServices(serviceIds: string[], salonId?: string): Promise<Service[]>
    getSalonProfessionals(professionalIds: string[], salonId?: string): Promise<Professional[]>
    getSalonReviews(salonId: string): Promise<Review[]>
    getAvailableTimes(professionalId: string, date: string): Promise<string[]>
    getSalonById(salonId: string): Promise<Salon | null>
    searchAll(query: string, filter: string, page: number, limit?: number, city?: string, state?: string, latitude?: number, longitude?: number): Promise<(Salon | Professional)[]>;
    getMyUnits(): Promise<Salon[]>;
    getSalonsByProfessional(professionalId: string): Promise<Salon[]>;
    getTopProfessionalsByLocation(city: string,state: string, latitude: number, longitude: number): Promise<Professional[]>;
    getTopSalonsByLocation(city: string,state: string, latitude: number, longitude: number): Promise<Salon[]>;
    createUnit(input: { name: string; description?: string; address: string; phone?: string; whatsApp?: string; image?: string; gallery?: string[]; published?: boolean; }): Promise<Salon>;
    updateUnit(salonId: string, input: { name: string; description?: string; address: string; phone?: string; whatsApp?: string; image?: string; gallery?: string[]; published?: boolean; }): Promise<Salon>;
    deleteUnit(salonId: string): Promise<void>;
    syncSalonServices(salonId: string, categories: Service[]): Promise<Service[]>;
    syncSalonProfessionals(salonId: string, professionals: Professional[]): Promise<Professional[]>;
    createAppointment(input: { professionalId: string; serviceId: string; salonId: string; scheduledAt: string; notes?: string; }): Promise<void>;
    createSalonReview(input: { salonId: string; rating: number; comment?: string }): Promise<Review>;
}
