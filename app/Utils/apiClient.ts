import { API_CONFIG } from '@/app/Config/apiConfig';

/**
 * Cliente HTTP para chamadas à API .NET
 * Centraliza a lógica de requisições HTTP com tratamento de erros, autenticação e refresh automático de token
 */

export class ApiClient {
    private baseURL: string;
    private timeout: number;
    private refreshPromise: Promise<boolean> | null = null;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
    }

    /**
     * Tenta renovar o token automaticamente sem forçar logout em falha transitória.
     */
    private async handleTokenRefresh(): Promise<boolean> {
        // Se já está tentando fazer refresh, espera a promessa existente
        if (this.refreshPromise) {
            console.log('⏳ Aguardando refresh de token em andamento...');
            return this.refreshPromise;
        }

        // Se não temos refresh token, não há como renovar
        if (!API_CONFIG.getRefreshToken()) {
            console.warn('⚠️ Nenhum refresh token disponível para renovação');
            return false;
        }

        // Cria promessa para evitar múltiplas requisições simultâneas
        this.refreshPromise = this.attemptRefreshToken();
        
        try {
            const success = await this.refreshPromise;
            return success;
        } finally {
            this.refreshPromise = null;
        }
    }

    /**
     * Tenta renovar o token com o backend
     */
    private async attemptRefreshToken(): Promise<boolean> {
        try {
            console.log('🔄 Tentando renovar token...');
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.getToken()}`
                },
                body: JSON.stringify({
                    refreshToken: API_CONFIG.getRefreshToken()
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                
                if (data.token) {
                    console.log('✅ Token renovado com sucesso');
                    API_CONFIG.setToken(data.token);
                    
                    // Se o backend retornar novo refresh token, atualiza também
                    if (data.refreshToken) {
                        API_CONFIG.setRefreshToken(data.refreshToken);
                    }
                    
                    return true;
                }
                
                console.warn('⚠️ Resposta de refresh sem novo token');
                return false;
            } else {
                console.error(`❌ Falha ao renovar token: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao renovar token:', error);
            return false;
        }
    }

    private shouldAttemptRefresh(status: number, retryCount: number): boolean {
        return retryCount === 0 && (status === 401 || status === 404);
    }


    private buildHttpError(status: number, statusText: string, errorText: string): Error {
        let backendMessage = '';

        if (errorText) {
            try {
                const parsed = JSON.parse(errorText);
                if (typeof parsed === 'string') {
                    backendMessage = parsed;
                } else if (typeof parsed?.message === 'string') {
                    backendMessage = parsed.message;
                } else if (typeof parsed?.error === 'string') {
                    backendMessage = parsed.error;
                } else if (typeof parsed?.title === 'string') {
                    backendMessage = parsed.title;
                } else if (parsed?.errors && typeof parsed.errors === 'object') {
                    const firstFieldErrors = Object.values(parsed.errors)[0];
                    if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
                        backendMessage = String(firstFieldErrors[0]);
                    }
                }
            } catch {
                backendMessage = errorText.trim();
            }
        }

        const normalizedMessage = backendMessage || statusText || 'Erro desconhecido no servidor';
        return new Error(`HTTP ${status}: ${normalizedMessage}`);
    }

    /**
     * Método GET genérico com retry automático para token expirado
     */
    async get<T>(endpoint: string, headers?: Record<string, string>, retryCount: number = 0): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const requestHeaders = {
            ...API_CONFIG.getAuthHeaders(),
            ...headers
        };

        console.log('📡 API GET Request:', {
            url,
            timeout: this.timeout,
            retry: retryCount
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: requestHeaders,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📡 API GET Response:', {
                status: response.status,
                ok: response.ok,
                url: response.url
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API GET HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                if (this.shouldAttemptRefresh(response.status, retryCount)) {
                    console.log(`🔄 GET recebeu ${response.status}, tentando renovar token...`);
                    const refreshed = await this.handleTokenRefresh();

                    if (refreshed) {
                        return this.get<T>(endpoint, headers, retryCount + 1);
                    }
                }

                throw this.buildHttpError(response.status, response.statusText, errorText);
            }

            const data = await response.json();
            console.log('✅ API GET Success:', {
                dataLength: Array.isArray(data) ? data.length : 'N/A',
                dataType: typeof data,
                dataSample: Array.isArray(data) ? data.slice(0, 2) : data
            });

            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API GET error:', error);
            throw error;
        }
    }

    /**
     * Método POST genérico com retry automático para token expirado
     */
    async post<T>(endpoint: string, data: any, headers?: Record<string, string>, retryCount: number = 0): Promise<T> {
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
                const errorText = await response.text();
                console.error('❌ API POST HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                if (this.shouldAttemptRefresh(response.status, retryCount)) {
                    console.log(`🔄 POST recebeu ${response.status}, tentando renovar token...`);
                    const refreshed = await this.handleTokenRefresh();

                    if (refreshed) {
                        return this.post<T>(endpoint, data, headers, retryCount + 1);
                    }
                }

                throw this.buildHttpError(response.status, response.statusText, errorText);
            }

            const responseData = await response.json();
            console.log('✅ API POST Success:', {
                dataLength: Array.isArray(responseData) ? responseData.length : 'N/A',
                dataType: typeof responseData,
                dataSample: Array.isArray(responseData) ? responseData.slice(0, 2) : responseData
            });

            return responseData;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API POST error:', error);
            throw error;
        }
    }

    /**
     * Método PUT genérico com retry automático para token expirado
     */
    async put<T>(endpoint: string, data: any, headers?: Record<string, string>, retryCount: number = 0): Promise<T> {
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
                const errorText = await response.text();
                console.error('❌ API PUT HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                if (this.shouldAttemptRefresh(response.status, retryCount)) {
                    console.log(`🔄 PUT recebeu ${response.status}, tentando renovar token...`);
                    const refreshed = await this.handleTokenRefresh();

                    if (refreshed) {
                        return this.put<T>(endpoint, data, headers, retryCount + 1);
                    }
                }

                throw this.buildHttpError(response.status, response.statusText, errorText);
            }

            // Verifica se a resposta tem conteúdo antes de tentar parsear JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();
                console.log('✅ API PUT Success:', {
                    dataLength: Array.isArray(responseData) ? responseData.length : 'N/A',
                    dataType: typeof responseData,
                    dataSample: Array.isArray(responseData) ? responseData.slice(0, 2) : responseData
                });
                return responseData;
            } else {
                // Se não houver conteúdo JSON (como no caso de 204 No Content), retorna undefined
                return undefined as T;
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API PUT error:', error);
            throw error;
        }
    }

    /**
     * Método DELETE genérico com retry automático para token expirado
     */
    async delete<T>(endpoint: string, headers?: Record<string, string>, retryCount: number = 0): Promise<T> {
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
                const errorText = await response.text();
                console.error('❌ API DELETE HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                if (this.shouldAttemptRefresh(response.status, retryCount)) {
                    console.log(`🔄 DELETE recebeu ${response.status}, tentando renovar token...`);
                    const refreshed = await this.handleTokenRefresh();

                    if (refreshed) {
                        return this.delete<T>(endpoint, headers, retryCount + 1);
                    }
                }

                throw this.buildHttpError(response.status, response.statusText, errorText);
            }

            const responseData = await response.json();
            console.log('✅ API DELETE Success:', {
                dataLength: Array.isArray(responseData) ? responseData.length : 'N/A',
                dataType: typeof responseData,
                dataSample: Array.isArray(responseData) ? responseData.slice(0, 2) : responseData
            });

            return responseData;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API DELETE error:', error);
            throw error;
        }
    }

    /**
     * Upload de arquivos (para imagens) com retry automático para token expirado
     */
    async upload<T>(endpoint: string, formData: FormData, headers?: Record<string, string>, retryCount: number = 0): Promise<T> {
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
                const errorText = await response.text();
                console.error('❌ API UPLOAD HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                if (this.shouldAttemptRefresh(response.status, retryCount)) {
                    console.log(`🔄 UPLOAD recebeu ${response.status}, tentando renovar token...`);
                    const refreshed = await this.handleTokenRefresh();

                    if (refreshed) {
                        return this.upload<T>(endpoint, formData, headers, retryCount + 1);
                    }
                }

                throw this.buildHttpError(response.status, response.statusText, errorText);
            }

            const responseData = await response.json();
            console.log('✅ API UPLOAD Success:', {
                dataLength: Array.isArray(responseData) ? responseData.length : 'N/A',
                dataType: typeof responseData,
                dataSample: Array.isArray(responseData) ? responseData.slice(0, 2) : responseData
            });

            return responseData;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('❌ API UPLOAD error:', error);
            throw error;
        }
    }
}

// Instância única do cliente API
export const apiClient = new ApiClient();

