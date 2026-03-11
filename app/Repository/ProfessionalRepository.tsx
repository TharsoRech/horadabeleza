import { IProfessionalRepository } from "./Interfaces/IProfessionalRepository";
import { Review } from "@/app/Models/Review";
import { Salon } from "@/app/Models/Salon";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import { Professional } from "../Models/Professional";
import { apiClient } from "@/app/Utils/apiClient";
import { ProfessionalResponse, ReviewResponse, SalonResponse } from "@/app/Types/apiTypes";

export class ProfessionalRepository implements IProfessionalRepository {
    private imageCache: Map<string, string> = new Map();

    /**
     * Helper para processar imagem do profissional (Base64)
     */
    private async _attachProfessionalImage(prof: Professional): Promise<Professional> {
        const profPhotos = [
            require('@/assets/images/person1.jpg'),
            require('@/assets/images/person2.jpg')
        ];

        const cacheKey = `p-${prof.id}`;
        if (this.imageCache.has(cacheKey)) {
            return { ...prof, image: this.imageCache.get(cacheKey) };
        }

        try {
            // Lógica simples de index para o mock
            const photoAsset = profPhotos[0];
            const base64 = await imageToBase64(photoAsset);
            if (base64) {
                this.imageCache.set(cacheKey, base64);
                return { ...prof, image: base64 };
            }
        } catch (e) {
            console.warn("Erro ao processar imagem do profissional", e);
        }
        return prof;
    }

    /**
     * Implementação do getProfessionalById
     */
    async getProfessionalById(profId: string): Promise<Professional | null> {
        try {
            const response: ProfessionalResponse = await apiClient.get(`/professionals/${profId}`);
            
            // Converte a resposta da API para o modelo Professional
            const professional: Professional = {
                id: response.id,
                name: response.name,
                specialty: response.specialty,
                rating: response.rating || 0,
                reviews: response.reviews || 0,
                bio: response.bio || '',
                image: response.image,
                serviceIds: response.serviceIds,
                availableTimes: response.availableTimes || [],
                cpf: response.cpf || '',
                isAdmin: response.isAdmin || false
            };

            return professional;
        } catch (error) {
            console.error('Get professional error:', error);
            return null;
        }
    }

    private async _attachSalonImage(salon: Salon): Promise<Salon> {
        const salonPhotos = [
            require('@/assets/images/salon1.jpg'),
            require('@/assets/images/salon2.jpg')
        ];

        if (this.imageCache.has(`s-${salon.id}`)) {
            return { ...salon, image: this.imageCache.get(`s-${salon.id}`) };
        }

        try {
            const photoAsset = salonPhotos[0]; // Ou lógica de index baseada no ID
            const base64 = await imageToBase64(photoAsset);
            if (base64) {
                this.imageCache.set(`s-${salon.id}`, base64);
                return { ...salon, image: base64 };
            }
        } catch (e) {
            console.warn("Erro ao processar imagem do salão no ProfessionalRepo", e);
        }
        return salon;
    }

    /**
     * Busca reviews específicas do profissional
     */
    async getProfessionalReviews(professionalId: string): Promise<Review[]> {
        try {
            const response: ReviewResponse[] = await apiClient.get(`/professionals/${professionalId}/reviews`);
            
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
            console.error('Get professional reviews error:', error);
            return [];
        }
    }

    /**
     * Busca o salão vinculado para renderizar o SalonCard
     */
    async getSalonByProfessional(salonId: string): Promise<Salon | null> {
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
            console.error('Get salon by professional error:', error);
            return null;
        }
    }

    /**
     * Verifica se o usuário tem permissão para avaliar (Regra de negócio)
     */
    async canUserReviewProfessional(professionalId: string, userId: string): Promise<boolean> {
        try {
            const response: { canReview: boolean } = await apiClient.get(`/professionals/${professionalId}/can-review?userId=${userId}`);
            return response.canReview || false;
        } catch (error) {
            console.error('Check review permission error:', error);
            return false;
        }
    }

    async addProfessionalReview(
        professionalId: string,
        userId: string,
        userName: string,
        review: Partial<Review>
    ): Promise<Review> {
        try {
            const response: ReviewResponse = await apiClient.post(`/professionals/${professionalId}/reviews`, {
                userId,
                userName,
                rating: review.rating || 5,
                comment: review.comment || ""
            });
            
            // Converte a resposta da API para o modelo Review
            const newReview: Review = {
                id: response.id,
                salonId: response.salonId || '',
                professionalId: response.professionalId || '',
                userId: response.userId,
                userName: response.userName,
                rating: response.rating,
                comment: response.comment,
                createdAt: response.createdAt
            };

            return newReview;
        } catch (error) {
            console.error('Add professional review error:', error);
            throw new Error("Erro ao publicar avaliação");
        }
    }
}
