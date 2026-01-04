import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';
import type { Product } from '~/components/types/product';
import { getColorClass } from '~/components/function/function';
import { DashboardProps, User } from '~/components/types/dashBoard';

export default component$<DashboardProps>(({ adminName, authToken }) => {
    const error = useSignal('');
    const loading = useSignal(false);
    const products = useSignal<Product[]>([]);
    const users = useSignal<User[]>([]);
    const stats = useSignal([
        { title: 'کل فروش', value: '۱۲۵,۴۰۰,۰۰۰', change: '+۱۲.۵%', icon: '💰', color: 'green' },
        { title: 'سفارشات', value: '۲,۸۴۷', change: '+۸.۲%', icon: '📦', color: 'blue' },
        { title: 'مشتریان', value: '۰', change: '+۰%', icon: '👥', color: 'purple' },
        { title: 'محصولات', value: '۰', change: '+۰%', icon: '🌿', color: 'orange' }
    ]);

const fetchOrders = $(async () => {

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || 'response not ok');
        }

        const data = JSON.parse(text);

        // 👇 اینجا بعداً اصلاح می‌کنیم اگر ساختار فرق داشت
        const orders = Array.isArray(data) ? data : data.orders;

        const totalOrders = orders.length;
        const totalSales = orders.reduce(
            (sum: number, o: any) => sum + (o.totalPrice || 0),
            0
        );

        stats.value = stats.value.map(stat => {
            if (stat.title === 'سفارشات') {
                return { ...stat, value: totalOrders.toString(), change: '+۰%' };
            }
            if (stat.title === 'کل فروش') {
                return { ...stat, value: totalSales.toLocaleString('fa-IR'), change: '+۰%' };
            }
            return stat;
        });

    } catch (err: any) {
        error.value = err.message;
    }
});

    // دریافت محصولات (بدون نیاز به توکن)
    const fetchProducts = $(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/product`);
            if (response.ok) {
                const data = await response.json();
                products.value = data;

                // به‌روزرسانی آمار تعداد محصولات
                stats.value = stats.value.map(stat =>
                    stat.title === 'محصولات'
                        ? { ...stat, value: data.length.toString(), change: '+۰%' }
                        : stat
                );
            } else {
                error.value = 'خطا در دریافت محصولات';
            }
        } catch {
            error.value = 'خطا در ارتباط با سرور';
        }
    });

    // دریافت کاربران (با استفاده از توکن دریافتی)
    const fetchUsers = $(async () => {
        // اگر توکن وجود نداشت
        if (!authToken) {
            console.error('❌ توکن احراز هویت وجود ندارد');
            stats.value = stats.value.map(stat =>
                stat.title === 'مشتریان'
                    ? { ...stat, value: '--', change: '--' }
                    : stat
            );
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/getAllUser`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                // دریافت آرایه کاربران (مثل CustomerManager)
                const usersArray = Array.isArray(data) ? data : (data.users || []);
                users.value = usersArray;
                // شمارش کل کاربران
                const totalUsers = usersArray.length;

                // به‌روزرسانی آمار
                stats.value = stats.value.map(stat => {
                    if (stat.title === 'مشتریان') {
                        return {
                            ...stat,
                            value: totalUsers.toString(),
                            change: '+۰%'
                        };
                    }
                    return stat;
                });

            } else if (response.status === 401) {
                console.error('❌ توکن منقضی شده یا نامعتبر است');
                error.value = 'توکن احراز هویت نامعتبر است. لطفاً مجدد وارد شوید.';
                // می‌توانید خطای 401 را به parent منتقل کنید
            } else {
                const errorText = await response.text();
                console.error('❌ خطای API:', response.status, errorText);
                error.value = `خطای سرور: ${response.status}`;
            }
        } catch (err: any) {
            console.error('❌ خطای شبکه:', err);
            error.value = 'خطا در ارتباط با سرور';
        }
    });

    // بارگذاری اولیه داده‌ها
    useTask$(async () => {
        loading.value = true;

        await fetchProducts();

        if (authToken) {
            await Promise.all([
                fetchUsers(),
                fetchOrders()
            ]);
        }

        loading.value = false;
    });


    // تابع refresh برای رفرش دستی
    const refreshData = $(async () => {
        loading.value = true;
        error.value = '';

        await Promise.all([
            fetchProducts(),
            fetchUsers(),
            fetchOrders()
        ]); loading.value = false;
    });

    return (
        <div>
            {/* Welcome Message */}
            <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-8">
                <h2 class="text-2xl font-bold mb-2">سلام! 👋 {adminName}</h2>
                <p class="opacity-90">خوش آمدید به پنل مدیریت پربار باغستان</p>
            </div>

            {/* دکمه رفرش و وضعیت */}
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <button
                        onClick$={refreshData}
                        disabled={loading.value}
                        class="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading.value ? (
                            <>
                                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
                                <span>در حال بروزرسانی...</span>
                            </>
                        ) : (
                            <>
                                <span>🔄</span>
                                <span>بروزرسانی آمار</span>
                            </>
                        )}
                    </button>

                    {/* وضعیت اتصال */}
                    <div class="flex items-center gap-2 text-sm">
                        <div class={`w-2 h-2 rounded-full ${authToken ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span class="text-gray-600">
                            {authToken ? 'احراز هویت شده' : 'بدون توکن'}
                        </span>
                    </div>
                </div>

                <div class="text-sm text-gray-500">
                    آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
                </div>
            </div>
            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.value.map((stat, index) => (
                    <div key={index} class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class={`w-12 h-12 ${getColorClass(stat.color, 'bg')} rounded-2xl flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                            <span class={`text-sm font-medium ${getColorClass(stat.color, 'text')} ${getColorClass(stat.color, 'bg')} bg-opacity-20 px-2 py-1 rounded-full`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p class="text-gray-600 text-sm">{stat.title}</p>

                        {/* نمایش وضعیت بارگذاری */}
                        {loading.value && (stat.title === 'محصولات' || stat.title === 'مشتریان') && (
                            <div class="mt-2">
                                <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-green-500 animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* نمایش خطا */}
            {error.value && (
                <div class="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="text-xl mr-2">⚠️</span>
                        <span>{error.value}</span>
                    </div>
                    <button
                        onClick$={() => error.value = ''}
                        class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
});