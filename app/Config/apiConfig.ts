/**
 * Configuração da API
 * Define a URL base e configurações de autenticação
 */

export const API_CONFIG = {
    // URL base da API .NET (localhost para desenvolvimento)
    baseURL: 'http://localhost:5000/api',
    
    // Headers padrão para todas as requisições
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    
    // Tempo de timeout para requisições (em milissegundos)
    timeout: 10000,
    
    // Token JWT será armazenado aqui após o login
    token: null as string | null,
    
    // Método para definir o token de autenticação
    setToken(token: string) {
        this.token = token;
    },
    
    // Método para obter o token de autenticação
    getToken(): string | null {
        return this.token;
    },
    
    // Método para limpar o token (logout)
    clearToken() {
        this.token = null;
    },
    
    // Método para obter headers de autenticação
    getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = { ...this.defaultHeaders };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
};

/**
 * Função auxiliar para criar URLs completas
 */
export const createApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.baseURL}${endpoint}`;
};