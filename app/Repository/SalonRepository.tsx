import {Salon} from '../Models/Salon';
import {ISalonRepository} from "@/app/Repository/Interfaces/ISalonRepository";
import {Service} from "@/app/Models/Service";
import {Category} from "@/app/Models/Category";
import {Professional} from "@/app/Models/Professional";
import {Review} from "@/app/Models/Review";
import {apiClient} from "@/app/Utils/apiClient";
import {
    AppointmentResponse,
    CategoryResponse,
    ProfessionalResponse,
    ReviewResponse,
    SalonResponse,
    ServiceResponse
} from "@/app/Types/apiTypes";

export class SalonRepository implements ISalonRepository {
    private normalizeGallery(raw?: string[] | string): string[] {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        return raw
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }

    private mapSalon(response: SalonResponse): Salon {
        return {
            id: String(response.id),
            name: response.name,
            address: [response.address, response.city, response.state].filter(Boolean).join(' - ') || response.address,
            rating: response.rating || "0",
            reviews: response.reviews || 0,
            image: response.image || response.logoUrl,
            serviceIds: (response.serviceIds || []).map(id => String(id)),
            professionalIds: (response.professionalIds || []).map(id => String(id)),
            whatsApp: response.whatsApp,
            phone: response.phone,
            description: response.description,
            userHasVisited: response.userHasVisited || false,
            gallery: this.normalizeGallery(response.gallery),
            published: response.published ?? response.active ?? false,
            isAdmin: response.isAdmin || false
        };
    }

    private mapProfessional(response: ProfessionalResponse): Professional {
        return {
            id: String(response.id),
            name: response.name || response.userName || '',
            specialty: response.specialty || '',
            rating: response.rating ?? response.averageRating ?? 0,
            reviews: response.reviews ?? response.totalReviews ?? 0,
            bio: response.bio || '',
            image: response.image || response.photoUrl,
            serviceIds: (response.serviceIds || []).map(id => String(id)),
            availableTimes: response.availableTimes || [],
            cpf: response.cpf || '',
            isAdmin: response.isAdmin || false
        };
    }

    private mapReview(response: ReviewResponse): Review {
        return {
            id: String(response.id),
            salonId: response.salonId || '',
            professionalId: response.professionalId || '',
            userId: response.userId || '',
            userName: response.userName || response.clientName || 'Cliente',
            rating: response.rating,
            comment: response.comment || '',
            createdAt: response.createdAt
        };
    }

    private mapFlatServicesToCategories(services: ServiceResponse[]): Service[] {
        const grouped = new Map<string, Service>();

        services.forEach((item) => {
            const categoryKey = String(item.categoryId ?? item.id);
            if (!grouped.has(categoryKey)) {
                grouped.set(categoryKey, {
                    id: categoryKey,
                    name: item.categoryName || item.name,
                    icon: item.icon || 'cut-outline',
                    description: item.description || '',
                    subServices: []
                });
            }

            const group = grouped.get(categoryKey)!;
            const hasSubServices = (item.subServices || []).length > 0;

            if (hasSubServices) {
                item.subServices!.forEach((sub) => {
                    group.subServices.push({
                        id: String(sub.id),
                        name: sub.name,
                        price: Number(sub.price || 0),
                        duration: sub.duration,
                        description: sub.description || ''
                    });
                });
                return;
            }

            // Endpoint de listagem de serviços por salão retorna linhas "flat".
            if (item.price !== undefined || item.durationMinutes !== undefined) {
                group.subServices.push({
                    id: String(item.id),
                    name: item.name,
                    price: Number(item.price || 0),
                    duration: `${item.durationMinutes || 0} min`,
                    description: item.description || ''
                });
            }
        });

        return Array.from(grouped.values());
    }

    private parseDurationToMinutes(duration: string): number {
        const match = (duration || '').match(/\d+/);
        return match ? Number(match[0]) : 0;
    }

    private parseAddressParts(address: string): { address: string; city: string; state: string } {
        const parts = (address || '').split(',').map(part => part.trim()).filter(Boolean);
        if (parts.length >= 3) {
            return {
                address: `${parts[0]}, ${parts[1]}`,
                city: parts[2],
                state: parts[3] || 'SP'
            };
        }

        return {
            address: address || 'Endereço não informado',
            city: 'São Paulo',
            state: 'SP'
        };
    }

    async getSalonById(salonId: string): Promise<Salon | null> {
        try {
            const response: SalonResponse = await apiClient.get(`/salons/${salonId}`);
            return this.mapSalon(response);
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
    async getSalonServices(serviceIds: string[], salonId?: string): Promise<Service[]> {
        try {
            if (salonId) {
                const flatServices: ServiceResponse[] = await apiClient.get(`/salons/${salonId}/services`);
                return this.mapFlatServicesToCategories(flatServices);
            }

            if (!serviceIds || serviceIds.length === 0) {
                return [];
            }

            const response: ServiceResponse[] = await apiClient.get(`/salons/services/${serviceIds.join(',')}`);
            return this.mapFlatServicesToCategories(response);
        } catch (error) {
            console.error('Get salon services error:', error);
            return [];
        }
    }

    /**
     * Retorna apenas os profissionais vinculados a um salão específico.
     */
    async getSalonProfessionals(professionalIds: string[], salonId?: string): Promise<Professional[]> {
        try {
            if (salonId) {
                const bySalon: ProfessionalResponse[] = await apiClient.get(`/professionals/salons/${salonId}`);
                return bySalon.map(prof => this.mapProfessional(prof));
            }

            if (!professionalIds || professionalIds.length === 0) {
                return [];
            }

            const response: ProfessionalResponse[] = await apiClient.get(`/salons/professionals/${professionalIds.join(',')}`);
            return response.map(prof => this.mapProfessional(prof));
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
                id: String(category.id),
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
            return response.map(salon => this.mapSalon(salon));
        } catch (error) {
            console.error('Get popular salons error:', error);
            return [];
        }
    }

    async getTopProfessionals(): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get('/professionals/top');
            return response.map(prof => this.mapProfessional(prof));
        } catch (error) {
            console.error('Get top professionals error:', error);
            return [];
        }
    }

    // --- SISTEMA DE BUSCA E PAGINAÇÃO ---

    async searchAll(query: string, filter: string, page: number = 1, limit: number = 5, city?: string, state?: string, latitude?: number, longitude?: number): Promise<(Salon | Professional)[]> {
        try {
            const params = new URLSearchParams();
            
            // Se a query estiver vazia, não adiciona o parâmetro query (null)
            if (query && query.trim()) {
                params.append('query', encodeURIComponent(query.trim()));
            }
            
            params.append('filter', filter);
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            // Add optional location parameters if provided and not empty
            if (city && city.trim()) params.append('city', city);
            if (state && state.trim()) params.append('state', state);
            if (latitude !== undefined && latitude !== null) params.append('latitude', latitude.toString());
            if (longitude !== undefined && longitude !== null) params.append('longitude', longitude.toString());

            const response: any[] = await apiClient.get(`/search?${params.toString()}`);
            
            // Converte as respostas da API para os modelos Salon e Professional
            return response.map(item => {
                if (item.type === 'salon') {
                    return {
                        id: String(item.id),
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
                        id: String(item.id),
                        name: item.name || item.userName,
                        specialty: item.specialty || '',
                        rating: item.rating ?? item.averageRating ?? 0,
                        reviews: item.reviews ?? item.totalReviews ?? 0,
                        bio: item.bio || '',
                        image: item.image || item.photoUrl,
                        serviceIds: (item.serviceIds || []).map((id: string | number) => String(id)),
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
            return response.map(review => this.mapReview(review));
        } catch (error) {
            console.error('Get salon reviews error:', error);
            return [];
        }
    }

    async getAvailableTimes(professionalId: string, date: string): Promise<string[]> {
        try {
            const response: { times?: string[]; availableTimes?: string[] } = await apiClient.get(`/professionals/${professionalId}/availability?date=${date}`);
            return response.availableTimes || response.times || [];
        } catch (error) {
            console.error('Get available times error:', error);
            return [];
        }
    }

    async getMyUnits(): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get('/salons/my-units');
            return response.map(salon => this.mapSalon(salon));
        } catch (error) {
            console.error('Get my units error:', error);
            return [];
        }
    }

    async getSalonsByProfessional(professionalId: string): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get(`/professionals/${professionalId}/salons`);
            return response.map(salon => this.mapSalon(salon));
        } catch (error) {
            console.error('Get salons by professional error:', error);
            return [];
        }
    }

    async getTopProfessionalsByLocation(city: string, state: string, latitude: number, longitude: number): Promise<Professional[]> {
        try {
            const response: ProfessionalResponse[] = await apiClient.get(`/professionals/top/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&latitude=${latitude}&longitude=${longitude}`);
            return response.map(prof => this.mapProfessional(prof));
        } catch (error) {
            console.error('Get top professionals by location error:', error);
            return [];
        }
    }

    async getTopSalonsByLocation(city: string, state: string, latitude: number, longitude: number): Promise<Salon[]> {
        try {
            const response: SalonResponse[] = await apiClient.get(`/salons/top/location?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&latitude=${latitude}&longitude=${longitude}`);
            return response.map(salon => this.mapSalon(salon));
        } catch (error) {
            console.error('Get top salons by location error:', error);
            return [];
        }
    }

    async createUnit(input: {
        name: string;
        description?: string;
        address: string;
        phone?: string;
        whatsApp?: string;
        image?: string;
        gallery?: string[];
        published?: boolean;
    }): Promise<Salon> {
        const addr = this.parseAddressParts(input.address);
        const payload = {
            name: input.name,
            description: input.description,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            zipCode: null,
            latitude: null,
            longitude: null,
            phone: input.phone,
            email: null,
            businessHours: null,
            whatsApp: input.whatsApp,
            logoUrl: input.image,
            gallery: (input.gallery || []).join(','),
            published: input.published ?? true
        };

        const response: SalonResponse = await apiClient.post('/salons', payload);
        return this.mapSalon(response);
    }

    async updateUnit(salonId: string, input: {
        name: string;
        description?: string;
        address: string;
        phone?: string;
        whatsApp?: string;
        image?: string;
        gallery?: string[];
        published?: boolean;
    }): Promise<Salon> {
        const addr = this.parseAddressParts(input.address);
        const payload = {
            name: input.name,
            description: input.description,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            zipCode: null,
            latitude: null,
            longitude: null,
            phone: input.phone,
            email: null,
            businessHours: null,
            whatsApp: input.whatsApp,
            logoUrl: input.image,
            gallery: (input.gallery || []).join(','),
            published: input.published ?? true
        };

        const response: SalonResponse = await apiClient.put(`/salons/${salonId}`, payload);
        return this.mapSalon(response);
    }

    async deleteUnit(salonId: string): Promise<void> {
        await apiClient.delete(`/salons/${salonId}`);
    }

    async syncSalonServices(salonId: string, categories: Service[]): Promise<Service[]> {
        const existingFlat: ServiceResponse[] = await apiClient.get(`/salons/${salonId}/services`);
        const categoriesFromApi: CategoryResponse[] = await apiClient.get('/categories');

        const existingById = new Map(existingFlat.map(item => [String(item.id), item]));
        const existingIds = new Set(existingFlat.map(item => String(item.id)));
        const keptIds = new Set<string>();

        const resolveCategoryId = (category: Service): number => {
            const numericId = Number(category.id);
            if (!Number.isNaN(numericId) && categoriesFromApi.some(c => Number(c.id) === numericId)) {
                return numericId;
            }

            const byName = categoriesFromApi.find(c => c.name.trim().toLowerCase() === category.name.trim().toLowerCase());
            if (byName) return Number(byName.id);

            return Number(categoriesFromApi[0]?.id || 1);
        };

        for (const category of categories) {
            const categoryId = resolveCategoryId(category);
            for (const sub of category.subServices || []) {
                const subId = String(sub.id || '');
                const maybeExisting = existingById.get(subId);
                const durationMinutes = this.parseDurationToMinutes(sub.duration);

                const payload = {
                    categoryId,
                    name: sub.name,
                    description: sub.description || category.description || null,
                    price: Number(sub.price || 0),
                    durationMinutes
                };

                if (maybeExisting) {
                    keptIds.add(subId);
                    await apiClient.put(`/salons/${salonId}/services/${subId}`, {
                        name: payload.name,
                        description: payload.description,
                        price: payload.price,
                        durationMinutes: payload.durationMinutes,
                        active: true
                    });
                } else {
                    const created: ServiceResponse = await apiClient.post(`/salons/${salonId}/services`, payload);
                    keptIds.add(String(created.id));
                }
            }
        }

        for (const existingId of existingIds) {
            if (!keptIds.has(existingId)) {
                await apiClient.delete(`/salons/${salonId}/services/${existingId}`);
            }
        }

        const refreshed: ServiceResponse[] = await apiClient.get(`/salons/${salonId}/services`);
        return this.mapFlatServicesToCategories(refreshed);
    }

    async syncSalonProfessionals(salonId: string, professionals: Professional[]): Promise<Professional[]> {
        const current = await this.getSalonProfessionals([], salonId);
        const currentById = new Map(current.map(p => [p.id, p]));
        const currentIds = new Set(current.map(p => p.id));
        const keptIds = new Set<string>();

        for (const professional of professionals) {
            const idNum = Number(professional.id);
            const availableTimes = Array.from(new Set(professional.availableTimes || [])).sort();

            if (!Number.isNaN(idNum) && currentById.has(String(idNum))) {
                keptIds.add(String(idNum));
                await apiClient.put(`/professionals/${idNum}`, {
                    salonId: Number(salonId),
                    specialty: professional.specialty,
                    bio: professional.bio,
                    isAdmin: professional.isAdmin,
                    availableTimes
                });
                continue;
            }

            await apiClient.post(`/professionals/salons/${salonId}/by-doc`, {
                doc: professional.cpf,
                specialty: professional.specialty,
                bio: professional.bio,
                isAdmin: professional.isAdmin,
                availableTimes
            });
        }

        for (const currentId of currentIds) {
            if (!keptIds.has(currentId)) {
                await apiClient.delete(`/professionals/${currentId}`);
            }
        }

        return this.getSalonProfessionals([], salonId);
    }

    async createAppointment(input: {
        professionalId: string;
        serviceId: string;
        salonId: string;
        scheduledAt: string;
        notes?: string;
    }): Promise<void> {
        await apiClient.post('/appointments', {
            professionalId: Number(input.professionalId),
            serviceId: Number(input.serviceId),
            salonId: Number(input.salonId),
            scheduledAt: input.scheduledAt,
            notes: input.notes || null
        });
    }

    async createSalonReview(input: { salonId: string; rating: number; comment?: string }): Promise<Review> {
        const appointments: AppointmentResponse[] = await apiClient.get('/appointments/mine');

        const completedForSalon = appointments
            .filter(app => String(app.salonId) === String(input.salonId))
            .filter(app => {
                if (typeof app.status === 'number') return app.status === 4;
                return String(app.status).toLowerCase() === 'completed' || String(app.status) === '4';
            })
            .sort((a, b) => {
                const aDate = new Date((a.scheduledAt || a.date || '') as string).getTime();
                const bDate = new Date((b.scheduledAt || b.date || '') as string).getTime();
                return bDate - aDate;
            });

        const appointment = completedForSalon[0];
        if (!appointment) {
            throw new Error('Você precisa concluir um atendimento neste salão antes de avaliar.');
        }

        const response: ReviewResponse = await apiClient.post('/reviews', {
            appointmentId: Number(appointment.id),
            rating: input.rating,
            comment: input.comment || null
        });

        return this.mapReview(response);
    }
}
