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
            <div class="lg:col-span-1">
              <div class="flex items-center mb-6">
                <div class="text-2xl font-bold text-green-400">پربار باغستان</div>
              </div>
              <p class="text-gray-300 mb-6 leading-relaxed text-justify">
                شرکت تولیدی پربار باغستان (سهامی خاص) در سال ۱۳۸۵ با تولید کودهای گرانوله شیمیایی و ارگانیک فعالیت خود را آغاز نمود.
              </p>

              <div class="space-y-4">
                <p class="text-sm text-gray-400 font-medium">ما را در شبکه‌های اجتماعی دنبال کنید:</p>

                <div class="flex space-x-4">
                  {/* اینستاگرام */}
                  <a
                    href="https://www.instagram.com/porbarebaghestan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden"
                    aria-label="اینستاگرام"
                    title="صفحه اینستاگرام پربار باغستان"
                  >
                    {/* Background gradient */}
                    <div class="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Default background */}
                    <div class="absolute inset-0 bg-gray-700 group-hover:opacity-0 transition-opacity duration-300"></div>

                    {/* Icon */}
                    <span class="relative text-lg group-hover:text-white transition-colors duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </span>
                  </a>

                  {/* تلگرام */}
                  <a
                    href="https://t.me/porbarbaghestan"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden"
                    aria-label="تلگرام"
                    title="کانال تلگرام پربار باغستان"
                  >
                    {/* Background gradient */}
                    <div class="absolute inset-0 bg-linear-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Default background */}
                    <div class="absolute inset-0 bg-gray-700 group-hover:opacity-0 transition-opacity duration-300"></div>

                    {/* Icon */}
                    <span class="relative text-lg group-hover:text-white transition-colors duration-300">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
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
                <Link href="/Products" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📦</span>
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/Blog" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📝</span>
                  وبلاگ آموزشی
                </Link>
              </li>
              <li>
                <Link href="/About" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">ℹ️</span>
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/Contact" class="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span class="ml-2">📞</span>
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=565423&Code=l0OgPL6bH7L51AQyiSkapdAxl0JQe8WF"
              aria-label="نماد اعتماد الکترونیک"
              title="نماد اعتماد الکترونیک"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=565423&Code=l0OgPL6bH7L51AQyiSkapdAxl0JQe8WF"
                alt="نماد اعتماد الکترونیک"
                width="100"
                height="100"
                style={{
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </a>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 class="text-lg font-semibold mb-6 text-green-400">راه‌های ارتباطی</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <span class="ml-3 mt-1">📍</span>
                <div>
                  <p class="text-gray-300">تهران، خیابان شهید بهشتی ، خیابان اندیشه اصلی ، بین اندیشه ۱و۲ ، پلاک ۵۲ ، واحد ۲</p>
                  <p class="text-gray-400 text-sm">دفتر مرکزی</p>
                </div>
              </div>
              <div class="flex items-center">
                <span class="ml-3">📞</span>
                <div>
                  <p class="text-gray-300">02133370954</p>
                  <p class="text-gray-400 text-sm">پشتیبانی ۲۴/۷</p>
                </div>
              </div>
              <div class="flex items-center">
                <span class="ml-3">📧</span>
                <div>
                  <p class="text-gray-300">jamal.sufiyan90@gmail.com</p>
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