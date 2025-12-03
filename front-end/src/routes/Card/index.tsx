// src/routes/cart/index.tsx
import { component$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
    // داده‌های دمو برای سبد خرید
    const cartItems = [
        {
            id: '1',
            name: 'عسل طبیعی کوهستان',
            brand: 'Izirtu Land',
            image: '/images/honey.jpg',
            price: 320000,
            quantity: 1,
            packageSize: '1kg',
            inStock: true
        },
        {
            id: '2',
            name: 'روغن زیتون فرابکر',
            brand: 'پربار',
            image: '/images/olive-oil.jpg',
            price: 450000,
            quantity: 2,
            packageSize: '1litre',
            inStock: true
        },
        {
            id: '3',
            name: 'خرما مضافتی',
            brand: 'باغات جنوب',
            image: '/images/dates.jpg',
            price: 180000,
            quantity: 1,
            packageSize: '1kg',
            inStock: false
        }
    ];

    // محاسبات سبد خرید
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 500000 ? 0 : 25000;
    const discount = subtotal > 1000000 ? 50000 : 0;
    const total = subtotal + shippingFee - discount;

    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR') + ' تومان';
    };

    const formatPackageSize = (size: string) => {
        const sizeMap: { [key: string]: string } = {
            '1kg': '۱ کیلوگرم',
            '10kg': '۱۰ کیلوگرم',
            '1litre': '۱ لیتر',
            '5liter': '۵ لیتر'
        };
        return sizeMap[size] || size;
    };

    // هندلرهای سبد خرید
    const handleIncreaseQuantity = $((itemId: string) => {
        console.log('افزایش تعداد محصول:', itemId);
    });

    const handleDecreaseQuantity = $((itemId: string) => {
        console.log('کاهش تعداد محصول:', itemId);
    });

    const handleRemoveItem = $((itemId: string) => {
        console.log('حذف محصول:', itemId);
    });

    const handleApplyCoupon = $(() => {
        const couponCode = (document.getElementById('coupon-code') as HTMLInputElement)?.value;
        console.log('اعمال کد تخفیف:', couponCode);
        alert(`کد تخفیف "${couponCode}" اعمال شد!`);
    });

    const handleCheckout = $(() => {
        console.log('پرداخت نهایی');
        alert('به صفحه پرداخت منتقل می‌شوید...');
    });

    return (
        <div class="min-h-screen bg-linear-to-br from-gray-50 via-white to-emerald-50/20">
            
            {/* 🚀 هدر مدرن */}
            <header class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6 rtl:space-x-reverse">
                            <Link
                                href="/"
                                class="flex items-center space-x-2 rtl:space-x-reverse group"
                            >
                                <div class="w-10 h-10 bg-linear-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                    <span class="text-white font-bold text-lg">پ</span>
                                </div>
                                <span class="text-2xl font-bold bg-linear-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                                    پربارباغستان
                                </span>
                            </Link>
                            
                            <nav class="hidden md:flex items-center space-x-8 text-sm">
                                <Link href="/" class="text-gray-600 hover:text-emerald-700 transition-colors">خانه</Link>
                                <Link href="/products" class="text-gray-600 hover:text-emerald-700 transition-colors">محصولات</Link>
                                <span class="text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-1">سبد خرید</span>
                            </nav>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <Link
                                href="/products"
                                class="hidden md:flex items-center space-x-2 text-emerald-700 hover:text-emerald-800"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>ادامه خرید</span>
                            </Link>
                            
                            {/* آیکون سبد خرید با نشانگر */}
                            <div class="relative">
                                <div class="w-10 h-10 bg-linear-to-br from-emerald-50 to-green-50 rounded-full flex items-center justify-center border border-emerald-200">
                                    <svg class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div class="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-br from-red-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                                    {cartItems.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="max-w-7xl mx-auto">
                    {/* عنوان صفحه */}
                    <div class="mb-8 md:mb-12">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">🛒 سبد خرید شما</h1>
                        <p class="text-gray-600">
                            {cartItems.length} کالا در سبد خرید شما وجود دارد
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ستون چپ - لیست محصولات */}
                        <div class="lg:col-span-2 space-y-6">
                            {/* هدر لیست */}
                            <div class="hidden md:grid grid-cols-12 gap-4 bg-linear-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-100">
                                <div class="col-span-5 text-sm font-semibold text-emerald-800">محصول</div>
                                <div class="col-span-2 text-sm font-semibold text-emerald-800">قیمت</div>
                                <div class="col-span-3 text-sm font-semibold text-emerald-800">تعداد</div>
                                <div class="col-span-2 text-sm font-semibold text-emerald-800">مجموع</div>
                            </div>

                            {/* لیست محصولات */}
                            <div class="space-y-4">
                                {cartItems.map((item) => (
                                    <div 
                                        key={item.id}
                                        class="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                            {/* تصویر محصول */}
                                            <div class="shrink-0">
                                                <div class="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                                    <div class="w-full h-full flex items-center justify-center">
                                                        <div class="w-16 h-16 bg-linear-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                                                            <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* اطلاعات محصول */}
                                            <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                                {/* نام و برند */}
                                                <div class="md:col-span-5">
                                                    <div class="space-y-2">
                                                        <div class="flex items-center space-x-2">
                                                            <span class={`text-xs px-2 py-1 rounded-full ${item.brand === 'Izirtu Land' 
                                                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                            }`}>
                                                                {item.brand}
                                                            </span>
                                                            {!item.inStock && (
                                                                <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                                                    ناموجود
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 class="font-semibold text-gray-900 text-lg">{item.name}</h3>
                                                        <p class="text-sm text-gray-500">{formatPackageSize(item.packageSize)}</p>
                                                    </div>
                                                </div>

                                                {/* قیمت واحد */}
                                                <div class="md:col-span-2">
                                                    <div class="space-y-1">
                                                        <p class="text-sm text-gray-500 md:hidden">قیمت واحد</p>
                                                        <p class="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                                                    </div>
                                                </div>

                                                {/* کنترل تعداد */}
                                                <div class="md:col-span-3">
                                                    <div class="flex items-center justify-between md:justify-start space-x-4">
                                                        <p class="text-sm text-gray-500 md:hidden">تعداد</p>
                                                        <div class="flex items-center space-x-3">
                                                            <button
                                                                onClick$={() => handleDecreaseQuantity(item.id)}
                                                                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            
                                                            <span class="font-semibold text-gray-900 min-w-8 text-center">
                                                                {item.quantity.toLocaleString('fa-IR')}
                                                            </span>
                                                            
                                                            <button
                                                                onClick$={() => handleIncreaseQuantity(item.id)}
                                                                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* قیمت کل و حذف */}
                                                <div class="md:col-span-2">
                                                    <div class="flex items-center justify-between">
                                                        <div class="space-y-1">
                                                            <p class="text-sm text-gray-500 md:hidden">مجموع</p>
                                                            <p class="font-bold text-gray-900 text-lg">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                        
                                                        <button
                                                            onClick$={() => handleRemoveItem(item.id)}
                                                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="حذف از سبد خرید"
                                                        >
                                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* دکمه‌های عملیات */}
                            <div class="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/products"
                                    class="flex-1 bg-linear-to-r from-white to-gray-50 text-emerald-700 border-2 border-emerald-200 py-4 px-6 rounded-xl font-semibold hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50 transition-all text-center"
                                >
                                    ← ادامه خرید
                                </Link>
                                
                                <button
                                    onClick$={() => {
                                        cartItems.forEach(item => handleRemoveItem(item.id));
                                    }}
                                    class="flex-1 bg-linear-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200 py-4 px-6 rounded-xl font-semibold hover:border-red-300 hover:from-red-100 hover:to-pink-100 transition-all"
                                >
                                    پاک کردن سبد خرید
                                </button>
                            </div>
                        </div>

                        {/* ستون راست - خلاصه سفارش */}
                        <div class="lg:col-span-1">
                            <div class="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                                <h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                    خلاصه سفارش
                                </h2>

                                {/* جزئیات قیمت */}
                                <div class="space-y-4 mb-6">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600">جمع کل ({cartItems.length} کالا)</span>
                                        <span class="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                                    </div>
                                    
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600">هزینه ارسال</span>
                                        <span class={`font-semibold ${shippingFee === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                            {shippingFee === 0 ? 'رایگان' : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600">تخفیف</span>
                                            <span class="font-semibold text-red-600">-{formatPrice(discount)}</span>
                                        </div>
                                    )}

                                    {/* کد تخفیف */}
                                    <div class="pt-4 border-t border-gray-100">
                                        <div class="flex gap-2">
                                            <input
                                                id="coupon-code"
                                                type="text"
                                                placeholder="کد تخفیف"
                                                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick$={handleApplyCoupon}
                                                class="px-6 py-3 bg-linear-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all whitespace-nowrap"
                                            >
                                                اعمال
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* مبلغ نهایی */}
                                <div class="mb-6 p-4 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                    <div class="flex justify-between items-center">
                                        <span class="text-lg font-bold text-gray-900">مبلغ قابل پرداخت</span>
                                        <span class="text-2xl font-bold text-emerald-700">{formatPrice(total)}</span>
                                    </div>
                                    {shippingFee === 0 && (
                                        <div class="mt-2 text-sm text-emerald-600 flex items-center">
                                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>ارسال رایگان</span>
                                        </div>
                                    )}
                                </div>

                                {/* دکمه پرداخت */}
                                <button
                                    onClick$={handleCheckout}
                                    class="w-full group relative bg-linear-to-r from-emerald-600 to-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-[0.98]"
                                >
                                    <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span class="relative flex items-center justify-center space-x-3">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span>ادامه فرآیند خرید</span>
                                    </span>
                                </button>

                                {/* امنیت خرید */}
                                <div class="mt-6 pt-6 border-t border-gray-100">
                                    <div class="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                        <div class="flex items-center space-x-1">
                                            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span>پرداخت امن</span>
                                        </div>
                                        <div class="h-4 w-px bg-gray-300"></div>
                                        <div class="flex items-center space-x-1">
                                            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span>گارانتی بازگشت</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* خدمات اضافی */}
                            <div class="mt-6 grid grid-cols-2 gap-4">
                                <div class="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 text-center">
                                    <div class="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <p class="text-sm text-gray-700">تحویل اکسپرس</p>
                                </div>
                                
                                <div class="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 text-center">
                                    <div class="w-10 h-10 bg-linear-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <p class="text-sm text-gray-700">ضمانت اصالت</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* فوتر */}
            <footer class="mt-16 border-t border-gray-100 bg-linear-to-b from-white to-gray-50">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="text-center space-y-6">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl shadow-md">
                            <span class="text-white font-bold text-xl">پ</span>
                        </div>
                        <div class="space-y-2">
                            <h4 class="text-lg font-bold text-gray-900">پربارباغستان</h4>
                            <p class="text-sm text-gray-600 max-w-md mx-auto">
                                خرید آسان، تحویل سریع، کیفیت تضمینی
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                            <a href="#" class="hover:text-emerald-600 transition-colors">حریم خصوصی</a>
                            <a href="#" class="hover:text-emerald-600 transition-colors">قوانین خرید</a>
                            <a href="#" class="hover:text-emerald-600 transition-colors">شیوه ارسال</a>
                            <a href="#" class="hover:text-emerald-600 transition-colors">گارانتی</a>
                            <a href="#" class="hover:text-emerald-600 transition-colors">پشتیبانی</a>
                        </div>
                        <p class="text-xs text-gray-400">© {new Date().getFullYear()} تمامی حقوق برای پربارباغستان محفوظ است</p>
                    </div>
                </div>
            </footer>
        </div>
    );
});