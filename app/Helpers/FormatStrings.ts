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

const isValidDateParts = (day: number, month: number, year: number): boolean => {
    if (year < 1753 || year > 9999) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const parseDateParts = (input: string): { day: number; month: number; year: number } | null => {
    if (!input) return null;

    const value = input.trim();

    // Matches yyyy-mm-dd or yyyy/mm/dd, ignoring trailing time (e.g. 2025-07-19 00:00:00)
    const isoLikeMatch = value.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (isoLikeMatch) {
        const year = parseInt(isoLikeMatch[1], 10);
        const month = parseInt(isoLikeMatch[2], 10);
        const day = parseInt(isoLikeMatch[3], 10);
        if (isValidDateParts(day, month, year)) return { day, month, year };
    }

    // Matches dd/mm/yyyy or mm/dd/yyyy with heuristic swap when needed
    const slashLikeMatch = value.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (slashLikeMatch) {
        const first = parseInt(slashLikeMatch[1], 10);
        const second = parseInt(slashLikeMatch[2], 10);
        const year = parseInt(slashLikeMatch[3], 10);

        // Prefer BR format (dd/mm), but accept US format when second part cannot be month.
        let day = first;
        let month = second;
        if (first <= 12 && second > 12) {
            day = second;
            month = first;
        }

        if (isValidDateParts(day, month, year)) return { day, month, year };
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length < 8) return null;

    const first8 = digits.slice(0, 8);
    const yearFirst = parseInt(first8.slice(0, 4), 10);
    const monthFirst = parseInt(first8.slice(4, 6), 10);
    const dayFirst = parseInt(first8.slice(6, 8), 10);
    if (isValidDateParts(dayFirst, monthFirst, yearFirst)) {
        return { day: dayFirst, month: monthFirst, year: yearFirst };
    }

    const day = parseInt(first8.slice(0, 2), 10);
    const month = parseInt(first8.slice(2, 4), 10);
    const year = parseInt(first8.slice(4, 8), 10);
    if (isValidDateParts(day, month, year)) {
        return { day, month, year };
    }

    return null;
};

export const formatDate = (v: string) => {
    if (!v) return "";

    const parsed = parseDateParts(v);
    if (parsed) {
        return `${String(parsed.day).padStart(2, '0')}/${String(parsed.month).padStart(2, '0')}/${parsed.year}`;
    }

    const digits = v.trim().replace(/\D/g, '');

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

/**
 * Converte uma data de qualquer formato para YYYY-MM-DD
 * Suporta: DD/MM/YYYY, YYYY-MM-DD, DDMMYYYY, YYYYMMDD
 */
export const convertToISO8601 = (dateStr: string): string => {
    const parsed = parseDateParts(dateStr);
    if (!parsed) return '';

    return `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
};
