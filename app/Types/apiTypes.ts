/**
 * Tipos de dados para as respostas da API .NET
 */

// Tipos de login e registro
export interface LoginResponse {
    id: string;
    name: string;
    email: string;
    role?: string;
    type?: string | number;
    dob?: string;
    country?: string;
    token: string;
    refreshToken?: string;
    base64Image?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    doc?: string;
    dob?: string;
    base64Image?: string;
}

// Tipos de agendamentos
export interface AppointmentResponse {
    id: string;
    date: string;
    time: string;
    status: string;
    serviceId: string;
    professionalId: string;
    salonId: string;
    userId: string;
    isReviewed: boolean;
    salonImage?: string;
    salonName?: string;
    address?: string;
    serviceName?: string;
    price?: number;
    duration?: string;
    professionalName?: string;
    professionalImage?: string;
    notes?: string;
    clientName?: string;
    clientPhone?: string;
}

export interface AppointmentRequest {
    date: string;
    time: string;
    serviceId: string;
    professionalId: string;
    salonId: string;
    userId: string;
    notes?: string;
}

// Tipos de salões e profissionais
export interface SalonResponse {
    id: string;
    name: string;
    address: string;
    rating: string;
    reviews: number;
    image?: string;
    serviceIds: string[];
    professionalIds: string[];
    whatsApp?: string;
    phone?: string;
    description?: string; 
    userHasVisited: boolean;
    gallery?: string[];
    published: boolean;
    isAdmin: boolean;
}

export interface ProfessionalResponse {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    bio: string;
    image?: string;
    serviceIds: string[];
    availableTimes: string[];
    cpf: string;
    isAdmin: boolean;
}

export interface ServiceResponse {
    id: string;
    name: string;
    icon: string;
    description: string;
    subServices: SubServiceResponse[];
}

export interface SubServiceResponse {
    id: string;
    name: string;
    price: number;
    duration: string;
    description: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    iconUrl: string;
}

// Tipos de avaliações
export interface ReviewResponse {
    id: string;
    salonId?: string;
    professionalId?: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// Tipos de notificações
export interface NotificationResponse {
    id: string;
    userId: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: string;
    createdAt: string;
}

// Tipos de assinaturas
export interface SubscriptionResponse {
    id: string | number;
    isActive: boolean;
    planType: string;
    planId?: number;
    planName?: string;
    status?: string;
    maxClients: number;
    currentClients: number;
    startDate?: string;
    trialStartDate?: string;
    trialEndDate?: string;
    nextBillingDate?: string;
    canUpgrade?: boolean;
    canCancel?: boolean;
}

export interface PlanResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    periodDays: number;
    appointmentLimit: number;
}

// Tipos de usuários
export interface UserProfileResponse {
    id: string;
    name: string;
    email: string;
    role?: string;
    type?: string | number;
    dob?: string;
    country?: string;
}

// Tipos genéricos de resposta
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    errors?: string[];
}