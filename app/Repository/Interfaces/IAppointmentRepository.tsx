import { Appointment } from "../../Models/Appointment";
export interface IAppointmentRepository {
    getUserAppointments(): Promise<Appointment[]>;
    getAppointmentById(id: string): Promise<Appointment | null>;
    updateAppointmentStatus(id: string, newStatus: Appointment['status']): Promise<boolean>;
    checkIfAppointmentIsReviewed(id: string): Promise<boolean>;
    getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]>;
}