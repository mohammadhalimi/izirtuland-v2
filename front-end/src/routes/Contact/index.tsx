import { component$ } from '@builder.io/qwik';
import { LeafletMap } from '~/components/section/leafletMap';

export default component$(() => {
    const contactMethods = [
        {
            icon: '📞',
            title: 'تلفن تماس',
            details: ['021-33370954'],
            description: 'پاسخگویی ۲۴ ساعته',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: '📞',
            title: 'موبایل',
            details: ['09128928769', '09107838556'],
            description: 'پاسخگویی ۲۴ ساعته',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: '📧',
            title: 'ایمیل',
            details: ['jamal.sufiyan90@gmail.com'],
            description: 'پاسخ در کمتر از ۲۴ ساعت',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: '📍',
            title: 'آدرس',
            details: ['تهران، خیابان ولیعصر، پلاک ۱۲۳۴', 'طبقه سوم، واحد ۵'],
            description: 'دفتر مرکزی',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: '🕒',
            title: 'ساعات کاری',
            details: ['شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰', 'پنجشنبه: ۸:۰۰ - ۱۴:۰۰'],
            description: 'جمعه‌ها تعطیل',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <div class="min-h-screen bg-linear-to-b from-green-50 to-white">
            {/* Hero Section */}
            <section class="relative py-20 lg:py-28 overflow-hidden">
                <div class="absolute inset-0 bg-linear-to-r from-green-600/10 to-green-400/10"></div>
                <div class="absolute top-10 right-10 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                <div class="absolute bottom-10 left-10 w-96 h-96 bg-green-300 rounded-full opacity-10 blur-3xl"></div>

                <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                        <span class="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
                        در تماس باشید
                    </div>
                    <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                        تماس با{' '}
                        <span class="bg-linear-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                            پربار باغستان
                        </span>
                    </h1>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        ما اینجا هستیم تا به سوالات شما پاسخ دهیم و در زمینه کشاورزی و باغداری همراهتان باشیم
                    </p>
                </div>
            </section>

            {/* روش‌های تماس */}
            <section class="py-16 bg-white">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">روش‌های ارتباط با ما</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactMethods.map((method, index) => (
                            <div key={index} class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover-lift transition-all duration-300">
                                <div class={`w-16 h-16 bg-linear-to-r ${method.color} rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4`}>
                                    {method.icon}
                                </div>
                                <h3 class="font-bold text-gray-800 mb-3">{method.title}</h3>
                                <div class="space-y-2 mb-3">
                                    {method.details.map((detail, idx) => (
                                        <p key={idx} class="text-gray-700 text-sm">{detail}</p>
                                    ))}
                                </div>
                                <p class="text-green-600 text-xs font-semibold">{method.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* فرم تماس */}
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* اطلاعات فرم */}
                        <div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-6">پیام به ما</h3>
                            <p class="text-gray-600 mb-8 leading-relaxed">
                                فرم زیر را پر کنید تا کارشناسان ما در سریع‌ترین زمان ممکن با شما تماس بگیرند.
                                ما متعهدیم در کمتر از ۲ ساعت کاری پاسخ شما را بدهیم.
                            </p>

                            <div class="space-y-4">
                                <div class="flex items-center text-gray-600">
                                    <span class="ml-3">✅</span>
                                    <span class="text-sm">پاسخگویی ۲۴ ساعته</span>
                                </div>
                                <div class="flex items-center text-gray-600">
                                    <span class="ml-3">✅</span>
                                    <span class="text-sm">مشاوره رایگان تخصصی</span>
                                </div>
                                <div class="flex items-center text-gray-600">
                                    <span class="ml-3">✅</span>
                                    <span class="text-sm">پشتیبانی پس از فروش</span>
                                </div>
                            </div>
                        </div>

                        {/* فرم */}
                        <div class="bg-linear-to-br from-green-50 to-white rounded-2xl shadow-lg border border-green-100 p-8">
                            <form class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                                        <input
                                            type="text"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                            placeholder="نام خود را وارد کنید"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                                        <input
                                            type="tel"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">موضوع</label>
                                    <input
                                        type="text"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                        placeholder="مشاوره کود دهی"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                                    <input
                                        type="email"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">پیام شما</label>
                                    <textarea
                                        rows={4}
                                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                        placeholder="پیام خود را اینجا بنویسید..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    class="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover-lift transform hover:scale-105"
                                >
                                    ارسال پیام
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* نقشه و اطلاعات بیشتر */}
            <section class="py-16 bg-gray-50">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* اطلاعات تماس بیشتر */}
                        <div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-6">اطلاعات بیشتر</h3>
                            <div class="space-y-6">
                                <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                    <h4 class="font-semibold text-gray-800 mb-3">📋 مدارک مورد نیاز برای همکاری</h4>
                                    <ul class="text-gray-600 text-sm space-y-2">
                                        <li>• گواهی اصالت کالا</li>
                                        <li>• پروانه بهره‌برداری</li>
                                        <li>• گواهی استاندارد</li>
                                        <li>• مشخصات فنی محصولات</li>
                                    </ul>
                                </div>

                                <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                    <h4 class="font-semibold text-gray-800 mb-3">🚚 شرایط ارسال</h4>
                                    <ul class="text-gray-600 text-sm space-y-2">
                                        <li>• ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان</li>
                                        <li>• تحویل ۲۴ ساعته در تهران</li>
                                        <li>• تحویل ۴۸ ساعته در شهرستان‌ها</li>
                                        <li>• پشتیبانی حمل و نقل</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* جای نقشه */}
                        <div class="bg-linear-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white">
                            <div class="text-center">
                                <div class="text-6xl mb-4">🗺️</div>
                                <h3 class="text-2xl font-bold mb-4">نقشه دسترسی</h3>
                                <p class="text-green-100 mb-6">
                                    برای مشاهده موقعیت دقیق دفتر مرکزی روی دکمه زیر کلیک کنید
                                </p>
                                <LeafletMap />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
});