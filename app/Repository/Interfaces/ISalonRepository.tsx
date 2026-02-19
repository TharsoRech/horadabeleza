import {Salon} from "@/app/Models/Salon";
import {Category} from "@/app/Models/Category";
import {Professional} from "@/app/Models/Professional";

export interface ISalonRepository {
    getPopularSalons(): Promise<Salon[]>;
    getServices(): Promise<Category[]>;
    getTopProfessionals(): Promise<Professional[]>
    searchAll(query: string, filter: string, page: number): Promise<(Salon | Professional)[]>;
}