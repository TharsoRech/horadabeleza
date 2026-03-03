import { Appointment, MOCK_Appointment_LIST } from "../Models/Appointment";
import { IAppointmentRepository } from "./Interfaces/IAppointmentRepository";
import { imageToBase64 } from "@/app/Helpers/getBase64FromAsset";

export class AppointmentRepository implements IAppointmentRepository {

    // Cache para performance e evitar flicker (piscar) das imagens
    private imageCache: Map<string, string> = new Map();

    /**
     * Helper privado para processar as imagens dos agendamentos.
     */
    private async _attachImages(items: Appointment[]): Promise<Appointment[]> {
        const salonPhotos = [
            require('@/assets/images/salon1.jpg'),
            require('@/assets/images/salon2.jpg')
        ];

        return Promise.all(items.map(async (item, index) => {
            const cacheKey = `appt-salon-${item.salonId}`;

            if (this.imageCache.has(cacheKey)) {
                return { ...item, salonImage: this.imageCache.get(cacheKey)! };
            }

            const photoAsset = salonPhotos[index % salonPhotos.length];

            try {
                const base64 = await imageToBase64(photoAsset);
                if (base64) {
                    this.imageCache.set(cacheKey, base64);
                    return { ...item, salonImage: base64 };
                }
                return item;
            } catch (e) {
                console.warn(`Erro ao converter imagem para agendamento ${item.id}:`, e);
                return item;
            }
        }));
    }

    // --- MÉTODOS IMPLEMENTADOS ---

    async getAppointmentById(id: string): Promise<Appointment | null> {
        const appointment = MOCK_Appointment_LIST.find(a => a.id === id);
        if (!appointment) return null;

        const processed = await this._attachImages([appointment]);
        return new Promise((resolve) => {
            setTimeout(() => resolve(processed[0]), 300);
        });
    }

    async checkIfAppointmentIsReviewed(id: string): Promise<boolean> {
        const appt = MOCK_Appointment_LIST.find(a => a.id === id);
        return new Promise((resolve) => {
            resolve(appt?.isReviewed || false);
        });
    }

    // --- MÉTODOS DE LISTAGEM ---

    async getUserAppointments(): Promise<Appointment[]> {
        const appointmentsWithImages = await this._attachImages(MOCK_Appointment_LIST);
        return new Promise((resolve) => {
            setTimeout(() => resolve(appointmentsWithImages), 1200);
        });
    }

    async getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]> {
        const filtered = MOCK_Appointment_LIST.filter(a => a.status === status);
        const processed = await this._attachImages(filtered);
        return new Promise((resolve) => {
            setTimeout(() => resolve(processed), 600);
        });
    }

    async updateAppointmentStatus(id: string, newStatus: Appointment['status']): Promise<boolean> {
        return new Promise((resolve) => {
            // Em um cenário real, aqui você alteraria o objeto no banco/mock
            console.log(`Status do agendamento ${id} alterado para ${newStatus}`);
            setTimeout(() => resolve(true), 800);
        });
    }

// No seu AppointmentRepository.ts

    async getAppointmentsByUnitAndDate(
        unitId: string,
        date: Date,
        professionalId?: string 
    ): Promise<Appointment[]> {
        return new Promise((resolve) => {
            const targetDate = date.toISOString().split('T')[0];

            const filtered = MOCK_Appointment_LIST.filter(app => {
                const appDate = new Date(app.date).toISOString().split('T')[0];
                const matchUnit = app.salonId === unitId;
                const matchDate = appDate === targetDate;

                // Se for admin (professionalId undefined), traz tudo da unidade
                // Se não for admin, traz apenas se o professionalId bater
                const matchProf = professionalId ? app.professionalId === professionalId : true;

                return matchUnit && matchDate && matchProf;
            });

            setTimeout(() => resolve(filtered), 400);
        });
    }

    async getAppointmentsForAdmin(salonId: string, date: Date, showCancelled: boolean): Promise<Appointment[]> {
        return new Promise((resolve) => {
            const targetDate = date.toISOString().split('T')[0];

            const filtered = MOCK_Appointment_LIST.filter(app => {
                const appDate = new Date(app.date).toISOString().split('T')[0];
                const isFromSalon = app.salonId === salonId;
                const isSameDate = appDate === targetDate;

                // Admin vê Pendentes de qualquer dia (opcional) ou foca no dia:
                // Aqui focaremos no dia selecionado, mas separando por status na UI
                if (showCancelled) {
                    return isFromSalon && isSameDate; // Traz tudo incluindo cancelados
                }
                return isFromSalon && isSameDate && app.status !== 'Cancelado';
            });

            setTimeout(() => resolve(filtered), 400);
        });
    }
}