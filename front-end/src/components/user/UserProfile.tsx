// src/components/user/user-profile.tsx
import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { API_BASE_URL } from '~/config/api';

interface User {
    _id: string;
    phone: string;
    name?: string;
    address?: string;
    email?: string;
    joinDate: string;
}

interface OrderItem {
    product: {
        _id: string;
        name: string;
        packageSize: string;
        image?: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'completed' | 'cancelled' | 'shipped';
    orderNumber: string;
}

export default component$(() => {
    const state = useStore<{
        user: User | null;
        orders: Order[];
        loading: boolean;
        error: string | null;
        activeTab: 'complete-purchase' | 'profile' | 'completed-orders';
    }>({
        user: null,
        orders: [],
        loading: true,
        error: null,
        activeTab: 'complete-purchase'
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
                window.location.reload();
            }
        } catch (err) {
            alert("خطا در خروج از حساب");
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'تکمیل شده';
            case 'pending': return 'در انتظار';
            case 'shipped': return 'ارسال شده';
            case 'cancelled': return 'لغو شده';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return '✅';
            case 'pending': return '⏳';
            case 'shipped': return '🚚';
            case 'cancelled': return '❌';
            default: return '📦';
        }
    };

    if (state.loading) {
        return (
            <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <div class="text-center">
                    <div class="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">در حال بارگذاری پنل کاربری</h3>
                    <p class="text-gray-500">لطفاً چند لحظه صبر کنید...</p>
                </div>
            </div>
        );
    }

    if (!state.user) {
        return null;
    }

    // آمار خلاصه
    const completedOrders = state.orders.filter(order => order.status === 'completed');
    const stats = {
        totalOrders: state.orders.length,
        pendingOrders: state.orders.filter(order => order.status === 'pending').length,
        completedOrders: completedOrders.length,
        totalSpent: completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    };

    return (
        <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            {/* هدر */}
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span class="text-2xl text-white">👤</span>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">پنل کاربری</h1>
                                <p class="text-gray-600">خوش آمدید، {state.user.name || 'کاربر'}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <button class="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm">
                                پشتیبانی
                            </button>
                            <button 
                                onClick$={logout}
                                class="bg-red-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm flex items-center space-x-2 rtl:space-x-reverse"
                            >
                                <span>🚪</span>
                                <span>خروج</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* کارت‌های آمار */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">کل سفارشات</p>
                                <p class="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <span class="text-2xl text-green-600">📦</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">در انتظار</p>
                                <p class="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingOrders}</p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <span class="text-2xl text-yellow-600">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">تکمیل شده</p>
                                <p class="text-3xl font-bold text-emerald-600 mt-2">{stats.completedOrders}</p>
                            </div>
                            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <span class="text-2xl text-emerald-600">✅</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">کل هزینه‌ها</p>
                                <p class="text-2xl font-bold text-green-600 mt-2">
                                    {stats.totalSpent.toLocaleString()} تومان
                                </p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <span class="text-2xl text-green-600">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* سایدبار اطلاعات کاربر */}
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <div class="text-center mb-6">
                                <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span class="text-3xl text-white">👤</span>
                                </div>
                                <h2 class="text-xl font-bold text-gray-900 mb-1">
                                    {state.user.name || 'کاربر'}
                                </h2>
                                <p class="text-gray-500 text-sm dir-ltr">{state.user.phone}</p>
                                {state.user.email && (
                                    <p class="text-gray-500 text-sm mt-1">{state.user.email}</p>
                                )}
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span class="text-gray-600 flex items-center">
                                        <span class="ml-2">📱</span>
                                        شماره موبایل
                                    </span>
                                    <span class="font-medium dir-ltr">{state.user.phone}</span>
                                </div>
                                
                                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span class="text-gray-600 flex items-center">
                                        <span class="ml-2">🏠</span>
                                        آدرس
                                    </span>
                                    <span class="font-medium text-right max-w-xs text-sm">
                                        {state.user.address || 'ثبت نشده'}
                                    </span>
                                </div>
                                
                                <div class="flex items-center justify-between py-3">
                                    <span class="text-gray-600 flex items-center">
                                        <span class="ml-2">📅</span>
                                        تاریخ عضویت
                                    </span>
                                    <span class="font-medium text-sm">
                                        {new Date(state.user.joinDate).toLocaleDateString('fa-IR')}
                                    </span>
                                </div>
                            </div>

                            <button class="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm flex items-center justify-center">
                                <span class="ml-2">✏️</span>
                                ویرایش پروفایل
                            </button>
                        </div>
                    </div>

                    {/* محتوای اصلی */}
                    <div class="lg:col-span-2">
                        {/* تب‌ها */}
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div class="flex space-x-6 rtl:space-x-reverse border-b border-gray-200 pb-4">
                                <button
                                    onClick$={() => state.activeTab = 'complete-purchase'}
                                    class={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        state.activeTab === 'complete-purchase'
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    🛒 تکمیل خرید
                                </button>
                                <button
                                    onClick$={() => state.activeTab = 'profile'}
                                    class={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        state.activeTab === 'profile'
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    👤 اطلاعات کاربری
                                </button>
                                <button
                                    onClick$={() => state.activeTab = 'completed-orders'}
                                    class={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        state.activeTab === 'completed-orders'
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    ✅ سفارشات تکمیل شده
                                </button>
                            </div>

                            {/* محتوای تب‌ها */}
                            <div class="mt-6">
                                {/* تب تکمیل خرید */}
                                {state.activeTab === 'complete-purchase' && (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">تکمیل فرآیند خرید</h3>
                                        
                                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                            <div class="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                                                <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                                                    <span class="text-2xl text-green-600">🌿</span>
                                                </div>
                                                <div>
                                                    <h4 class="font-bold text-gray-900 text-lg">محصولات کشاورزی با کیفیت</h4>
                                                    <p class="text-gray-600">انتخاب از بین بهترین محصولات طبیعی</p>
                                                </div>
                                            </div>
                                            
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <button class="bg-white border border-green-300 rounded-xl p-4 hover:shadow-md transition-all duration-200 text-right">
                                                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <span class="text-xl">🌱</span>
                                                        </div>
                                                        <div>
                                                            <p class="font-semibold text-gray-900">محصولات جامد</p>
                                                            <p class="text-sm text-gray-600">خاک‌های مرغوب</p>
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                <button class="bg-white border border-green-300 rounded-xl p-4 hover:shadow-md transition-all duration-200 text-right">
                                                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <span class="text-xl">💧</span>
                                                        </div>
                                                        <div>
                                                            <p class="font-semibold text-gray-900">محصولات مایع</p>
                                                            <p class="text-sm text-gray-600">محلول‌های تغذیه</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                            
                                            <button class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg">
                                                🛍️ مشاهده همه محصولات
                                            </button>
                                        </div>

                                        {/* آخرین سفارشات فعال */}
                                        <div class="bg-white border border-gray-200 rounded-2xl p-6">
                                            <h4 class="font-bold text-gray-900 mb-4">سفارشات در حال انجام</h4>
                                            {state.orders.filter(order => order.status === 'pending' || order.status === 'shipped').length === 0 ? (
                                                <div class="text-center py-8">
                                                    <div class="text-4xl mb-3">📦</div>
                                                    <p class="text-gray-600">هیچ سفارش فعالی ندارید</p>
                                                </div>
                                            ) : (
                                                <div class="space-y-4">
                                                    {state.orders
                                                        .filter(order => order.status === 'pending' || order.status === 'shipped')
                                                        .map((order) => (
                                                        <div key={order._id} class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                                                            <div class="flex items-center space-x-4 rtl:space-x-reverse">
                                                                <div class={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(order.status)}`}>
                                                                    {getStatusIcon(order.status)}
                                                                </div>
                                                                <div>
                                                                    <p class="font-medium text-gray-900">سفارش #{order.orderNumber || order._id.slice(-6)}</p>
                                                                    <p class="text-sm text-gray-500">
                                                                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div class="text-left">
                                                                <p class="font-bold text-gray-900">{order.totalPrice.toLocaleString()} تومان</p>
                                                                <p class={`text-xs font-medium ${getStatusColor(order.status)} px-2 py-1 rounded-full`}>
                                                                    {getStatusText(order.status)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* تب اطلاعات کاربری */}
                                {state.activeTab === 'profile' && (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">اطلاعات کاربری</h3>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div class="bg-green-50 rounded-xl p-6 border border-green-200">
                                                <h4 class="font-semibold text-green-900 mb-4 flex items-center">
                                                    <span class="ml-2">👤</span>
                                                    اطلاعات شخصی
                                                </h4>
                                                <div class="space-y-3">
                                                    <div class="flex justify-between items-center py-2 border-b border-green-100">
                                                        <span class="text-green-700">نام و نام خانوادگی:</span>
                                                        <span class="font-medium">{state.user.name || 'ثبت نشده'}</span>
                                                    </div>
                                                    <div class="flex justify-between items-center py-2 border-b border-green-100">
                                                        <span class="text-green-700">شماره موبایل:</span>
                                                        <span class="font-medium dir-ltr">{state.user.phone}</span>
                                                    </div>
                                                    <div class="flex justify-between items-center py-2">
                                                        <span class="text-green-700">آدرس ایمیل:</span>
                                                        <span class="font-medium">{state.user.email || 'ثبت نشده'}</span>
                                                    </div>
                                                </div>
                                                <button class="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200">
                                                    ویرایش اطلاعات شخصی
                                                </button>
                                            </div>

                                            <div class="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                                                <h4 class="font-semibold text-emerald-900 mb-4 flex items-center">
                                                    <span class="ml-2">🏠</span>
                                                    آدرس تحویل
                                                </h4>
                                                <div class="mb-4">
                                                    <p class="text-emerald-700 mb-2">آدرس فعلی:</p>
                                                    <p class="font-medium bg-white p-3 rounded-lg border border-emerald-200">
                                                        {state.user.address || 'هنوز آدرسی ثبت نکرده‌اید'}
                                                    </p>
                                                </div>
                                                <button class="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors duration-200">
                                                    {state.user.address ? 'ویرایش آدرس' : 'ثبت آدرس'}
                                                </button>
                                            </div>
                                        </div>

                                        <div class="bg-white border border-gray-200 rounded-xl p-6">
                                            <h4 class="font-semibold text-gray-900 mb-4">تنظیمات حساب</h4>
                                            <div class="space-y-3">
                                                <button class="w-full text-right p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
                                                    <span class="flex items-center">
                                                        <span class="ml-2">🔔</span>
                                                        تنظیمات اعلان‌ها
                                                    </span>
                                                    <span class="text-gray-400">▶</span>
                                                </button>
                                                <button class="w-full text-right p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
                                                    <span class="flex items-center">
                                                        <span class="ml-2">🔒</span>
                                                        امنیت حساب
                                                    </span>
                                                    <span class="text-gray-400">▶</span>
                                                </button>
                                                <button class="w-full text-right p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
                                                    <span class="flex items-center">
                                                        <span class="ml-2">👁️</span>
                                                        حریم خصوصی
                                                    </span>
                                                    <span class="text-gray-400">▶</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* تب سفارشات تکمیل شده */}
                                {state.activeTab === 'completed-orders' && (
                                    <div class="space-y-6">
                                        <h3 class="text-xl font-bold text-gray-900 mb-4">سفارشات تکمیل شده</h3>
                                        
                                        {completedOrders.length === 0 ? (
                                            <div class="text-center py-12">
                                                <div class="text-6xl mb-4">✅</div>
                                                <h3 class="text-lg font-medium text-gray-800 mb-2">هنوز سفارش تکمیل شده‌ای ندارید</h3>
                                                <p class="text-gray-600 mb-4">اولین سفارش خود را ثبت کنید!</p>
                                                <button 
                                                    onClick$={() => state.activeTab = 'complete-purchase'}
                                                    class="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200"
                                                >
                                                    شروع خرید
                                                </button>
                                            </div>
                                        ) : (
                                            <div class="space-y-4">
                                                {completedOrders.map((order) => (
                                                    <div key={order._id} class="border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-white">
                                                        <div class="flex items-center justify-between mb-4">
                                                            <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                                                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
                                                                    <span class="text-lg">✅</span>
                                                                </div>
                                                                <div>
                                                                    <h4 class="font-bold text-gray-900">سفارش #{order.orderNumber || order._id.slice(-6)}</h4>
                                                                    <p class="text-sm text-gray-500">
                                                                        {new Date(order.createdAt).toLocaleDateString('fa-IR')} - 
                                                                        {new Date(order.createdAt).toLocaleTimeString('fa-IR')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div class="text-left">
                                                                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                    تکمیل شده
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div class="space-y-3 mb-4">
                                                            {order.items.map((item, index) => (
                                                                <div key={index} class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                                                        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                                                                            <span class="text-gray-600">🌿</span>
                                                                        </div>
                                                                        <div>
                                                                            <p class="font-medium text-gray-900">{item.product.name}</p>
                                                                            <p class="text-xs text-gray-500">{item.product.packageSize}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div class="text-left">
                                                                        <p class="font-medium text-gray-900">{item.quantity} × {item.price.toLocaleString()}</p>
                                                                        <p class="text-sm text-gray-600">{(item.quantity * item.price).toLocaleString()} تومان</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div class="flex items-center justify-between pt-4 border-t border-green-200">
                                                            <button class="text-green-600 hover:text-green-800 font-medium text-sm flex items-center">
                                                                <span class="ml-1">📥</span>
                                                                دریافت فاکتور
                                                            </button>
                                                            <div class="text-left">
                                                                <span class="text-sm text-gray-600">مبلغ کل: </span>
                                                                <span class="font-bold text-lg text-green-700">
                                                                    {order.totalPrice.toLocaleString()} تومان
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});