import { API_BASE_URL } from "~/config/api";

export const formatPackageSize = (packageSize: string) => {
    if (!packageSize) return '';
    const sizeMap: { [key: string]: string } = {
        '1kg': '۱ کیلوگرم',
        '10kg': '۱۰ کیلوگرم',
        '1litre': '۱ لیتر',
        '5liter': '۵ لیتر',
        '20litre': '۲۰ لیتر',
        '20liter': '۲۰ لیتر',
        '5litre': '۵ لیتر',
    };
    return sizeMap[packageSize.toLowerCase()] || packageSize;
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

export const truncateContent = (content: string, maxLength: number = 10) => {
    if (!content || content.length === 0) return 'بدون توضیحات';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
};

export const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// تابع کمکی برای کلاس‌های رنگ
export const getColorClass = (color: string, type: 'text' | 'bg') => {
    const colors: Record<string, Record<string, string>> = {
        green: { text: 'text-green-600', bg: 'bg-green-100' },
        blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
        purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
        orange: { text: 'text-orange-600', bg: 'bg-orange-100' }
    };
    return colors[color]?.[type] || colors.green[type];
};

export const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊' },
    { id: 'orders', label: 'سفارشات', icon: '📦' },
    { id: 'product-manager', label: 'مدیریت محصولات', icon: '🛍️' }, // اضافه شد
    { id: 'posts', label: 'مدیریت پست‌ها', icon: '📝' },
    { id: 'CreateAdmin', label: 'ایجاد ادمین', icon: '👨‍💼' },
    { id: 'EditProfile', label: 'ویرایش پروفایل', icon: '👤' },
    { id: 'customers', label: 'مشتریان', icon: '👥' },
    { id: 'analytics', label: 'تحلیل‌ها', icon: '📈' },
    { id: 'settings', label: 'تنظیمات', icon: '⚙️' }
];

export const getBrandColors = (brand: string) => {
    if (brand === 'Izirtu Land') {
        return {
            gradient: 'from-blue-500 to-sky-600',
            bg: 'bg-linear-to-r from-blue-500 to-sky-600',
            light: 'bg-blue-50',
            text: 'text-blue-800',
            border: 'border-blue-200'
        };
    } else if (brand === 'Khak Shimi') {
        return {
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-linear-to-r from-amber-500 to-orange-600',
            light: 'bg-amber-50',
            text: 'text-amber-800',
            border: 'border-amber-200'
        };
    }
    return {
        gradient: 'from-gray-500 to-gray-700',
        bg: 'bg-linear-to-r from-gray-500 to-gray-700',
        light: 'bg-gray-50',
        text: 'text-gray-800',
        border: 'border-gray-200'
    };
};

export const getModelColors = (model: string) => {
    return model === 'جامد'
        ? {
            gradient: 'from-green-500 to-emerald-600',
            bg: 'bg-linear-to-r from-green-500 to-emerald-600',
            light: 'bg-green-50',
            text: 'text-green-800',
            border: 'border-green-200'
        }
        : {
            gradient: 'from-purple-500 to-indigo-600',
            bg: 'bg-linear-to-r from-purple-500 to-indigo-600',
            light: 'bg-purple-50',
            text: 'text-purple-800',
            border: 'border-purple-200'
        };
};