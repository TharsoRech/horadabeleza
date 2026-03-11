import { API_CONFIG } from '@/app/Config/apiConfig';

/**
 * Cliente HTTP para chamadas à API .NET
 * Centraliza a lógica de requisições HTTP com tratamento de erros e autenticação
 */

export class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
    }

    /**
     * Método GET genérico
     */
    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: requestHeaders,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API GET error:', error);
            throw error;
        }
    }

    /**
     * Método POST genérico
     */
    async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API POST error:', error);
            throw error;
        }
    }

    /**
     * Método PUT genérico
     */
    async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: requestHeaders,
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API PUT error:', error);
            throw error;
        }
    }

    /**
     * Método DELETE genérico
     */
    async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: requestHeaders,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API DELETE error:', error);
            throw error;
        }
    }

    /**
     * Upload de arquivos (para imagens)
     */
    async upload<T>(endpoint: string, formData: FormData, headers?: Record<string, string>): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };
        
        // Remove o Content-Type para que o browser defina automaticamente com boundary
        delete requestHeaders['Content-Type'];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: requestHeaders,
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API UPLOAD error:', error);
            throw error;
        }
    }
}

// Instância única do cliente API
export const apiClient = new ApiClient();