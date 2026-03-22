import * as Crypto from 'expo-crypto';

/**
 * Gera hash SHA-256 em formato hexadecimal para envio de senha ao backend.
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
    return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        plainPassword
    );
};

