import { $, component$, useStore, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { API_BASE_URL } from '~/config/api';
import EmptyOrdersState from '../UserProfile/EmptyOrdersState';
import type { CheckoutItem } from '../types/user';
import type { Notification } from '../types/user';

export default component$(() => {
    const nav = useNavigate();
    const notifications = useStore<Notification[]>([]);
    const nextId = useSignal(1);

    const state = useStore<{
        items: CheckoutItem[];
        total: number;
        totalItems: number;
        isFreeShipping: boolean;
        isLoading: boolean;
    }>({
        items: [],
        total: 0,
        totalItems: 0,
        isFreeShipping: false,
        isLoading: true
    });

    // تابع نمایش نوتیفیکیشن
    const showNotification = $((type: Notification['type'], message: string, title: string, options?: {
        onConfirm?: () => void;
        onCancel?: () => void;
    }) => {
        const id = nextId.value++;
        const notification: Notification = {
            id,
            type,
            message,
            title,
            onConfirm: options?.onConfirm,
            onCancel: options?.onCancel
        };

        notifications.push(notification);

        // فقط برای پیام‌های غیر confirm حذف خودکار
        if (type !== 'confirm') {
            setTimeout(() => {
                const index = notifications.findIndex(n => n.id === id);
                if (index !== -1) {
                    notifications.splice(index, 1);
                }
            }, 3000);
        }

        return id;
    });

    // تابع حذف نوتیفیکیشن
    const removeNotification = $((id: number) => {
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications.splice(index, 1);
        }
    });

    useVisibleTask$(() => {
        const saved = localStorage.getItem('perebar_checkout');
        if (!saved) {
            state.isLoading = false;
            return;
        }

        try {
            const items: CheckoutItem[] = JSON.parse(saved);
            state.items = items;

            state.total = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            state.totalItems = items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            state.isFreeShipping = state.total >= 10000000;
            state.isLoading = false;
        } catch (error) {
            console.error('Error parsing checkout data:', error);
            showNotification('error', 'خطا در بارگذاری اطلاعات سفارش', 'خطا');
            state.isLoading = false;
        }
    });

    const itemsToSend = state.items.map(item => ({
        product: item.id,        // id محصول از state
        quantity: item.quantity,
        price: item.price,
        packageSize: item.packageSize,
        name:item.name,
        address:item.address
    }));

    const handleCheckout = $(async () => {
        try {
            // 1️⃣ ساخت سفارش
            const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: itemsToSend,
                    totalPrice: state.total,
                }),
            });

            const orderData = await orderRes.json();
            console.log(orderData)
            if (!orderRes.ok) {
                showNotification("error", orderData.message || "خطا در ثبت سفارش", "خطا");
                return;
            }

            // 2️⃣ شروع پرداخت
            const payRes = await fetch(`${API_BASE_URL}/api/payment/start`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                }),
            });

            const payData = await payRes.json();

            if (!payRes.ok) {
                showNotification("error", "خطا در اتصال به درگاه پرداخت", "خطا");
                return;
            }

            // 3️⃣ ریدایرکت به زیبال
            window.location.href = payData.paymentUrl;

        } catch (err) {
            console.error(err);
            showNotification("error", "خطا در ارتباط با سرور", "خطا");
        }
    });

    const handleContinueShopping = $(() => {
        nav('/');
    });

    // تابع جدید: انصراف از خرید و حذف کامل
    const handleCancelOrder = $(() => {
        showNotification('confirm',
            'آیا از انصراف از خرید مطمئن هستید؟ تمام اطلاعات سفارش حذف خواهد شد.',
            'انصراف از خرید',
            {
                onConfirm: $(() => {
                    localStorage.removeItem('perebar_checkout');
                    localStorage.removeItem('pending_order');
                    localStorage.removeItem('current_checkout');
                    state.items = [];
                    state.total = 0;
                    state.totalItems = 0;

                    // نمایش نوتیفیکیشن موفقیت
                    showNotification('success', 'سفارش شما با موفقیت لغو شد.', 'لغو سفارش');

                    // کمی تاخیر برای نمایش نوتیفیکیشن
                    setTimeout(() => {
                        nav('/User');
                    }, 1500);
                }),
                onCancel: $(() => {
                    // فقط نوتیفیکیشن را حذف می‌کنیم
                    const lastNotification = notifications[notifications.length - 1];
                    if (lastNotification?.type === 'confirm') {
                        removeNotification(lastNotification.id);
                    }
                })
            }
        );
    });

    const handleRemoveItem = $((itemId: string) => {
        const item = state.items.find(item => item.id === itemId);

        if (state.items.length === 1) {
            handleCancelOrder();
            return;
        }

        const updatedItems = state.items.filter(item => item.id !== itemId);
        localStorage.setItem('perebar_checkout', JSON.stringify(updatedItems));
        state.items = updatedItems;

        state.total = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        state.totalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        state.isFreeShipping = state.total >= 10000000;

        // نوتیفیکیشن برای حذف محصول
        if (item) {
            showNotification('warning', `محصول "${item.name}" از سبد خرید حذف شد.`, 'حذف محصول');
        }
    });

    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (state.isLoading) {
        return (
            <div class="bg-white rounded-2xl border p-6 mt-8">
                <div class="flex justify-center items-center py-8">
                    <div class="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span class="mr-2 text-gray-600">در حال بارگذاری...</span>
                </div>
            </div>
        );
    }

    if (state.items.length === 0) {
        return (
            <EmptyOrdersState
                icon="📦"
                title="هیچ سفارش فعالی ندارید"
                subtitle="می‌توانید از بخش محصولات، کالاهای مورد نیاز خود را انتخاب کنید"
                buttonText="مشاهده محصولات"
                buttonHref="/Products"
            />
        );
    }
    const formatPackageSize = (packageSize: string) => {
        const sizeMap: { [key: string]: string } = {
            '1kg': '۱ کیلوگرم',
            '10kg': '۱۰ کیلوگرم',
            '1litre': '۱ لیتر',
            '5liter': '۵ لیتر',
            '20litre': '۲۰ لیتر'
        };
        return sizeMap[packageSize] || packageSize;
    };
    return (
        <div class="relative">
            {/* کامپوننت نوتیفیکیشن */}
            <div class="fixed top-4 right-4 z-100 space-y-3 w-80 md:w-96">
                {notifications.map((notification) => {
                    if (notification.type === 'confirm') {
                        return (
                            <div
                                key={notification.id}
                                class="bg-white border border-gray-300 rounded-xl shadow-lg p-4 animate-fade-in"
                            >
                                <h4 class="font-bold text-gray-900 mb-2 text-sm">{notification.title}</h4>
                                <p class="text-gray-700 mb-4 text-sm">{notification.message}</p>
                                <div class="flex gap-3 justify-end">
                                    <button
                                        onClick$={() => {
                                            notification.onCancel?.();
                                        }}
                                        class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm cursor-pointer"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        onClick$={() => {
                                            notification.onConfirm?.();
                                        }}
                                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm cursor-pointer"
                                    >
                                        بله، لغو کن
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    const config = {
                        success: {
                            bg: 'bg-green-50 border-green-200',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-700',
                            icon: (
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            ),
                        },
                        error: {
                            bg: 'bg-red-50 border-red-200',
                            titleColor: 'text-red-900',
                            textColor: 'text-red-700',
                            icon: (
                                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            ),
                        },
                        info: {
                            bg: 'bg-blue-50 border-blue-200',
                            titleColor: 'text-blue-900',
                            textColor: 'text-blue-700',
                            icon: (
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            ),
                        },
                        warning: {
                            bg: 'bg-amber-50 border-amber-200',
                            titleColor: 'text-amber-900',
                            textColor: 'text-amber-700',
                            icon: (
                                <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            ),
                        },
                    }[notification.type];

                    return (
                        <div
                            key={notification.id}
                            class={`${config.bg} border rounded-xl shadow-lg p-4 animate-fade-in flex gap-3 items-start`}
                        >
                            {config.icon}
                            <div class="flex-1">
                                <h4 class={`font-bold text-sm mb-1 ${config.titleColor}`}>
                                    {notification.title}
                                </h4>
                                <p class={`text-sm ${config.textColor}`}>{notification.message}</p>
                            </div>
                            <button
                                onClick$={() => removeNotification(notification.id)}
                                class="text-gray-400 hover:text-gray-600 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* استایل انیمیشن */}
            <style>
                {`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                `}
            </style>

            {/* محتوای اصلی */}
            <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mt-8">
                {/* هدر با دکمه انصراف */}
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-2xl font-bold text-gray-900">سفارش در انتظار پرداخت</h3>
                        <button
                            onClick$={handleCancelOrder}
                            class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                            <span>✕</span>
                            انصراف از خرید
                        </button>
                    </div>
                    <p class="text-gray-600">لطفا قبل از پرداخت، اطلاعات سفارش را بررسی کنید</p>
                </div>

                {/* لیست محصولات */}
                <div class="space-y-3 mb-6">
                    {state.items.map((item, index) => (
                        <div
                            key={item.id}
                            class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group relative"
                        >
                            {/* دکمه حذف محصول */}
                            <button
                                onClick$={() => handleRemoveItem(item.id)}
                                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 cursor-pointer"
                                title="حذف محصول"
                            >
                                ✕
                            </button>

                            <div class="flex items-center space-x-4 w-full">
                                {/* شماره محصول */}
                                <div class="w-7 h-7 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {index + 1}
                                </div>

                                {/* تصویر محصول */}
                                <div class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                    <img
                                        src={getFullImageUrl(item.image)}
                                        alt={item.name}
                                        class="w-full h-full object-cover"
                                        onError$={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* اطلاعات محصول */}
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-start justify-between gap-2">
                                        <div class="flex-1 min-w-0">
                                            <h4 class="font-bold text-gray-900 text-sm truncate mb-1">{item.name}</h4>
                                            <div class="flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
                                                <span class="text-blue-600 font-medium">{item.brand}</span>
                                                <span class="text-gray-400">•</span>
                                                <span class="text-gray-700">{item.model}</span>
                                                <span class="text-gray-400">•</span>
                                                <span class="text-amber-600">بسته: {formatPackageSize(item.packageSize)}</span>
                                            </div>
                                            <div class="mt-1.5 text-xs text-gray-700 flex items-center gap-1">
                                                <span class="font-medium">قیمت واحد:</span>
                                                <span>{item.price.toLocaleString('fa-IR')} تومان</span>
                                            </div>
                                        </div>

                                        <div class="text-left shrink-0">
                                            <div class="flex items-center justify-end gap-2 mb-1">
                                                <span class="text-xs text-gray-600">تعداد:</span>
                                                <span class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold min-w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div class="text-base font-bold text-green-700 whitespace-nowrap">
                                                {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* خلاصه سفارش */}
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h4 class="font-bold text-lg mb-4 text-gray-900">خلاصه سفارش</h4>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <span class="text-gray-600">تعداد کل کالاها</span>
                            <span class="font-medium">{state.totalItems} عدد</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <div>
                                <span class="text-gray-600">قیمت کالاها</span>
                                <span class="text-xs text-gray-500 block">({state.totalItems} عدد)</span>
                            </div>
                            <span class="font-medium">{state.total.toLocaleString('fa-IR')} تومان</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <div>
                                <span class="text-gray-600">هزینه حمل و نقل</span>
                                <span class={`text-xs ${state.isFreeShipping ? 'text-green-600' : 'text-blue-600'} block font-medium`}>
                                    {state.isFreeShipping ? 'رایگان' : 'پس کرایه (محاسبه پس از ثبت)'}
                                </span>
                            </div>
                            <span class="text-gray-400 italic">
                                {state.isFreeShipping ? 'رایگان' : '--'}
                            </span>
                        </div>

                        <div class="flex justify-between items-center pt-3">
                            <span class="text-lg font-bold text-gray-900">مجموع قابل پرداخت</span>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-green-700">
                                    {state.total.toLocaleString('fa-IR')}
                                </div>
                                <div class="text-sm text-gray-500">تومان</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* اطلاعات حمل و نقل */}
                {!state.isFreeShipping && (
                    <div class="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                <span class="text-blue-600 text-sm">🚚</span>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-blue-800 mb-1">نکته مهم درباره هزینه حمل</p>
                                <p class="text-xs text-blue-700">
                                    هزینه حمل و نقل بر اساس وزن کالاها و مسافت محاسبه شده و پس از ثبت سفارش توسط پشتیبانی اعلام می‌شود.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* دکمه‌های اقدام */}
                <div class="space-y-3">
                    <button
                        onClick$={handleCheckout}
                        class="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>💳</span>
                        <span class="text-lg">پرداخت و تکمیل سفارش</span>
                    </button>

                    <div class="flex gap-3">
                        <button
                            onClick$={handleContinueShopping}
                            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
                        >
                            ادامه خرید
                        </button>

                        <button
                            onClick$={handleCancelOrder}
                            class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <span>✕</span>
                            انصراف از خرید
                        </button>
                    </div>
                </div>

                {/* اطلاعات امنیت */}
                <div class="mt-6 pt-6 border-t border-gray-200">
                    <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>🔒</span>
                        <span>پرداخت امن از طریق درگاه بانکی</span>
                    </div>
                </div>
            </div>
        </div>
    );
});