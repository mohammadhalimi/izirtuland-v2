export interface User {
    _id: string;
    phone: string;
    username?: string;
    name?: string;
    email?: string;
    address?: string;
    role: string;
    createdAt: string;
}

export interface DashboardProps {
    adminName: string;
    authToken: string; // اضافه کردن prop برای توکن
}