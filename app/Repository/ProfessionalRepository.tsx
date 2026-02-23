import { IProfessionalRepository } from "./Interfaces/IProfessionalRepository";
import { Review, MOCK_REVIEWS } from "@/app/Models/Review";
import { Salon, MOCK_SALONS_LIST } from "@/app/Models/Salon";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";
import {MOCK_PROFESSIONALS_LIST, Professional} from "../Models/Professional";

export class ProfessionalRepository implements IProfessionalRepository {
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
        // MOCK_PROFESSIONALS_LIST deve estar acessível/importado
        const found = MOCK_PROFESSIONALS_LIST.find(p => p.id === profId);

        if (!found) return null;

        return await this._attachProfessionalImage(found);
    }
    private imageCache: Map<string, string> = new Map();

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
        return new Promise((resolve) => {
            // Filtra reviews onde o professionalId coincide
            const filtered = MOCK_REVIEWS.filter(r => r.salonId === professionalId);
            setTimeout(() => resolve(filtered), 300);
        });
    }

    /**
     * Busca o salão vinculado para renderizar o SalonCard
     */
    async getSalonByProfessional(salonId: string): Promise<Salon | null> {
        const salon = MOCK_SALONS_LIST.find(s => s.id === salonId);
        if (!salon) return null;
        return await this._attachSalonImage(salon);
    }

    /**
     * Verifica se o usuário tem permissão para avaliar (Regra de negócio)
     */
    async canUserReviewProfessional(professionalId: string, userId: string): Promise<boolean> {
        return new Promise((resolve) => {
            // Simulação: Apenas profissionais com ID par permitem review no Mock
            const canReview = parseInt(professionalId) % 2 === 0;
            setTimeout(() => resolve(canReview), 200);
        });
    }

    async addProfessionalReview(
        professionalId: string,
        userId: string,
        userName: string,
        review: Partial<Review>
    ): Promise<Review> {
        return new Promise((resolve, reject) => {
            try {
                const newReview: Review = {
                    id: Math.random().toString(36).substring(2, 9),
                    salonId: "",
                    professionalId: professionalId,
                    userId: userId, 
                    userName: userName, 
                    rating: review.rating || 5,
                    comment: review.comment || "",
                    createdAt: new Date().toISOString()
                };

                setTimeout(() => {
                    resolve(newReview);
                }, 800);
            } catch (error) {
                reject(new Error("Erro ao publicar avaliação"));
            }
        });
    }
}