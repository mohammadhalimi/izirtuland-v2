import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <section class="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Gradient */}
      <div class="absolute inset-0 bg-linear-to-br from-green-600 via-green-700 to-green-800"></div>
      
      {/* Background Pattern */}
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div class="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-green-400 bg-opacity-20 rounded-full blur-2xl"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 bg-opacity-10 rounded-full blur-lg"></div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div class="inline-flex items-center px-4 py-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-8 space-x-2">
          <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
          <span class="text-yellow-400 text-sm font-semibold">شروع همکاری</span>
        </div>

        {/* Main Heading */}
        <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          آماده{' '}
          <span class="bg-linear-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            تحول
          </span>{' '}
          در کشاورزی خود هستید؟
        </h1>

        {/* Subtitle */}
        <p class="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          همین امروز به خانواده <span class="text-yellow-300 font-semibold">پربار باغستان</span> بپیوندید 
          و شاهد <span class="text-yellow-300 font-semibold">افزایش چندبرابری برداشت</span> خود باشید
        </p>

        {/* Stats */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-2xl lg:text-3xl font-bold text-white mb-2">۴۰٪+</div>
            <div class="text-green-200 text-sm">افزایش برداشت</div>
          </div>
          <div class="text-center">
            <div class="text-2xl lg:text-3xl font-bold text-white mb-2">۵۰۰+</div>
            <div class="text-green-200 text-sm">کشاورز راضی</div>
          </div>
          <div class="text-center">
            <div class="text-2xl lg:text-3xl font-bold text-white mb-2">۲۴/۷</div>
            <div class="text-green-200 text-sm">پشتیبانی</div>
          </div>
          <div class="text-center">
            <div class="text-2xl lg:text-3xl font-bold text-white mb-2">۱۰۰٪</div>
            <div class="text-green-200 text-sm">ضمانت کیفیت</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/consultation"
            class="group relative bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover-lift min-w-[200px]"
          >
            <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <span>🎯</span>
              <span>دریافت مشاوره رایگان</span>
            </div>
            <div class="absolute inset-0 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-300 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/products"
            class="group relative border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-white hover:text-green-700 hover:shadow-2xl hover-lift min-w-[200px]"
          >
            <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <span>🛒</span>
              <span>مشاهده محصولات</span>
            </div>
          </Link>
        </div>

        {/* Guarantee Badges */}
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <div class="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="text-yellow-400 ml-2">✓</span>
            <span class="text-sm">مشاوره رایگان</span>
          </div>
          <div class="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="text-yellow-400 ml-2">✓</span>
            <span class="text-sm">ارسال سریع</span>
          </div>
          <div class="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="text-yellow-400 ml-2">✓</span>
            <span class="text-sm">ضمانت بازگشت</span>
          </div>
          <div class="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2">
            <span class="text-yellow-400 ml-2">✓</span>
            <span class="text-sm">پشتیبانی دائمی</span>
          </div>
        </div>

        {/* Contact Info */}
        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white border-opacity-20">
          <div class="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <span>📞</span>
              <span class="font-semibold">تلفن:</span>
              <span>021-33370954</span>
            </div>
            <div class="w-px h-6 bg-white bg-opacity-30"></div>
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <span>🕒</span>
              <span class="font-semibold">ساعات:</span>
              <span>۸-۲۲</span>
            </div>
          </div>
          <p class="text-green-600 text-sm text-center">
            کارشناسان ما آماده پاسخگویی به سوالات شما هستند
          </p>
        </div>

        {/* Scroll Indicator */}
        <div class="mt-12 animate-bounce">
          <div class="w-6 h-10 border-2 border-white border-opacity-50 rounded-full flex justify-center mx-auto">
            <div class="w-1 h-3 bg-white bg-opacity-50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
});