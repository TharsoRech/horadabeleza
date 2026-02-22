import { Professional } from "@/app/Models/Professional";
import { Review } from "@/app/Models/Review";
import { Salon } from "@/app/Models/Salon";

export interface IProfessionalRepository {
    getProfessionalReviews(professionalId: string): Promise<Review[]>;
    getSalonByProfessional(salonId: string): Promise<Salon | null>;
    canUserReviewProfessional(professionalId: string, userId: string): Promise<boolean>;
    addProfessionalReview(
        professionalId: string,
        userId: string,
        userName: string,
        review: Partial<Review>
    ): Promise<Review>;
}