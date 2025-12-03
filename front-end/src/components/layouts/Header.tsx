import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  const isMenuOpen = useSignal(false);

  // برای کنترل اسکرول body وقتی منو باز است
  useVisibleTask$(({ track }) => {
    track(() => isMenuOpen.value);
    if (isMenuOpen.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  return (
    <header class="sticky top-0 z-100 bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* لوگو */}
          <Link href="/" class="flex items-center">
            <div class="text-2xl font-bold text-green-600">
              پربار باغستان
            </div>
          </Link>

          {/* منوی اصلی - دسکتاپ */}
          <nav class="hidden md:flex items-center space-x-8">
            <Link href="/" class="text-gray-700 hover:text-green-600 transition-colors duration-200">خانه</Link>
            <div class="relative group">
              <button class="text-gray-700 hover:text-green-600 transition-colors duration-200 flex items-center">
                محصولات
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">کودهای شیمیایی</Link>
                <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">کودهای ارگانیک</Link>
                <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">سموم کشاورزی</Link>
              </div>
            </div>
            <Link href="/Blog" class="text-gray-700 hover:text-green-600 transition-colors duration-200">وبلاگ</Link>
            <Link href="/About" class="text-gray-700 hover:text-green-600 transition-colors duration-200">درباره ما</Link>
            <Link href="/Contact" class="text-gray-700 hover:text-green-600 transition-colors duration-200">تماس</Link>
          </nav>

          {/* آیکون‌های سمت چپ */}
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button class="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button class="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">۳</span>
            </button>

            {/* دکمه منوی موبایل با آیکون تغییرپذیر */}
            <button 
              class="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 relative w-8 h-8"
              onClick$={() => isMenuOpen.value = !isMenuOpen.value}
            >
              {/* آیکون همبرگر */}
              <svg 
                class={`w-6 h-6 absolute top-1 left-1 transition-all duration-300 hover:cursor-pointer ${
                  isMenuOpen.value ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              
              {/* آیکون ضربدر */}
              <svg 
                class={`w-6 h-6 absolute top-1 left-1 transition-all duration-300 hover:cursor-pointer ${
                  isMenuOpen.value ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* منوی موبایل به صورت OVERLAY - روی محتوا نمایش داده می‌شود */}
        <div class={`
          md:hidden fixed inset-0 top-16 bg-white z-40
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isMenuOpen.value ? 
            'opacity-100 visible translate-x-0' : 
            'opacity-0 invisible translate-x-full'
          }
        `}>
          <div class="py-6 space-y-4 px-6">
            <Link 
              href="/" 
              class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
              onClick$={() => isMenuOpen.value = false}
            >
              🏠 خانه
            </Link>
            
            <div class="px-4 py-3">
              <div class="text-gray-700 font-medium mb-3 flex items-center text-lg">
                📦 محصولات
              </div>
              <div class="space-y-3 pr-4">
                <Link 
                  href="/Products" 
                  class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                  onClick$={() => isMenuOpen.value = false}
                >
                  • کودهای شیمیایی
                </Link>
                <Link 
                  href="/Products" 
                  class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                  onClick$={() => isMenuOpen.value = false}
                >
                  • کودهای ارگانیک
                </Link>
                <Link 
                  href="/Products" 
                  class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                  onClick$={() => isMenuOpen.value = false}
                >
                  • سموم کشاورزی
                </Link>
              </div>
            </div>
            
            <Link 
              href="/Blog" 
              class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
              onClick$={() => isMenuOpen.value = false}
            >
              📝 وبلاگ
            </Link>
            <Link 
              href="/About" 
              class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
              onClick$={() => isMenuOpen.value = false}
            >
              ℹ️ درباره ما
            </Link>
            <Link 
              href="/Contact" 
              class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
              onClick$={() => isMenuOpen.value = false}
            >
              📞 تماس
            </Link>
          </div>
        </div>

        {/* overlay برای بستن منو با کلیک روی فضای خالی */}
        {isMenuOpen.value && (
          <div 
            class="md:hidden fixed inset-0 top-16 bg-black bg-opacity-50 z-30"
            onClick$={() => isMenuOpen.value = false}
          />
        )}
      </div>
    </header>
  );
});