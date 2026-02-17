import { Salon, MOCK_SALONS_LIST } from '../Models/Salon';
import {ISalonRepository} from "@/app/Repository/Interfaces/ISalonRepository";
import {Category,MOCK_CATEGORIES} from "@/app/Models/Category";
import {imageToBase64} from "@/app/Helpers/getBase64FromAsset";
export class SalonRepository implements ISalonRepository {
    getCategories(): Promise<Category[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_CATEGORIES);
            }, 1000); // Simula atraso de rede
        });
    }
    async getPopularSalons(): Promise<Salon[]> {
        const salons = [...MOCK_SALONS_LIST];
        
        const localPhotos = [
            require('@/assets/images/salon1.jpg'),
            require('@/assets/images/salon2.jpg'),
            require('@/assets/images/salon3.jpg'),
        ];
        
        const salonsWithBase64 = await Promise.all(
            salons.map(async (salon, index) => {
                if (localPhotos[index]) {
                    const base64 = await imageToBase64(localPhotos[index]);
                    return { ...salon, image: base64 };
                }
                return salon;
            })
        );

        return salonsWithBase64;
    }
}