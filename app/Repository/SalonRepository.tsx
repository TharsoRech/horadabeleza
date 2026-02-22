import { Salon, MOCK_SALONS_LIST } from '../Models/Salon';
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { Service, MOCK_SERVICES } from "@/app/Models/Service";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import { MOCK_PROFESSIONALS_LIST, Professional } from "@/app/Models/Professional";
import {MOCK_REVIEWS, Review} from "@/app/Models/Review";

export class SalonRepository implements ISalonRepository {
    // Cache para evitar que o Base64 seja re-gerado, prevenindo que as imagens "pisquem"
    private imageCache: Map<string, string> = new Map();

    /**
     * Processa itens (Salões ou Profissionais) e anexa a imagem em Base64.
     * Usa cache interno para performance.
     */
    private async _attachImages(items: (Salon | Professional)[]): Promise<(Salon | Professional)[]> {
        const salonPhotos = [
            require('@/assets/images/salon1.jpg'),
            require('@/assets/images/salon2.jpg')
        ];
        const profPhotos = [
            require('@/assets/images/person1.jpg'),
            require('@/assets/images/person2.jpg')
        ];

        return Promise.all(items.map(async (item, index) => {
            const isProfessional = 'specialty' in item;
            const cacheKey = `${isProfessional ? 'p' : 's'}-${item.id}`;

            // Retorna do cache se já existir
            if (this.imageCache.has(cacheKey)) {
                return { ...item, image: this.imageCache.get(cacheKey) };
            }

            const photoAsset = isProfessional
                ? profPhotos[index % profPhotos.length]
                : salonPhotos[index % salonPhotos.length];

            try {
                const base64 = await imageToBase64(photoAsset);
                if (base64) {
                    this.imageCache.set(cacheKey, base64);
                    return { ...item, image: base64 };
                }
                return item;
            } catch (e) {
                console.warn(`Erro ao converter imagem para ${cacheKey}:`, e);
                return item;
            }
        }));
    }

    // --- MÉTODOS PARA O MODAL DE DETALHES ---

    /**
     * Retorna apenas os serviços vinculados a um salão específico.
     */
    async getSalonServices(serviceIds: string[]): Promise<Service[]> {
        return new Promise((resolve) => {
            const filtered = MOCK_SERVICES.filter(s => serviceIds.includes(s.id));
            // Simula delay de rede
            setTimeout(() => resolve(filtered), 200);
        });
    }

    /**
     * Retorna apenas os profissionais vinculados a um salão específico.
     */
    async getSalonProfessionals(professionalIds: string[]): Promise<Professional[]> {
        const pros = MOCK_PROFESSIONALS_LIST.filter(p => professionalIds.includes(p.id));
        return (await this._attachImages(pros)) as Professional[];
    }

    // --- MÉTODOS DE CARGA INICIAL (HOME) ---

    async getServices(): Promise<Service[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_SERVICES), 300);
        });
    }

    async getPopularSalons(): Promise<Salon[]> {
        // Pega os 3 primeiros para a Home
        return (await this._attachImages(MOCK_SALONS_LIST.slice(0, 3))) as Salon[];
    }

    async getTopProfessionals(): Promise<Professional[]> {
        // Pega os 3 primeiros para a Home
        return (await this._attachImages(MOCK_PROFESSIONALS_LIST.slice(0, 3))) as Professional[];
    }

    // --- SISTEMA DE BUSCA E PAGINAÇÃO ---

    async searchAll(query: string, filter: string, page: number = 1): Promise<(Salon | Professional)[]> {
        const limit = 5;
        const text = query.toLowerCase().trim();

        // 1. Define o pool de dados baseado no filtro selecionado
        let dataPool: (Salon | Professional)[] = [];
        if (filter === 'Salão') {
            dataPool = MOCK_SALONS_LIST;
        } else if (filter === 'Pessoas') {
            dataPool = MOCK_PROFESSIONALS_LIST;
        } else if (filter === 'Serviço') {
            // Se for serviço, busca em ambos os pools
            dataPool = [...MOCK_SALONS_LIST, ...MOCK_PROFESSIONALS_LIST];
        }

        // 2. Filtra os dados
        const filtered = dataPool.filter(item => {
            // Se a query estiver vazia (caso do "Ver Todos"), retorna tudo do pool
            if (text === "") return true;

            // Se o filtro for 'Serviço', checa se o item possui o ID do serviço buscado
            if (filter === 'Serviço') {
                const serviceMatch = MOCK_SERVICES.find(s => s.name.toLowerCase().includes(text));
                if (serviceMatch && item.serviceIds.includes(serviceMatch.id)) return true;
            }

            // Busca padrão por nome do salão ou profissional
            return item.name.toLowerCase().includes(text);
        });

        // 3. Simula delay para exibição de Skeletons
        await new Promise(resolve => setTimeout(resolve, 450));

        // 4. Aplica a paginação (slice)
        const startIndex = (page - 1) * limit;
        const slice = filtered.slice(startIndex, startIndex + limit);

        // 5. Anexa as imagens processadas
        return await this._attachImages(slice);
    }

    async getSalonReviews(salonId: string): Promise<Review[]> {
        return new Promise((resolve) => {
            // Filtra as reviews que pertencem ao salão específico
            const filtered = MOCK_REVIEWS.filter(r => r.salonId === salonId);

            // Simula um pequeno delay de rede
            setTimeout(() => resolve(filtered), 300);
        });
    }

    async getAvailableTimes(professionalId: string, date: string): Promise<string[]> {
        return new Promise((resolve) => {
            const timePool = [
                "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
                "16:00", "16:30", "17:00", "17:30", "18:00"
            ];
            
            const dayOfWeek = new Date(date).getDay();
            
            if (dayOfWeek === 0) {
                setTimeout(() => resolve([]), 400);
                return;
            }
            
            const filteredTimes = timePool.filter((_, index) => {
                const seed = (professionalId.length + index + dayOfWeek);
                return seed % 3 !== 0; 
            });
            
            setTimeout(() => resolve(filteredTimes), 500);
        });
    }
}