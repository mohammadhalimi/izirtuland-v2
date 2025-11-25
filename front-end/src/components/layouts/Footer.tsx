import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <footer class="bg-linear-to-b from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: About */}
          <div class="lg:col-span-1">
            <div class="flex items-center mb-6">
              <div class="text-2xl font-bold text-green-400">پربار باغستان</div>
            </div>
            <p class="text-gray-300 mb-6 leading-relaxed text-justify">
              شرکت تولیدی پربار باغستان (سهامی خاص) در سال ۱۳۸۵ با تولید کودهای گرانوله شیمیایی و ارگانیک فعالیت خود را آغاز نمود.            </p>
            <div class="flex space-x-4 ">
              <a href="#" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span>📱</span>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span>📸</span>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span>💬</span>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span>📧</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 class="text-lg font-semibold mb-6 text-green-400">دسترسی سریع</h3>
            <ul class="space-y-3">
              <li>
                <Link href="/" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🏠</span>
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/products" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📦</span>
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/blog" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📝</span>
                  وبلاگ آموزشی
                </Link>
              </li>
              <li>
                <Link href="/about" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">ℹ️</span>
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📞</span>
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 class="text-lg font-semibold mb-6 text-green-400">محصولات</h3>
            <ul class="space-y-3">
              <li>
                <Link href="/chemical" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🧪</span>
                  کودهای شیمیایی
                </Link>
              </li>
              <li>
                <Link href="/organic" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🌿</span>
                  کودهای ارگانیک
                </Link>
              </li>
              <li>
                <Link href="/pesticides" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🐛</span>
                  سموم کشاورزی
                </Link>
              </li>
              <li>
                <Link href="/seeds" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🌱</span>
                  بذر و نهال
                </Link>
              </li>
              <li>
                <Link href="/tools" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">🛠️</span>
                  تجهیزات کشاورزی
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 class="text-lg font-semibold mb-6 text-green-400">راه‌های ارتباطی</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <span class="ml-3 mt-1">📍</span>
                <div>
                  <p class="text-gray-300">تهران، خیابان ولیعصر، پلاک ۱۲۳۴</p>
                  <p class="text-gray-400 text-sm">دفتر مرکزی</p>
                </div>
              </div>
              <div class="flex items-center">
                <span class="ml-3">📞</span>
                <div>
                  <p class="text-gray-300">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  <p class="text-gray-400 text-sm">پشتیبانی ۲۴/۷</p>
                </div>
              </div>
              <div class="flex items-center">
                <span class="ml-3">📧</span>
                <div>
                  <p class="text-gray-300">info@porbar-baghstan.ir</p>
                  <p class="text-gray-400 text-sm">ایمیل رسمی</p>
                </div>
              </div>
              <div class="flex items-center">
                <span class="ml-3">🕒</span>
                <div>
                  <p class="text-gray-300">شنبه تا پنجشنبه: ۸:۰۰ - ۲۲:۰۰</p>
                  <p class="text-gray-400 text-sm">جمعه: ۹:۰۰ - ۱۸:۰۰</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div class="border-t border-gray-700">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-wrap justify-center items-center gap-8">
            <div class="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
              <span>✅</span>
              <span>ضمانت اصالت کالا</span>
            </div>
            <div class="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
              <span>🚚</span>
              <span>ارسال به سراسر کشور</span>
            </div>
            <div class="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
              <span>💳</span>
              <span>پرداخت امن</span>
            </div>
            <div class="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
              <span>📞</span>
              <span>پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div class="border-t border-gray-700 bg-gray-900">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-gray-400 text-sm mb-4 md:mb-0">
              © ۱۴۰۲ پربار باغستان. تمام حقوق محفوظ است.
            </div>
            <div class="flex flex-wrap justify-center text-sm">
              <Link href="https://mohammadhalimi.ir/" class="text-gray-400 hover:text-green-400 transition-colors duration-300">
                طراحی و ساخت توسط mohammad halimi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});