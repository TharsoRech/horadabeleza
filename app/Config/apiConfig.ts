/**
 * Configuração da API
 * Define a URL base e configurações de autenticação com suporte a refresh token automático
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
    
    // Refresh token será armazenado aqui após o login
    refreshToken: null as string | null,
    
    // Controla se está tentando fazer refresh para evitar múltiplas tentativas simultâneas
    isRefreshing: false,
    
    // Callbacks para eventos de logout automático
    onLogoutCallback: null as (() => Promise<void>) | null,
    
    // Método para definir o token de autenticação
    setToken(token: string) {
        this.token = token;
    },
    
    // Método para obter o token de autenticação
    getToken(): string | null {
        return this.token;
    },
    
    // Método para definir o refresh token
    setRefreshToken(refreshToken: string) {
        this.refreshToken = refreshToken;
    },
    
    // Método para obter o refresh token
    getRefreshToken(): string | null {
        return this.refreshToken;
    },
    
    // Método para limpar tokens (logout)
    clearToken() {
        this.token = null;
        this.refreshToken = null;
        this.isRefreshing = false;
    },
    
    // Método para registrar callback de logout automático
    setOnLogoutCallback(callback: () => Promise<void>) {
        this.onLogoutCallback = callback;
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