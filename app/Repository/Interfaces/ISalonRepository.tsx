import {Salon} from "@/app/Models/Salon";
import {Category} from "@/app/Models/Category";
import {Professional} from "@/app/Models/Professional";
import {Service} from "@/app/Models/Service";
import {Review} from "@/app/Models/Review";

export interface ISalonRepository {
    getPopularSalons(): Promise<Salon[]>;
    getServices(): Promise<Category[]>;
    getTopProfessionals(): Promise<Professional[]>
    getSalonServices(serviceIds: string[]): Promise<Service[]>
    getSalonProfessionals(professionalIds: string[]): Promise<Professional[]>
    getSalonReviews(salonId: string): Promise<Review[]>
    searchAll(query: string, filter: string, page: number): Promise<(Salon | Professional)[]>;
}