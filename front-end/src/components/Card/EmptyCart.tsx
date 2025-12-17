// src/components/cart/EmptyCart.tsx
import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="min-h-[70vh] flex items-center justify-center p-4">
      <div class="max-w-2xl mx-auto w-full">
        <div class="relative">
          {/* افکت پس‌زمینه */}
          <div class="absolute inset-0 bg-linear-to-r from-green-500/5 to-emerald-500/5 blur-3xl rounded-full"></div>
          
          {/* کارت اصلی */}
          <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* هدر گرادیان */}
            <div class="h-3 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            <div class="p-10 md:p-12">
              {/* آیکون انیمیشنی */}
              <div class="relative mb-10">
                <div class="relative mx-auto w-48 h-48">
                  {/* کارت خالی */}
                  <div class="absolute inset-8 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                    <div class="relative">
                      {/* آیکون سبد خرید */}
                      <svg class="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      
                      {/* علامت تعجب */}
                      <div class="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        !
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* متن */}
              <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                  سبد خرید خالی است
                </h1>
                
                <p class="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                  هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. بیایید خرید را شروع کنیم!
                </p>
                
                {/* نکات */}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div class="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span class="text-2xl">🛒</span>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">محصولات متنوع</h3>
                    <p class="text-gray-600 text-sm">صدها محصول با کیفیت</p>
                  </div>
                  
                  <div class="bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span class="text-2xl">🚚</span>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">ارسال سریع</h3>
                    <p class="text-gray-600 text-sm">تحویل در کمترین زمان</p>
                  </div>
                  
                  <div class="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <span class="text-2xl">⭐</span>
                    </div>
                    <h3 class="font-bold text-gray-800 mb-2">ضمانت کیفیت</h3>
                    <p class="text-gray-600 text-sm">تضمین اصالت کالا</p>
                  </div>
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/Products" 
                  class="group relative flex items-center justify-center gap-4 px-10 py-5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* افکت hover */}
                  <div class="absolute inset-0 bg-linear-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div class="relative z-10 flex items-center gap-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>جستجوی محصولات</span>
                    <svg class="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="/" 
                  class="group flex items-center justify-center gap-4 px-10 py-5 bg-white text-gray-800 font-bold text-lg rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>بازگشت به خانه</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});