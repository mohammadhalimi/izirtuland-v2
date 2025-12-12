import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const UpText = component$(() => {
    return (
        <>
            {/* هدر مینیمال */}
            <header class="border-b border-gray-100">
                <div class="container mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <Link
                                href="/"
                                class="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-200"
                            >
                                پربارباغستان
                            </Link>
                            <div class="h-6 w-px bg-gray-200"></div>
                            <nav class="flex items-center space-x-6 text-sm text-gray-600 px-2">
                                <Link href="/" class="hover:text-gray-900 transition-colors">خانه</Link>
                                <span class="text-green-600 font-medium">محصولات</span>
                                <Link href="/Blog" class="hover:text-gray-900 transition-colors">بلاگ</Link>
                                <Link href="/About" class="hover:text-gray-900 transition-colors">درباره ما</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {/* هیرو سکشن */}
            <section class="bg-linear-to-br from-gray-50 to-white py-16">
                <div class="container mx-auto px-6">
                    <div class="text-center max-w-3xl mx-auto">
                        <h1 class="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            محصولات <span class="text-green-600">کشاورزی</span>
                        </h1>
                        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                            با کیفیت‌ترین محصولات کود و سموم کشاورزی با استانداردهای بین‌المللی
                        </p>
                    </div>
                </div>
            </section>
            {/* بخش معرفی محصولات */}
            <section class="py-12 bg-linear-to-b from-white to-green-50">
                <div class="container mx-auto px-6">
                    <div class="max-w-5xl mx-auto">

                        {/* معرفی کودهای پودری و کریستاله */}
                        <div class="mb-16 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 bg-linear-to-r from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center mr-4">
                                    <span class="text-2xl">🌱</span>
                                </div>
                                <h2 class="text-3xl font-bold text-gray-900">کودهای پودری و کریستاله</h2>
                            </div>

                            <p class="text-gray-700 text-lg mb-6 leading-relaxed">
                                کودهای پودری به لحاظ دارا بودن نسبت مشخص از عناصر پرمصرف و ریزمغذی، نه تنها تامین‌کننده عناصر مورد نیاز رشد گیاهان هستند، بلکه ضامن بهبود سلامت گیاه نیز می‌باشند.
                            </p>

                            <div class="bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6">
                                <h3 class="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                                    <span class="ml-2">✨</span>
                                    مزایای کودهای پودری
                                </h3>
                                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <li class="flex items-center">
                                        <span class="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                                        <span class="text-gray-700">حلالیت بسیار بالا در مصارف محلول‌پاشی و کودآبیاری</span>
                                    </li>
                                    <li class="flex items-center">
                                        <span class="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                                        <span class="text-gray-700">افزایش راندمان مصرف کود و کاهش مصرف سایر کودها</span>
                                    </li>
                                    <li class="flex items-center">
                                        <span class="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                                        <span class="text-gray-700">غلظت بالای عناصر غذایی</span>
                                    </li>
                                    <li class="flex items-center">
                                        <span class="w-2 h-2 bg-amber-500 rounded-full ml-3"></span>
                                        <span class="text-gray-700">تامین همه عناصر مورد نیاز گیاه به طور همزمان</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                                <h4 class="text-lg font-semibold text-green-800 mb-4">📋 لیست محصولات پودری:</h4>
                                <div class="flex flex-wrap gap-3">
                                    {['ماکرو کامل پودری ۲۰-۲۰-۲۰', 'ماکرو کامل پودری TE-۳۶-۱۲-۱۲', 'کود پودری ۰-۴۰-۱۷',
                                        'کود پودری ۱-۰-۴۰', 'سولو پتاس', 'کود پودری میکرو',
                                        'کود پودری هیومیک اسید', 'کلات آهن', 'کود پودری ۱۹-۱۹-۱۹'].map((item, index) => (
                                            <span key={index} class="px-4 py-2 bg-white border border-green-200 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors">
                                                {item}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* معرفی کودهای مایع */}
                        <div class="mb-16 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 bg-linear-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mr-4">
                                    <span class="text-2xl">💧</span>
                                </div>
                                <h2 class="text-3xl font-bold text-gray-900">کودهای مایع</h2>
                            </div>

                            <p class="text-gray-700 text-lg mb-6 leading-relaxed">
                                در کودهای مایع، عناصر به صورت محلول در آب هستند که مصرف آنها به صورت محلول‌پاشی و کودآبیاری بوده و به دلیل جذب از طریق برگ، بازدهی بالاتری دارند.
                            </p>

                            <div class="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
                                <h3 class="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                                    <span class="ml-2">🚀</span>
                                    برتری‌های کودهای مایع
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-4">
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">تغذیه مطمئن و قابل کنترل با ترکیب‌های مختلف</span>
                                        </div>
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">جذب بسیار سریع به دلیل فرم قابل جذب</span>
                                        </div>
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">کاهش مصرف کود و هزینه‌های تغذیه</span>
                                        </div>
                                    </div>
                                    <div class="space-y-4">
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">امکان محاسبه دقیق میزان و زمان مصرف</span>
                                        </div>
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">کاهش آلودگی زیست‌محیطی خاک و آب</span>
                                        </div>
                                        <div class="flex items-start">
                                            <span class="text-blue-500 ml-3 mt-1">✓</span>
                                            <span class="text-gray-700">عدم نیاز به فرجه زمانی برای جذب</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                                <h4 class="text-lg font-semibold text-indigo-800 mb-4">📋 لیست محصولات مایع:</h4>
                                <div class="flex flex-wrap gap-3">
                                    {['کود مخصوص گندم و جو', 'کود مرغی مایع', 'کود جلبک مایع', 'کود آمینو اسید مایع',
                                        'کود گوگرد مایع پتاس', 'کود گوگرد مایع سولفات', 'کود هیومیک مایع',
                                        'کود مس مایع', 'کود سیلیکات پتاسیم', 'کود منیزیم پتاسیم مایع',
                                        'کود روی مایع ۱۲٪', 'کود کلسیم مایع ۱۲٪', 'کود میکرو مایع',
                                        'کود ۳۰-۰-۰', 'کود ۳۰-۲۰-۰', 'کود ۱۰-۱۰-۱۰+TE'].map((item, index) => (
                                            <span key={index} class="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700 font-medium hover:bg-indigo-50 transition-colors text-sm">
                                                {item}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* معرفی برندها */}
                        <div class="mb-16">
                            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
                                برندهای معتبر <span class="text-green-600">پربار باغستان</span>
                            </h2>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* برند ایزیرتولند */}
                                <div class="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-blue-100">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <span class="text-3xl mb-2 block">🌟</span>
                                            <h3 class="text-2xl font-bold text-blue-900">ایزیرتولند</h3>
                                            <p class="text-blue-600 mt-1">Izirtu Land</p>
                                        </div>
                                        <div class="w-16 h-16 bg-linear-to-r from-blue-100 to-sky-100 rounded-full flex items-center justify-center">
                                            <span class="text-2xl">🏆</span>
                                        </div>
                                    </div>

                                    <p class="text-gray-700 mb-6 leading-relaxed">
                                        ایزیرتولند یکی از پیشروترین برندهای تولید کودهای کشاورزی در کشور است. این برند با تکیه بر فناوری‌های نوین و تحقیق و توسعه مستمر، محصولات با کیفیتی ارائه می‌دهد که به بهبود عملکرد و سلامت خاک کمک می‌کند.
                                    </p>

                                    <div class="bg-white rounded-xl p-5 border border-blue-200">
                                        <h4 class="font-semibold text-blue-800 mb-4 flex items-center">
                                            <span class="ml-2">✅</span>
                                            مزایای کلیدی ایزیرتولند
                                        </h4>
                                        <ul class="space-y-3">
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">استفاده از فناوری‌های نوین در تولید کودها</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">تحقیق و توسعه مستمر برای بهبود فرمولاسیون</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">کیفیت بالا و استانداردهای بین‌المللی</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">تأمین مواد اولیه مرغوب و با کیفیت</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">پشتیبانی فنی و مشاوره تخصصی</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-blue-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">گواهی‌نامه‌های کیفیت و سلامت محصولات</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mt-6 pt-6 border-t border-blue-200">
                                        <p class="text-gray-600 text-center mb-4">📞 برای مشاوره و سفارش:</p>
                                        <a href="tel:09308292601" class="block text-center bg-linear-to-r from-blue-600 to-sky-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                                            ۰۹۱۲۸۹۲۸۷۶۹
                                        </a>
                                    </div>
                                </div>

                                {/* برند خاک شیمی */}
                                <div class="bg-linear-to-br from-orange-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-orange-100">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <span class="text-3xl mb-2 block">🌿</span>
                                            <h3 class="text-2xl font-bold text-orange-900">خاک شیمی</h3>
                                            <p class="text-orange-600 mt-1">Khak Shimi</p>
                                        </div>
                                        <div class="w-16 h-16 bg-linear-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                                            <span class="text-2xl">🌾</span>
                                        </div>
                                    </div>

                                    <p class="text-gray-700 mb-6 leading-relaxed">
                                        خاک شیمی یکی از برندهای معتبر در زمینه تولید و عرضه محصولات کشاورزی، به ویژه کودهای شیمیایی و اصلاح‌کننده‌های خاک است. این برند با هدف بهبود کیفیت خاک و افزایش بهره‌وری محصولات کشاورزی تأسیس شده است.
                                    </p>

                                    <div class="bg-white rounded-xl p-5 border border-orange-200">
                                        <h4 class="font-semibold text-orange-800 mb-3">مزایای کلیدی</h4>
                                        <ul class="space-y-3">
                                            <li class="flex items-start">
                                                <span class="text-orange-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">کیفیت بالا در تولید کودهای شیمیایی</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-orange-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">تخصص در تولید اصلاح‌کننده‌های خاک</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-orange-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">افزایش بهره‌وری محصولات کشاورزی</span>
                                            </li>
                                            <li class="flex items-start">
                                                <span class="text-orange-500 ml-3 mt-1">✓</span>
                                                <span class="text-gray-700">تحقیق و توسعه مستمر در محصولات</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="mt-6 pt-6 border-t border-orange-200">
                                        <p class="text-orange-700 text-center font-semibold mb-2">🌾 تجربه‌ای راحت و مطمئن!</p>
                                        <p class="text-gray-600 text-center text-sm">
                                            با محصولات خاک شیمی، می‌توانید با اطمینان کامل، سلامت خاک و افزایش محصول خود را تضمین کنید.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* بخش نحوه سفارش (در انتها و برای همه محصولات) */}
            <section class="py-16 bg-linear-to-r from-green-50 to-emerald-50">
                <div class="container mx-auto px-6">
                    <div class="max-w-4xl mx-auto">
                        <div class="text-center mb-12">
                            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                                نحوه سفارش و دریافت محصولات
                            </h2>
                            <p class="text-gray-600 text-lg">
                                سفارش محصولات پربار باغستان به سادگی چند کلیک
                            </p>
                        </div>

                        <div class="bg-white rounded-2xl shadow-xl p-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span class="ml-3">📋</span>
                                        مراحل سفارش
                                    </h3>
                                    <ol class="space-y-6">
                                        {[
                                            {
                                                step: '۱',
                                                title: 'انتخاب محصول',
                                                desc: 'محصول مورد نظر خود را از لیست محصولات انتخاب کنید'
                                            },
                                            {
                                                step: '۲',
                                                title: 'افزودن به سبد خرید',
                                                desc: 'محصول انتخاب شده را به سبد خرید اضافه کنید'
                                            },
                                            {
                                                step: '۳',
                                                title: 'تکمیل اطلاعات',
                                                desc: 'اطلاعات شخصی و آدرس خود را وارد نمایید'
                                            },
                                            {
                                                step: '۴',
                                                title: 'تأیید نهایی',
                                                desc: 'سفارش خود را نهایی کرده و منتظر تماس همکاران ما باشید'
                                            }
                                        ].map((item, index) => (
                                            <li key={index} class="flex items-start">
                                                <div class="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                                    {item.step}
                                                </div>
                                                <div class="mr-4">
                                                    <h4 class="font-bold text-gray-800">{item.title}</h4>
                                                    <p class="text-gray-600 text-sm mt-1">{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span class="ml-3">🚚</span>
                                        نحوه ارسال
                                    </h3>
                                    <div class="space-y-6">
                                        <div class="bg-gray-50 rounded-xl p-5">
                                            <h4 class="font-bold text-gray-800 mb-3">ارسال در تهران</h4>
                                            <p class="text-gray-600 text-sm">تحویل در کمتر از ۲۴ ساعت</p>
                                        </div>
                                        <div class="bg-gray-50 rounded-xl p-5">
                                            <h4 class="font-bold text-gray-800 mb-3">ارسال به شهرستان</h4>
                                            <p class="text-gray-600 text-sm">تحویل در ۴۸ تا ۷۲ ساعت</p>
                                        </div>
                                        <div class="bg-green-50 rounded-xl p-5 border border-green-200">
                                            <h4 class="font-bold text-green-800 mb-3">پشتیبانی ۲۴ ساعته</h4>
                                            <p class="text-green-700 text-sm">
                                                همکاران ما ۲۴ ساعته آماده پاسخگویی به سوالات شما هستند
                                            </p>
                                            <a href="tel:09308292601" class="inline-block mt-3 text-green-600 font-semibold hover:text-green-800 transition-colors">
                                                📞 ۰۹۱۲۸۹۲۸۷۶۹
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-10 pt-10 border-t border-gray-200">
                                <p class="text-center text-gray-700 font-medium">
                                    تمامی محصولات پربار باغستان با بهترین کیفیت و مناسب ترین قیمت عرضه می‌شوند
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
})