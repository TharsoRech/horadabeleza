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

        console.log('📡 API GET Request:', {
            url,
            headers: requestHeaders,
            timeout: this.timeout
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
                
                // Tratamento de tokens expirados (401 Unauthorized)
                if (response.status === 401) {
                    console.log('🔐 Token expirado, tentando renovar...');
                    // Importa o hook aqui para evitar o erro de hook fora do componente
                    const { useAuth } = require('@/app/Managers/AuthManager');
                    const authManager = useAuth();
                    const refreshSuccess = await authManager.refreshToken();
                    
                    if (refreshSuccess) {
                        // Token renovado com sucesso, tenta a requisição novamente
                        console.log('🔐 Token renovado, tentando requisição novamente...');
                        const newHeaders = {
                            ...API_CONFIG.getAuthHeaders(),
                            ...headers
                        };
                        
                        const retryResponse = await fetch(url, {
                            method: 'GET',
                            headers: newHeaders,
                            signal: controller.signal
                        });
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error after retry! status: ${retryResponse.status}, message: ${retryResponse.statusText}`);
                        }
                        
                        const retryData = await retryResponse.json();
                        console.log('✅ API GET Success after retry:', {
                            dataLength: Array.isArray(retryData) ? retryData.length : 'N/A',
                            dataType: typeof retryData,
                            dataSample: Array.isArray(retryData) ? retryData.slice(0, 2) : retryData
                        });
                        
                        return retryData;
                    } else {
                        // Falha ao renovar token, faz logout
                        console.log('🔐 Falha ao renovar token, fazendo logout...');
                        authManager.logout();
                        throw new Error('Token expirado e não foi possível renovar. Por favor, faça login novamente.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
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
                const errorText = await response.text();
                console.error('❌ API POST HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                // Tratamento de tokens expirados (401 Unauthorized)
                if (response.status === 401) {
                    console.log('🔐 Token expirado, tentando renovar...');
                    // Importa o hook aqui para evitar o erro de hook fora do componente
                    const { useAuth } = require('@/app/Managers/AuthManager');
                    const authManager = useAuth();
                    const refreshSuccess = await authManager.refreshToken();
                    
                    if (refreshSuccess) {
                        // Token renovado com sucesso, tenta a requisição novamente
                        console.log('🔐 Token renovado, tentando requisição novamente...');
                        const newHeaders = {
                            ...API_CONFIG.getAuthHeaders(),
                            ...headers
                        };
                        
                        const retryResponse = await fetch(url, {
                            method: 'POST',
                            headers: newHeaders,
                            body: JSON.stringify(data),
                            signal: controller.signal
                        });
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error after retry! status: ${retryResponse.status}, message: ${retryResponse.statusText}`);
                        }
                        
                        const retryData = await retryResponse.json();
                        console.log('✅ API POST Success after retry:', {
                            dataLength: Array.isArray(retryData) ? retryData.length : 'N/A',
                            dataType: typeof retryData,
                            dataSample: Array.isArray(retryData) ? retryData.slice(0, 2) : retryData
                        });
                        
                        return retryData;
                    } else {
                        // Falha ao renovar token, faz logout
                        console.log('🔐 Falha ao renovar token, fazendo logout...');
                        authManager.logout();
                        throw new Error('Token expirado e não foi possível renovar. Por favor, faça login novamente.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
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
                const errorText = await response.text();
                console.error('❌ API PUT HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                // Tratamento de tokens expirados (401 Unauthorized)
                if (response.status === 401) {
                    console.log('🔐 Token expirado, tentando renovar...');
                    // Importa o hook aqui para evitar o erro de hook fora do componente
                    const { useAuth } = require('@/app/Managers/AuthManager');
                    const authManager = useAuth();
                    const refreshSuccess = await authManager.refreshToken();
                    
                    if (refreshSuccess) {
                        // Token renovado com sucesso, tenta a requisição novamente
                        console.log('🔐 Token renovado, tentando requisição novamente...');
                        const newHeaders = {
                            ...API_CONFIG.getAuthHeaders(),
                            ...headers
                        };
                        
                        const retryResponse = await fetch(url, {
                            method: 'PUT',
                            headers: newHeaders,
                            body: JSON.stringify(data),
                            signal: controller.signal
                        });
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error after retry! status: ${retryResponse.status}, message: ${retryResponse.statusText}`);
                        }
                        
                        // Verifica se a resposta tem conteúdo antes de tentar parsear JSON
                        const contentType = retryResponse.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const retryData = await retryResponse.json();
                            console.log('✅ API PUT Success after retry:', {
                                dataLength: Array.isArray(retryData) ? retryData.length : 'N/A',
                                dataType: typeof retryData,
                                dataSample: Array.isArray(retryData) ? retryData.slice(0, 2) : retryData
                            });
                            return retryData;
                        } else {
                            // Se não houver conteúdo JSON (como no caso de 204 No Content), retorna undefined
                            return undefined as T;
                        }
                    } else {
                        // Falha ao renovar token, faz logout
                        console.log('🔐 Falha ao renovar token, fazendo logout...');
                        authManager.logout();
                        throw new Error('Token expirado e não foi possível renovar. Por favor, faça login novamente.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
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
                const errorText = await response.text();
                console.error('❌ API DELETE HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                // Tratamento de tokens expirados (401 Unauthorized)
                if (response.status === 401) {
                    console.log('🔐 Token expirado, tentando renovar...');
                    // Importa o hook aqui para evitar o erro de hook fora do componente
                    const { useAuth } = require('@/app/Managers/AuthManager');
                    const authManager = useAuth();
                    const refreshSuccess = await authManager.refreshToken();
                    
                    if (refreshSuccess) {
                        // Token renovado com sucesso, tenta a requisição novamente
                        console.log('🔐 Token renovado, tentando requisição novamente...');
                        const newHeaders = {
                            ...API_CONFIG.getAuthHeaders(),
                            ...headers
                        };
                        
                        const retryResponse = await fetch(url, {
                            method: 'DELETE',
                            headers: newHeaders,
                            signal: controller.signal
                        });
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error after retry! status: ${retryResponse.status}, message: ${retryResponse.statusText}`);
                        }
                        
                        const retryData = await retryResponse.json();
                        console.log('✅ API DELETE Success after retry:', {
                            dataLength: Array.isArray(retryData) ? retryData.length : 'N/A',
                            dataType: typeof retryData,
                            dataSample: Array.isArray(retryData) ? retryData.slice(0, 2) : retryData
                        });
                        
                        return retryData;
                    } else {
                        // Falha ao renovar token, faz logout
                        console.log('🔐 Falha ao renovar token, fazendo logout...');
                        authManager.logout();
                        throw new Error('Token expirado e não foi possível renovar. Por favor, faça login novamente.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
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
                const errorText = await response.text();
                console.error('❌ API UPLOAD HTTP Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                
                // Tratamento de tokens expirados (401 Unauthorized)
                if (response.status === 401) {
                    console.log('🔐 Token expirado, tentando renovar...');
                    // Importa o hook aqui para evitar o erro de hook fora do componente
                    const { useAuth } = require('@/app/Managers/AuthManager');
                    const authManager = useAuth();
                    const refreshSuccess = await authManager.refreshToken();
                    
                    if (refreshSuccess) {
                        // Token renovado com sucesso, tenta a requisição novamente
                        console.log('🔐 Token renovado, tentando requisição novamente...');
                        const newHeaders = {
                            ...API_CONFIG.getAuthHeaders(),
                            ...headers
                        };
                        
                        // Remove o Content-Type para que o browser defina automaticamente com boundary
                        delete newHeaders['Content-Type'];
                        
                        const retryResponse = await fetch(url, {
                            method: 'POST',
                            headers: newHeaders,
                            body: formData,
                            signal: controller.signal
                        });
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error after retry! status: ${retryResponse.status}, message: ${retryResponse.statusText}`);
                        }
                        
                        const retryData = await retryResponse.json();
                        console.log('✅ API UPLOAD Success after retry:', {
                            dataLength: Array.isArray(retryData) ? retryData.length : 'N/A',
                            dataType: typeof retryData,
                            dataSample: Array.isArray(retryData) ? retryData.slice(0, 2) : retryData
                        });
                        
                        return retryData;
                    } else {
                        // Falha ao renovar token, faz logout
                        console.log('🔐 Falha ao renovar token, fazendo logout...');
                        authManager.logout();
                        throw new Error('Token expirado e não foi possível renovar. Por favor, faça login novamente.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
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