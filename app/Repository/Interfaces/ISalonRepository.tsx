import {Salon} from "@/app/Models/Salon";
import {Category} from "@/app/Models/Category";

export interface ISalonRepository {
    getPopularSalons(): Promise<Salon[]>;
    getCategories(): Promise<Category[]>;
}