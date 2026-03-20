import {UserRole} from "@/app/Models/UserProfile";

export const formatCPF = (v: string) => {
    v = v.replace(/\D/g, "");
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
};

export const formatCNPJ = (v: string) => {
    v = v.replace(/\D/g, "");
    return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").substring(0, 18);
};

export const formatDoc = (v: string, role: UserRole) => {
    if (role === UserRole.CLIENT) return formatCPF(v);
    return v.length <= 14 ? formatCPF(v) : formatCNPJ(v);
};

export const formatDate = (v: string) => {
    v = v.replace(/\D/g, "");
    return v.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3").substring(0, 10);
};

/**
 * Converte uma data de qualquer formato para YYYY-MM-DD
 * Suporta: DD/MM/YYYY, YYYY-MM-DD, DDMMYYYY, YYYYMMDD
 */
export const convertToISO8601 = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // Remove espaços
    dateStr = dateStr.trim();
    
    // Remove caracteres especiais, mantendo apenas números e hífens/barras
    const onlyNums = dateStr.replace(/[^\d\-\/]/g, '');
    const cleaned = onlyNums.replace(/\D/g, '');
    
    console.log('📅 convertToISO8601 - input:', dateStr, '-> cleaned:', cleaned);
    
    if (cleaned.length !== 8) {
        console.warn('⚠️ Data com comprimento inválido:', cleaned.length, 'esperado: 8');
        return '';
    }
    
    let day, month, year;
    
    // Detectar formato
    if (dateStr.includes('-') || dateStr.includes('/')) {
        // Formato com separadores: verificar se é DD/MM/YYYY ou YYYY-MM-DD
        const parts = dateStr.split(/[-\/]/);
        
        if (parts.length !== 3) {
            console.warn('⚠️ Formato de data inválido:', dateStr);
            return '';
        }
        
        if (parts[0].length === 4) {
            // YYYY-MM-DD ou YYYY/MM/DD
            year = parts[0];
            month = parts[1];
            day = parts[2];
        } else {
            // DD/MM/YYYY ou DD-MM-YYYY
            day = parts[0];
            month = parts[1];
            year = parts[2];
        }
    } else {
        // Sem separadores: assumir DDMMYYYY (8 dígitos)
        day = cleaned.substring(0, 2);
        month = cleaned.substring(2, 4);
        year = cleaned.substring(4, 8);
    }
    
    // Validar valores
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    console.log('📅 Componentes detectados:', { day, month, year, dayNum, monthNum, yearNum });
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1753) {
        console.warn('⚠️ Valores de data inválidos');
        return '';
    }
    
    // Retorna YYYY-MM-DD
    const result = `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    console.log('✅ Data convertida para ISO8601:', result);
    return result;
};
