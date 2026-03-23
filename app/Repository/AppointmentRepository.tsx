import {Appointment} from "../Models/Appointment";
import {IAppointmentRepository} from "./Interfaces/IAppointmentRepository";
import {apiClient} from "@/app/Utils/apiClient";
import {AppointmentResponse} from "@/app/Types/apiTypes";

export class AppointmentRepository implements IAppointmentRepository {

    private mapResponseToAppointment(app: AppointmentResponse): Appointment {
        const scheduledAt = app.scheduledAt || '';
        const fallbackDate = scheduledAt ? scheduledAt.split('T')[0] : '';
        const fallbackTime = scheduledAt ? scheduledAt.split('T')[1]?.slice(0, 5) || '' : '';

        return {
            id: String(app.id),
            date: app.date || fallbackDate,
            time: app.time || fallbackTime,
            status: String(app.status) as Appointment['status'],
            serviceId: String(app.serviceId || ''),
            professionalId: String(app.professionalId || ''),
            salonId: String(app.salonId || ''),
            isReviewed: app.isReviewed || false,
            salonImage: app.salonImage || '',
            salonName: app.salonName || '',
            address: app.address || '',
            serviceName: app.serviceName || '',
            price: app.price ?? app.totalPrice ?? 0,
            duration: app.duration || (app.durationMinutes ? `${app.durationMinutes} min` : ''),
            professionalName: app.professionalName || '',
            professionalImage: app.professionalImage || '',
            notes: app.notes || '',
            clientName: app.clientName || '',
            clientPhone: app.clientPhone || ''
        };
    }

    // --- MÉTODOS IMPLEMENTADOS ---

    async getAppointmentById(id: string): Promise<Appointment | null> {
        try {
            const response: AppointmentResponse = await apiClient.get(`/appointments/${id}`);
            return this.mapResponseToAppointment(response);
        } catch (error) {
            console.error('Get appointment error:', error);
            return null;
        }
    }

    async checkIfAppointmentIsReviewed(id: string): Promise<boolean> {
        try {
            const response: AppointmentResponse = await apiClient.get(`/appointments/${id}`);
            return response.isReviewed || false;
        } catch (error) {
            console.error('Check review error:', error);
            return false;
        }
    }

    // --- MÉTODOS DE LISTAGEM ---

    async getUserAppointments(): Promise<Appointment[]> {
        try {
            const response: AppointmentResponse[] = await apiClient.get('/appointments/mine');
            return response.map(app => this.mapResponseToAppointment(app));
        } catch (error) {
            console.error('Get user appointments error:', error);
            return [];
        }
    }

    async getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]> {
        try {
            const response: AppointmentResponse[] = await apiClient.get(`/appointments/status/${status}`);
            return response.map(app => this.mapResponseToAppointment(app));
        } catch (error) {
            console.error('Get appointments by status error:', error);
            return [];
        }
    }

    async updateAppointmentStatus(id: string, newStatus: Appointment['status']): Promise<boolean> {
        try {
            await apiClient.put(`/appointments/${id}/status`, {
                status: newStatus
            });
            return true;
        } catch (error) {
            console.error('Update appointment status error:', error);
            return false;
        }
    }

    async getAppointmentsByUnitAndDate(
        unitId: string,
        date: Date,
        professionalId?: string
    ): Promise<Appointment[]> {
        try {
            // Formata a data para YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const targetDate = `${year}-${month}-${day}`;

            let endpoint = `/appointments/salon/${unitId}/date/${targetDate}`;
            if (professionalId) {
                endpoint += `?professionalId=${professionalId}`;
            }

            const response: AppointmentResponse[] = await apiClient.get(endpoint);
            return response.map(app => this.mapResponseToAppointment(app));
        } catch (error) {
            console.error('Get appointments by unit and date error:', error);
            return [];
        }
    }

    async getAppointmentsForAdmin(salonId: string, date: Date, showCancelled: boolean): Promise<Appointment[]> {
        try {
            // Formata a data para YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const targetDate = `${year}-${month}-${day}`;

            let endpoint = `/appointments/admin/salon/${salonId}/date/${targetDate}`;
            if (showCancelled) {
                endpoint += '?includeCancelled=true';
            }

            const response: AppointmentResponse[] = await apiClient.get(endpoint);
            return response.map(app => this.mapResponseToAppointment(app));
        } catch (error) {
            console.error('Get appointments for admin error:', error);
            return [];
        }
    }
}
