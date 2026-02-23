import { Appointment, MOCK_Appointment_LIST } from "../Models/Appointment";
import { MOCK_PROFESSIONALS_LIST, Professional } from "../Models/Professional";
import { MOCK_SALONS_LIST, Salon } from "../Models/Salon";
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
}