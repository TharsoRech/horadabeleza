import { Asset } from 'expo-asset';

export async function imageToBase64(assetModule: any): Promise<string> {
    try {
        // 1. Resolve o asset (carrega o arquivo local)
        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();

        const uri = asset.localUri || asset.uri;

        // 2. Faz um fetch na URI local do arquivo
        const response = await fetch(uri);

        // 3. Converte a resposta para um Blob
        const blob = await response.blob();

        // 4. Usa FileReader (padrão JS) para converter o Blob para Base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Erro na conversão:", error);
        return '';
    }
}