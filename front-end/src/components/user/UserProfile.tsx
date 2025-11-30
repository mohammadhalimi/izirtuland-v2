// src/components/user/user-profile.tsx
import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { API_BASE_URL } from '~/config/api';

interface User {
    _id: string;
    phone: string;
    name?: string;
    address?: string;
}

interface OrderItem {
    product: {
        _id: string;
        name: string;
        packageSize: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'completed' | 'cancelled';
}

export default component$(() => {
    const state = useStore<{
        user: User | null;
        orders: Order[];
        loading: boolean;
        error: string | null;
    }>({
        user: null,
        orders: [],
        loading: true,
        error: null,
    });

    // بررسی احراز هویت و دریافت اطلاعات
    useVisibleTask$(async () => {
        try {
            const [userRes, ordersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/user/me`, { credentials: "include" }),
                fetch(`${API_BASE_URL}/api/user/me/orders`, { credentials: "include" })
            ]);

            const userData = await userRes.json();
            const ordersData = await ordersRes.json();

            if (userData.success) {
                state.user = userData.user;
            } else {
                state.error = "لطفاً ابتدا وارد شوید";
                return;
            }

            if (ordersData.success) {
                state.orders = ordersData.orders;
            }
        } catch (err) {
            state.error = "خطا در ارتباط با سرور";
        } finally {
            state.loading = false;
        }
    });

    const logout = $(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                window.location.reload(); // رفرش برای نمایش صفحه ورود
            }
        } catch (err) {
            alert("خطا در خروج از حساب");
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'تکمیل شده';
            case 'pending': return 'در انتظار';
            case 'cancelled': return 'لغو شده';
            default: return status;
        }
    };

    if (state.loading) {
        return (
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (!state.user) {
        return null; // کامپوننت Auth نمایش داده می‌شود
    }

    return (
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-4xl mx-auto p-4">
                {/* هدر صفحه */}
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">پروفایل کاربری</h1>
                    <p class="text-gray-600">مدیریت اطلاعات شخصی و مشاهده سفارشات</p>
                </div>

                {state.error && (
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center">
                        <span class="ml-2">⚠️</span>
                        <span>{state.error}</span>
                    </div>
                )}

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* کارت اطلاعات کاربر */}
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div class="text-center mb-6">
                                <div class="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span class="text-2xl text-white">👤</span>
                                </div>
                                <h2 class="text-xl font-bold text-gray-800 mb-1">
                                    {state.user?.name || 'کاربر'}
                                </h2>
                                <p class="text-gray-500 text-sm dir-ltr">{state.user?.phone}</p>
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">نام:</span>
                                    <span class="font-medium">{state.user?.name || 'تعیین نشده'}</span>
                                </div>
                                <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span class="text-gray-600">شماره:</span>
                                    <span class="font-medium dir-ltr">{state.user?.phone}</span>
                                </div>
                                <div class="flex items-center justify-between py-2">
                                    <span class="text-gray-600">آدرس:</span>
                                    <span class="font-medium text-right max-w-xs">
                                        {state.user?.address || 'ثبت نشده'}
                                    </span>
                                </div>
                            </div>

                            <div class="flex space-x-3 rtl:space-x-reverse mt-6">
                                <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 text-sm">
                                    ویرایش
                                </button>
                                <button 
                                    onClick$={logout}
                                    class="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 text-sm"
                                >
                                    خروج
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* بخش سفارشات */}
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-bold text-gray-800">سفارشات من</h2>
                                <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {state.orders.length} سفارش
                                </span>
                            </div>

                            {state.orders.length === 0 ? (
                                <div class="text-center py-12">
                                    <div class="text-6xl mb-4">🛒</div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">هنوز سفارشی ندارید</h3>
                                    <p class="text-gray-600">اولین سفارش خود را ثبت کنید!</p>
                                </div>
                            ) : (
                                <div class="space-y-4">
                                    {state.orders.map((order) => (
                                        <div key={order._id} class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                                            <div class="flex items-center justify-between mb-3">
                                                <div>
                                                    <span class="text-sm text-gray-500">شماره سفارش:</span>
                                                    <span class="font-medium text-gray-800 mr-2">#{order._id.slice(-6)}</span>
                                                </div>
                                                <span class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>

                                            <div class="space-y-2 mb-4">
                                                {order.items.map((item, index) => (
                                                    <div key={index} class="flex items-center justify-between text-sm">
                                                        <div class="flex-1">
                                                            <span class="font-medium text-gray-800">{item.product.name}</span>
                                                            <span class="text-gray-500 text-xs mr-2">({item.product.packageSize})</span>
                                                        </div>
                                                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                                            <span class="text-gray-600">{item.quantity} عدد</span>
                                                            <span class="font-medium">{item.price.toLocaleString()} تومان</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span class="text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                                </span>
                                                <div class="text-left">
                                                    <span class="text-sm text-gray-600">مبلغ کل:</span>
                                                    <span class="font-bold text-lg text-gray-800 mr-2">
                                                        {order.totalPrice.toLocaleString()} تومان
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});