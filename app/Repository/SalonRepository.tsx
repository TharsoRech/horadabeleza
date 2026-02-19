import { Salon, MOCK_SALONS_LIST } from '../Models/Salon';
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { Service, MOCK_SERVICES } from "@/app/Models/Service";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import { MOCK_PROFESSIONALS_LIST, Professional } from "@/app/Models/Professional";

export class SalonRepository implements ISalonRepository {
    // Cache simples para evitar que a imagem "pisque" ao re-processar o Base64
    private imageCache: Map<string, string> = new Map();

    private async _attachImages(items: (Salon | Professional)[]): Promise<(Salon | Professional)[]> {
        const salonPhotos = [require('@/assets/images/salon1.jpg'), require('@/assets/images/salon2.jpg')];
        const profPhotos = [require('@/assets/images/person1.jpg'), require('@/assets/images/person2.jpg')];

        return Promise.all(items.map(async (item, index) => {
            const cacheKey = `${'specialty' in item ? 'p' : 's'}-${item.id}`;

            // Se já processamos essa imagem antes, usamos o cache
            if (this.imageCache.has(cacheKey)) {
                return { ...item, image: this.imageCache.get(cacheKey) };
            }

            let photoAsset = 'specialty' in item ? profPhotos[index % profPhotos.length] : salonPhotos[index % salonPhotos.length];
            try {
                const base64 = await imageToBase64(photoAsset);
                this.imageCache.set(cacheKey, base64!); // Salva no cache
                return { ...item, image: base64 };
            } catch (e) {
                return item;
            }
        }));
    }

    async getServices(): Promise<Service[]> {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_SERVICES), 300));
    }

    async getPopularSalons(): Promise<Salon[]> {
        return (await this._attachImages(MOCK_SALONS_LIST.slice(0, 3))) as Salon[];
    }

    async getTopProfessionals(): Promise<Professional[]> {
        return (await this._attachImages(MOCK_PROFESSIONALS_LIST.slice(0, 3))) as Professional[];
    }

    async searchAll(query: string, filter: string, page: number = 1): Promise<(Salon | Professional)[]> {
        const limit = 5;
        const text = query.toLowerCase().trim();

        let dataPool: (Salon | Professional)[] = [];
        if (filter === 'Salão') dataPool = MOCK_SALONS_LIST;
        else if (filter === 'Pessoas') dataPool = MOCK_PROFESSIONALS_LIST;
        else if (filter === 'Serviço') dataPool = [...MOCK_SALONS_LIST, ...MOCK_PROFESSIONALS_LIST];

        const filtered = dataPool.filter(item => {
            // Se não houver query (Ver Todos), retorna tudo do pool
            if (text === "") return true;

            // Se o filtro for serviço, buscamos por serviceIds
            if (filter === 'Serviço') {
                const service = MOCK_SERVICES.find(s => s.name.toLowerCase().includes(text));
                if (service && item.serviceIds.includes(service.id)) return true;
            }

            // Busca padrão por nome
            return item.name.toLowerCase().includes(text);
        });

        // Simulação de delay de rede para o Skeleton aparecer
        await new Promise(resolve => setTimeout(resolve, 400));

        const startIndex = (page - 1) * limit;
        const slice = filtered.slice(startIndex, startIndex + limit);
        return await this._attachImages(slice);
    }
}