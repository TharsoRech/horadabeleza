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
    id: string | number;
    date?: string;
    time?: string;
    status: string | number;
    serviceId?: string | number;
    professionalId?: string | number;
    salonId?: string | number;
    userId?: string | number;
    isReviewed?: boolean;
    scheduledAt?: string;
    durationMinutes?: number;
    totalPrice?: number;
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
    id: string | number;
    ownerId?: number;
    name: string;
    address: string;
    city?: string;
    state?: string;
    rating: string;
    reviews: number;
    image?: string;
    logoUrl?: string;
    serviceIds?: Array<string | number>;
    professionalIds?: Array<string | number>;
    whatsApp?: string;
    phone?: string;
    description?: string; 
    userHasVisited: boolean;
    gallery?: string[] | string;
    published: boolean;
    active?: boolean;
    isAdmin: boolean;
}

export interface ProfessionalResponse {
    id: string | number;
    userId?: number;
    salonId?: number;
    name?: string;
    userName?: string;
    specialty?: string;
    rating?: number;
    averageRating?: number;
    reviews?: number;
    totalReviews?: number;
    bio?: string;
    image?: string;
    photoUrl?: string;
    serviceIds?: Array<string | number>;
    availableTimes?: string[];
    cpf?: string;
    isAdmin: boolean;
}

export interface ServiceResponse {
    id: string | number;
    salonId?: number;
    categoryId?: number;
    categoryName?: string;
    name: string;
    icon?: string;
    description?: string;
    price?: number;
    durationMinutes?: number;
    active?: boolean;
    subServices?: SubServiceResponse[];
}

export interface SubServiceResponse {
    id: string | number;
    serviceId?: string | number;
    name: string;
    price: number;
    duration: string;
    description?: string;
    active?: boolean;
}

export interface CategoryResponse {
    id: string;
    name: string;
    iconUrl: string;
}

// Tipos de avaliações
export interface ReviewResponse {
    id: string | number;
    appointmentId?: number;
    clientName?: string;
    salonId?: string;
    professionalId?: string;
    userId?: string;
    userName?: string;
    rating: number;
    comment?: string;
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
    planType: string | number;
    planId?: number;
    planName?: string;
    status?: string | number;
    maxClients: number;
    currentClients: number;
    startDate?: string;
    trialStartDate?: string;
    trialEndDate?: string;
    nextBillingDate?: string;
    isTrialEligible?: boolean;
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

export interface CardResponse {
    id: string | number;
    cardNumber: string;
    cardHolderName: string;
    expiryMonth: string;
    expiryYear: string;
    brand: string;
    isDefault: boolean;
}

export interface CardsEnvelopeResponse {
    cards: CardResponse[];
}

export interface SavedCard {
    id: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
    cardHolderName?: string;
    brand?: string;
    maskedNumber?: string;
}

export interface SaveCardPayload {
    number: string;
    expiry: string;
    cvv?: string;
    name?: string;
    brand?: string;
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