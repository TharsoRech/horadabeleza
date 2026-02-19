import { Salon, MOCK_SALONS_LIST } from '../Models/Salon';
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { Category, MOCK_CATEGORIES } from "@/app/Models/Category";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import { MOCK_PROFESSIONALS_LIST, Professional } from "@/app/Models/Professional";

export class SalonRepository implements ISalonRepository {

    private async _attachImages(items: (Salon | Professional)[]): Promise<(Salon | Professional)[]> {
        const salonPhotos = [
            require('@/assets/images/salon1.jpg'),
            require('@/assets/images/salon2.jpg'),
            require('@/assets/images/salon3.jpg'),
        ];
        const profPhotos = [
            require('@/assets/images/person1.jpg'),
            require('@/assets/images/person2.jpg'),
            require('@/assets/images/person3.jpg'),
        ];

        return Promise.all(
            items.map(async (item, index) => {
                let photoAsset = 'specialty' in item
                    ? profPhotos[index % profPhotos.length]
                    : salonPhotos[index % salonPhotos.length];

                try {
                    const base64 = await imageToBase64(photoAsset);
                    return { ...item, image: base64 };
                } catch (e) {
                    return item;
                }
            })
        );
    }

    getCategories(): Promise<Category[]> {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_CATEGORIES), 500));
    }

    async getPopularSalons(): Promise<Salon[]> {
        return (await this._attachImages(MOCK_SALONS_LIST.slice(0, 3))) as Salon[];
    }

    async getTopProfessionals(): Promise<Professional[]> {
        const results = await this._attachImages(MOCK_PROFESSIONALS_LIST.slice(0, 3));
        return results as Professional[];
    }

    async searchAll(query: string, filter: string, page: number = 1): Promise<(Salon | Professional)[]> {
        const limit = 5; // Reduzi o limite para 5 para você ver o Load More funcionando rápido
        const text = query.toLowerCase();

        let dataPool: (Salon | Professional)[] = [];
        if (filter === 'Salão') dataPool = MOCK_SALONS_LIST;
        else if (filter === 'Pessoas') dataPool = MOCK_PROFESSIONALS_LIST;
        else dataPool = [...MOCK_SALONS_LIST, ...MOCK_PROFESSIONALS_LIST];

        const filtered = dataPool.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(text);
            if ('specialty' in item) return nameMatch || item.specialty.toLowerCase().includes(text);
            return nameMatch;
        });

        const startIndex = (page - 1) * limit;
        const slice = filtered.slice(startIndex, startIndex + limit);
        const results = await this._attachImages(slice);

        return new Promise((resolve) => setTimeout(() => resolve(results), 800));
    }
}