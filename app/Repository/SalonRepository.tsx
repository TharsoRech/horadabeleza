import { Salon } from '../Models/Salon';
import { ISalonRepository } from "@/app/Repository/Interfaces/ISalonRepository";
import { Service } from "@/app/Models/Service";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import { Professional } from "@/app/Models/Professional";
import { Review } from "@/app/Models/Review";
import { apiClient } from "@/app/Utils/apiClient";
import { SalonResponse, ProfessionalResponse, ServiceResponse, ReviewResponse } from "@/app/Types/apiTypes";

export class SalonRepository implements ISalonRepository {
    async getSalonById(salonId: string): Promise<Salon | null> {
        try {
            const response: SalonResponse = await apiClient.get(`/salons/${salonId}`);
            
            // Converte a resposta da API para o modelo Salon
            const salon: Salon = {
                id: response.id,
                name: response.name,
                address: response.address,
                rating: response.rating || "0",
                reviews: response.reviews || 0,
                image: response.image,
                serviceIds: response.serviceIds,
                professionalIds: response.professionalIds,
                whatsApp: response.whatsApp,
                phone: response.phone,
                description: response.description,
                userHasVisited: response.userHasVisited || false,
                gallery: response.gallery || [],
                published: response.published || false,
                isAdmin: response.isAdmin || false
            };

            return salon;
        } catch (error) {
            console.error('Get salon error:', error);
            return null;
        }
    }

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
        try {
            const response: ServiceResponse[] = await apiClient.get(`/salons/services/${serviceIds.join(',')}`);
            
            // Converte as respostas da API para o modelo Service
            const services: Service[] = response.map(service => ({
                id: service.id,
                name: service.name,
                icon: service.icon || '',
                description: service.description,
                subServices: service.subServices || []
            }));

            return services;
        } catch (error) {
            console.error('Get salon services error:', error);
            return [];
        }
    }

    /**
     * Retorna apenas os profissionais vinculados a um salão específico.
     */
    async getSalonProfessionals(professionalIds: string[]): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get(`/salons/professionals/${professionalIds.join(',')}`);
            
            // Converte as respostas da API para o modelo Professional
            const professionals: Professional[] = response.map(prof => ({
                id: prof.id,
                name: prof.name,
                specialty: prof.specialty,
                rating: prof.rating || 0,
                reviews: prof.reviews || 0,
                bio: prof.bio || '',
                image: prof.image,
                serviceIds: prof.serviceIds,
                availableTimes: prof.availableTimes || [],
                cpf: prof.cpf || '',
                isAdmin: prof.isAdmin || false
            }));

            return professionals;
        } catch (error) {
            console.error('Get salon professionals error:', error);
            return [];
        }
    }

    // --- MÉTODOS DE CARGA INICIAL (HOME) ---

    async getServices(): Promise<Service[]> {
        try {
            const response: ServiceResponse[] = await apiClient.get('/services');
            
            // Converte as respostas da API para o modelo Service
            const services: Service[] = response.map(service => ({
                id: service.id,
                name: service.name,
                icon: service.icon || '',
                description: service.description,
                subServices: service.subServices || []
            }));

            return services;
        } catch (error) {
            console.error('Get services error:', error);
            return [];
        }
    }

    async getPopularSalons(): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get('/salons/popular');
            
            // Converte as respostas da API para o modelo Salon
            const salons: Salon[] = response.map(salon => ({
                id: salon.id,
                name: salon.name,
                address: salon.address,
                rating: salon.rating || "0",
                reviews: salon.reviews || 0,
                image: salon.image,
                serviceIds: salon.serviceIds,
                professionalIds: salon.professionalIds,
                whatsApp: salon.whatsApp,
                phone: salon.phone,
                description: salon.description,
                userHasVisited: salon.userHasVisited || false,
                gallery: salon.gallery || [],
                published: salon.published || false,
                isAdmin: salon.isAdmin || false
            }));

            return salons;
        } catch (error) {
            console.error('Get popular salons error:', error);
            return [];
        }
    }

    async getTopProfessionals(): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get('/professionals/top');
            
            // Converte as respostas da API para o modelo Professional
            const professionals: Professional[] = response.map(prof => ({
                id: prof.id,
                name: prof.name,
                specialty: prof.specialty,
                rating: prof.rating || 0,
                reviews: prof.reviews || 0,
                bio: prof.bio || '',
                image: prof.image,
                serviceIds: prof.serviceIds,
                availableTimes: prof.availableTimes || [],
                cpf: prof.cpf || '',
                isAdmin: prof.isAdmin || false
            }));

            return professionals;
        } catch (error) {
            console.error('Get top professionals error:', error);
            return [];
        }
    }

    // --- SISTEMA DE BUSCA E PAGINAÇÃO ---

    async searchAll(query: string, filter: string, page: number = 1): Promise<(Salon | Professional)[]> {
        try {
            const limit = 5;
            const params = new URLSearchParams({
                query,
                filter,
                page: page.toString(),
                limit: limit.toString()
            });

            const response: any[] = await apiClient.get(`/search?${params.toString()}`);
            
            // Converte as respostas da API para os modelos Salon e Professional
            const results: (Salon | Professional)[] = response.map(item => {
                if (item.type === 'salon') {
                    return {
                        id: item.id,
                        name: item.name,
                        address: item.address,
                        rating: item.rating || "0",
                        reviews: item.reviews || 0,
                        image: item.image,
                        serviceIds: item.serviceIds,
                        professionalIds: item.professionalIds,
                        whatsApp: item.whatsApp,
                        phone: item.phone,
                        description: item.description,
                        userHasVisited: item.userHasVisited || false,
                        gallery: item.gallery || [],
                        published: item.published || false,
                        isAdmin: item.isAdmin || false
                    } as Salon;
                } else {
                    return {
                        id: item.id,
                        name: item.name,
                        specialty: item.specialty,
                        rating: item.rating || 0,
                        reviews: item.reviews || 0,
                        bio: item.bio || '',
                        image: item.image,
                        serviceIds: item.serviceIds,
                        availableTimes: item.availableTimes || [],
                        cpf: item.cpf || '',
                        isAdmin: item.isAdmin || false
                    } as Professional;
                }
            });

            return results;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    async getSalonReviews(salonId: string): Promise<Review[]> {
        try {
            const response: ReviewResponse[] = await apiClient.get(`/salons/${salonId}/reviews`);
            
            // Converte as respostas da API para o modelo Review
            const reviews: Review[] = response.map(review => ({
                id: review.id,
                salonId: review.salonId || '',
                professionalId: review.professionalId || '',
                userId: review.userId,
                userName: review.userName,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }));

            return reviews;
        } catch (error) {
            console.error('Get salon reviews error:', error);
            return [];
        }
    }

    async getAvailableTimes(professionalId: string, date: string): Promise<string[]> {
        try {
            const response: { times: string[] } = await apiClient.get(`/professionals/${professionalId}/availability?date=${date}`);
            return response.times || [];
        } catch (error) {
            console.error('Get available times error:', error);
            return [];
        }
    }

    async getMyUnits(): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get('/salons/my-units');
            
            // Converte as respostas da API para o modelo Salon
            const salons: Salon[] = response.map(salon => ({
                id: salon.id,
                name: salon.name,
                address: salon.address,
                rating: salon.rating || "0",
                reviews: salon.reviews || 0,
                image: salon.image,
                serviceIds: salon.serviceIds,
                professionalIds: salon.professionalIds,
                whatsApp: salon.whatsApp,
                phone: salon.phone,
                description: salon.description,
                userHasVisited: salon.userHasVisited || false,
                gallery: salon.gallery || [],
                published: salon.published || false,
                isAdmin: salon.isAdmin || false
            }));

            return salons;
        } catch (error) {
            console.error('Get my units error:', error);
            return [];
        }
    }

    async getSalonsByProfessional(professionalId: string): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get(`/professionals/${professionalId}/salons`);
            
            // Converte as respostas da API para o modelo Salon
            const salons: Salon[] = response.map(salon => ({
                id: salon.id,
                name: salon.name,
                address: salon.address,
                rating: salon.rating || "0",
                reviews: salon.reviews || 0,
                image: salon.image,
                serviceIds: salon.serviceIds,
                professionalIds: salon.professionalIds,
                whatsApp: salon.whatsApp,
                phone: salon.phone,
                description: salon.description,
                userHasVisited: salon.userHasVisited || false,
                gallery: salon.gallery || [],
                published: salon.published || false,
                isAdmin: salon.isAdmin || false
            }));

            return salons;
        } catch (error) {
            console.error('Get salons by professional error:', error);
            return [];
        }
    }
}
