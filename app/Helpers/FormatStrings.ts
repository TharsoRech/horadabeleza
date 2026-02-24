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