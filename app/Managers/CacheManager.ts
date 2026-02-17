import * as SecureStore from 'expo-secure-store';

// Remova o 'static' se quiser usar como instância ou mantenha para uso direto
export default class CacheManager {
    static async save(key: string, object: any) {
        try {
            const jsonString = JSON.stringify(object);
            await SecureStore.setItemAsync(key, jsonString);
            console.log(`Cache salvo: ${key}`);
        } catch (error) {
            console.error("Erro ao salvar no SecureStore", error);
        }
    }

    static async load<T>(key: string): Promise<T | null> {
        try {
            const jsonString = await SecureStore.getItemAsync(key);
            if (!jsonString) return null;
            return JSON.parse(jsonString) as T;
        } catch (error) {
            console.error("Erro ao carregar do SecureStore", error);
            return null;
        }
    }

    static async remove(key: string) {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error("Erro ao remover do SecureStore", error);
        }
    }
}