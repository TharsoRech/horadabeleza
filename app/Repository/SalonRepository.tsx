import {Salon} from '../Models/Salon';
import {ISalonRepository} from "@/app/Repository/Interfaces/ISalonRepository";
import {Service} from "@/app/Models/Service";
import {Category} from "@/app/Models/Category";
import {Professional} from "@/app/Models/Professional";
import {Review} from "@/app/Models/Review";
import {apiClient} from "@/app/Utils/apiClient";
import {
    CategoryResponse,
    ProfessionalResponse,
    ReviewResponse,
    SalonResponse,
    ServiceResponse
} from "@/app/Types/apiTypes";

export class SalonRepository implements ISalonRepository {
    async getSalonById(salonId: string): Promise<Salon | null> {
        try {
            const response: SalonResponse = await apiClient.get(`/salons/${salonId}`);
            
            // Converte a resposta da API para o modelo Salon
            return {
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
        } catch (error) {
            console.error('Get salon error:', error);
            return null;
        }
    }

    // Cache para evitar que o Base64 seja re-gerado, prevenindo que as imagens "pisquem"
    private imageCache: Map<string, string> = new Map();
// --- MÉTODOS PARA O MODAL DE DETALHES ---

    /**
     * Retorna apenas os serviços vinculados a um salão específico.
     */
    async getSalonServices(serviceIds: string[]): Promise<Service[]> {
        try {
            const response: ServiceResponse[] = await apiClient.get(`/salons/services/${serviceIds.join(',')}`);
            
            // Converte as respostas da API para o modelo Service
            return response.map(service => ({
                id: service.id,
                name: service.name,
                icon: service.icon || '',
                description: service.description,
                subServices: service.subServices || []
            }));
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
            return response.map(prof => ({
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
        } catch (error) {
            console.error('Get salon professionals error:', error);
            return [];
        }
    }

    // --- MÉTODOS DE CARGA INICIAL (HOME) ---

    async getCategories(): Promise<Category[]> {
        try {
            console.log('🔍 Starting SalonRepository.getServices call...');
            console.log('📡 API Base URL:', 'http://localhost:5000/api');
            console.log('📡 Full URL:', 'http://localhost:5000/api/categories');
            
            const response: CategoryResponse[] = await apiClient.get('/categories');
            
            console.log('✅ SalonRepository.getServices response received:', response);
            console.log('📊 Response length:', response.length);
            
            // Converte as respostas da API para o modelo Category
            const categories: Category[] = response.map(category => ({
                id: category.id,
                name: category.name,
                icon: category.iconUrl || '',
            }));

            console.log('✅ Categories converted successfully:', categories);
            return categories;
        } catch (error) {
            console.error('❌ Get services error:', error);
            console.error('❌ Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                status: error instanceof Error && 'status' in error ? error.status : 'Unknown',
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            return [];
        }
    }

    async getPopularSalons(): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get('/salons/popular');
            
            // Converte as respostas da API para o modelo Salon
            return response.map(salon => ({
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
        } catch (error) {
            console.error('Get popular salons error:', error);
            return [];
        }
    }

    async getTopProfessionals(): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get('/professionals/top');
            
            // Converte as respostas da API para o modelo Professional
            return response.map(prof => ({
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
            return response.map(item => {
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
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    async getSalonReviews(salonId: string): Promise<Review[]> {
        try {
            const response: ReviewResponse[] = await apiClient.get(`/salons/${salonId}/reviews`);
            
            // Converte as respostas da API para o modelo Review
            return response.map(review => ({
                id: review.id,
                salonId: review.salonId || '',
                professionalId: review.professionalId || '',
                userId: review.userId,
                userName: review.userName,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }));
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
            return response.map(salon => ({
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
        } catch (error) {
            console.error('Get my units error:', error);
            return [];
        }
    }

    async getSalonsByProfessional(professionalId: string): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get(`/professionals/${professionalId}/salons`);
            
            // Converte as respostas da API para o modelo Salon
            return response.map(salon => ({
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
        } catch (error) {
            console.error('Get salons by professional error:', error);
            return [];
        }
    }

    async getTopProfessionalsByLocation(city: string, state: string, latitude: number, longitude: number): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get(`/professionals/top/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&latitude=${latitude}&longitude=${longitude}`);
            
            // Converte as respostas da API para o modelo Professional
            return response.map(prof => ({
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
        } catch (error) {
            console.error('Get top professionals by location error:', error);
            return [];
        }
    }

    async getTopSalonsByLocation(city: string, state: string, latitude: number, longitude: number): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get(`/salons/top/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&latitude=${latitude}&longitude=${longitude}`);
            
            // Converte as respostas da API para o modelo Salon
            return response.map(salon => ({
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
        } catch (error) {
            console.error('Get top salons by location error:', error);
            return [];
        }
    }
}
