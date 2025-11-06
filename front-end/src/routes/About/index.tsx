import { component$ } from '@builder.io/qwik';
import logoC from '../../media/j529981_photo_2025-01-19_19-18-17.webp'

export default component$(() => {
    const stats = [
        { number: '۱۸+', label: 'سال تجربه', icon: '📅' },
        { number: '۵۰۰+', label: 'محصول تخصصی', icon: '🌿' },
        { number: '۱۰,۰۰۰+', label: 'کشاورز راضی', icon: '👨‍🌾' },
        { number: '۳۱', label: 'استان تحت پوشش', icon: '🗺️' }
    ];

    const team = [
        { name: 'مهندس جمال صوفیان', position: 'مدیر فنی و تحقیق و توسعه', expertise: 'متخصص خاک و تغذیه گیاه', avatar: '👨‍🔬' },
        { name: 'دکتر جعفر صوفیان', position: 'مدیر تولید', expertise: 'PhD مهندسی شیمی', avatar: '👨‍💼' }
    ];

    const certifications = [
        { name: 'ISO 9001', description: 'سیستم مدیریت کیفیت', icon: '🏆' },
        { name: 'ISO 14001', description: 'سیستم مدیریت محیط زیست', icon: '🌱' },
        { name: 'گواهی سلامت', description: 'سازمان غذا و دارو', icon: '✅' },
        { name: 'استاندارد ملی', description: 'ایران', icon: '🇮🇷' }
    ];

    return (
        <div class="min-h-screen bg-linear-to-b from-green-50 to-white">
            {/* Hero Section */}
            <section class="relative py-20 lg:py-28 overflow-hidden">
                <div class="absolute inset-0 bg-linear-to-r from-green-600/10 to-green-400/10"></div>
                <div class="absolute top-10 right-10 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                <div class="absolute bottom-10 left-10 w-96 h-96 bg-green-300 rounded-full opacity-10 blur-3xl"></div>

                <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* متن */}
                        <div>
                            <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                                <span class="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
                                درباره شرکت ما
                            </div>
                            <h1 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                                شرکت تولیدی{' '}
                                <span class="bg-linear-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                                    پربار باغستان
                                </span>
                            </h1>
                            <p class="text-lg text-gray-600 leading-relaxed mb-8">
                                پیشرو در تولید کودهای کشاورزی با کیفیت جهانی برای برداشت‌های پربار و پایدار
                            </p>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <a href='/products' class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift">
                                    🛒 مشاهده محصولات
                                </a>
                                <a href='/contact' class="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift">
                                    📞 تماس با ما
                                </a>
                            </div>
                        </div>

                        {/* جای عکس */}
                        <div class="relative">
                                    <img
                                        src={logoC}
                                        alt="My SVG"
                                        height={100} width={100} loading="eager"
                                        decoding="async"
                                        class="w-full h-auto object-cover"
                                    />
                            <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-2xl rotate-12 opacity-20"></div>
                            <div class="absolute -top-6 -right-6 w-20 h-20 bg-green-300 rounded-2xl -rotate-12 opacity-30"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* آمار و ارقام */}
            <section class="py-16 bg-white">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} class="text-center">
                                <div class="text-4xl lg:text-5xl font-bold text-green-600 mb-2">{stat.number}</div>
                                <div class="text-gray-600 mb-2">{stat.label}</div>
                                <div class="text-2xl">{stat.icon}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* تاریخچه و ماموریت */}
            <section class="py-16 bg-green-50">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* تاریخچه */}
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800 mb-6">تاریخچه شرکت</h2>
                            <div class="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                                <p class="text-gray-700 leading-relaxed text-justify">
                                    شرکت تولیدی پربار باغستان (سهامی خاص) در سال ۱۳۸۵ با تولید کودهای گرانوله شیمیایی و ارگانیک فعالیت خود را آغاز نمود. با توجه به رضایت مشتریان و نیاز بازار کشاورزی ایران با استفاده از تکنولوژی روز دنیا کودهای گرانوله آلی مایع و پودری و همچنین اسید فسفریک به سبد کالایی شرکت اضافه گردید.
                                </p>
                            </div>
                        </div>

                        {/* ماموریت و چشم‌انداز */}
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800 mb-6">ماموریت و چشم‌انداز</h2>
                            <div class="space-y-4">
                                <div class="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                                    <h3 class="font-semibold text-green-600 mb-2">🎯 ماموریت ما</h3>
                                    <p class="text-gray-700 text-sm">
                                        تولید محصولات مطابق با استانداردهای جهانی جهت نیل به محصولات سالم و با کیفیت کشاورزی در راستای حفاظت خاک، محیط زیست و سلامت انسان
                                    </p>
                                </div>
                                <div class="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                                    <h3 class="font-semibold text-green-600 mb-2">👁️ چشم‌انداز</h3>
                                    <p class="text-gray-700 text-sm">
                                        تبدیل شدن به برترین تولیدکننده کودهای کشاورزی در خاورمیانه و حضور فعال در بازارهای جهانی با تکیه بر نوآوری و کیفیت
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* امکانات و تجهیزات */}
            <section class="py-16 bg-white">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">امکانات و تجهیزات</h2>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* واحد تولیدی */}
                        <div class="bg-linear-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
                            <div class="text-4xl mb-4">🏭</div>
                            <h3 class="font-bold text-gray-800 mb-2">سه واحد تولیدی</h3>
                            <p class="text-gray-600 text-sm">
                                مجهز به مدرن‌ترین خطوط تولید کودهای گرانوله، مایع و پودری با ظرفیت تولید بالا
                            </p>
                        </div>

                        {/* آزمایشگاه */}
                        <div class="bg-linear-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
                            <div class="text-4xl mb-4">🔬</div>
                            <h3 class="font-bold text-gray-800 mb-2">آزمایشگاه مجهز</h3>
                            <p class="text-gray-600 text-sm">
                                آزمایشگاه کنترل کیفی پیشرفته برای آنالیز خاک، گیاه و تضمین کیفیت محصولات
                            </p>
                        </div>

                        {/* مزارع پایلوت */}
                        <div class="bg-linear-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
                            <div class="text-4xl mb-4">🌾</div>
                            <h3 class="font-bold text-gray-800 mb-2">مزارع پایلوت</h3>
                            <p class="text-gray-600 text-sm">
                                مزارع تحقیقاتی برای تست و بهینه‌سازی محصولات در شرایط واقعی کشاورزی
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* تیم مدیریت */}
            <section class="py-16 bg-green-50">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">تیم مدیریت و متخصصان</h2>

                    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                        {team.map((member, index) => (
                            <div key={index} class="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center hover-lift transition-all duration-300">
                                <div class="text-4xl mb-4">{member.avatar}</div>
                                <h3 class="font-bold text-gray-800 mb-1">{member.name}</h3>
                                <p class="text-green-600 text-sm mb-2">{member.position}</p>
                                <p class="text-gray-600 text-xs">{member.expertise}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* گواهی‌ها و استانداردها */}
            <section class="py-16 bg-white">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">گواهی‌ها و استانداردها</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {certifications.map((cert, index) => (
                            <div key={index} class="bg-linear-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
                                <div class="text-3xl mb-4">{cert.icon}</div>
                                <h3 class="font-bold text-gray-800 mb-2">{cert.name}</h3>
                                <p class="text-gray-600 text-sm">{cert.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA پایانی */}
            <section class="py-16 bg-linear-to-r from-green-600 to-green-700">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
                        آماده همکاری با پربار باغستان هستید؟
                    </h2>
                    <p class="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                        برای دریافت مشاوره رایگان و اطلاعات بیشتر درباره محصولات با ما تماس بگیرید
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button class="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift">
                            📞 تماس با کارشناس
                        </button>
                        <button class="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift">
                            📧 ارسال درخواست
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
});