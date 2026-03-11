import {Appointment} from "../Models/Appointment";
import {IAppointmentRepository} from "./Interfaces/IAppointmentRepository";
import {apiClient} from "@/app/Utils/apiClient";
import {AppointmentResponse} from "@/app/Types/apiTypes";

export class AppointmentRepository implements IAppointmentRepository {

    // --- MÉTODOS IMPLEMENTADOS ---

    async getAppointmentById(id: string): Promise<Appointment | null> {
        try {
            const response: AppointmentResponse = await apiClient.get(`/appointments/${id}`);
            
            // Converte a resposta da API para o modelo Appointment
            return {
                id: response.id,
                date: response.date,
                time: response.time,
                status: response.status as Appointment['status'],
                serviceId: response.serviceId || '',
                professionalId: response.professionalId || '',
                salonId: response.salonId || '',
                isReviewed: response.isReviewed || false,
                salonImage: response.salonImage || '',
                salonName: response.salonName || '',
                address: response.address || '',
                serviceName: response.serviceName || '',
                price: response.price || 0,
                duration: response.duration || '',
                professionalName: response.professionalName || '',
                professionalImage: response.professionalImage || '',
                notes: response.notes || '',
                clientName: response.clientName || '',
                clientPhone: response.clientPhone || ''
            };
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
            const response: AppointmentResponse[] = await apiClient.get('/appointments/user');
            
            // Converte as respostas da API para o modelo Appointment
            return response.map(app => ({
                id: app.id,
                date: app.date,
                time: app.time,
                status: app.status as Appointment['status'],
                serviceId: app.serviceId || '',
                professionalId: app.professionalId || '',
                salonId: app.salonId || '',
                salonName: app.salonName || '',
                address: app.address || '',
                serviceName: app.serviceName || '',
                price: app.price || 0,
                duration: app.duration || '',
                professionalName: app.professionalName || '',
                professionalImage: app.professionalImage || '',
                isReviewed: app.isReviewed || false,
                salonImage: app.salonImage || '',
                notes: app.notes || '',
                clientName: app.clientName || '',
                clientPhone: app.clientPhone || ''
            }));
        } catch (error) {
            console.error('Get user appointments error:', error);
            return [];
        }
    }

    async getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]> {
        try {
            const response: AppointmentResponse[] = await apiClient.get(`/appointments/status/${status}`);
            
            // Converte as respostas da API para o modelo Appointment
            return response.map(app => ({
                id: app.id,
                date: app.date,
                time: app.time,
                status: app.status as Appointment['status'],
                serviceId: app.serviceId || '',
                professionalId: app.professionalId || '',
                salonId: app.salonId || '',
                salonName: app.salonName || '',
                address: app.address || '',
                serviceName: app.serviceName || '',
                price: app.price || 0,
                duration: app.duration || '',
                professionalName: app.professionalName || '',
                professionalImage: app.professionalImage || '',
                isReviewed: app.isReviewed || false,
                salonImage: app.salonImage || '',
                notes: app.notes || '',
                clientName: app.clientName || '',
                clientPhone: app.clientPhone || ''
            }));
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
            
            // Converte as respostas da API para o modelo Appointment
            return response.map(app => ({
                id: app.id,
                date: app.date,
                time: app.time,
                status: app.status as Appointment['status'],
                serviceId: app.serviceId || '',
                professionalId: app.professionalId,
                salonId: app.salonId,
                salonName: app.salonName || '',
                address: app.address || '',
                serviceName: app.serviceName || '',
                price: app.price || 0,
                duration: app.duration || '',
                professionalName: app.professionalName || '',
                professionalImage: app.professionalImage,
                isReviewed: app.isReviewed,
                salonImage: app.salonImage,
                notes: app.notes,
                clientName: app.clientName,
                clientPhone: app.clientPhone
            }));
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
            
            // Converte as respostas da API para o modelo Appointment
            return response.map(app => ({
                id: app.id,
                date: app.date,
                time: app.time,
                status: app.status as Appointment['status'],
                serviceId: app.serviceId || '',
                professionalId: app.professionalId,
                salonId: app.salonId,
                salonName: app.salonName || '',
                address: app.address || '',
                serviceName: app.serviceName || '',
                price: app.price || 0,
                duration: app.duration || '',
                professionalName: app.professionalName || '',
                professionalImage: app.professionalImage,
                isReviewed: app.isReviewed,
                salonImage: app.salonImage,
                notes: app.notes,
                clientName: app.clientName,
                clientPhone: app.clientPhone
            }));
        } catch (error) {
            console.error('Get appointments for admin error:', error);
            return [];
        }
    }
}
