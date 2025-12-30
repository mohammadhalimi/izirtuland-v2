// src/components/cart/CartHeader.tsx
import { component$ } from '@builder.io/qwik';
import { ArrowLeftIcon, CartIcon } from '~/components/icons';
import { CartHeaderProps } from '../types/card';

export default component$<CartHeaderProps>(({ uniqueProducts, totalUnits, totalPrice }) => {
  return (
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <a href="/Products" class="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors font-medium group">
            <ArrowLeftIcon />
            <span class="hidden sm:inline">بازگشت به فروشگاه</span>
            <span class="sm:hidden">بازگشت</span>
          </a>

          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CartIcon />
              </div>
              {uniqueProducts > 0 && (
                <div class="absolute -top-2 -right-2 w-7 h-7 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {uniqueProducts}
                </div>
              )}
            </div>

            <div class="text-right">
              <h1 class="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                سبد خرید
              </h1>
              <p class="text-sm text-gray-500">
                {uniqueProducts > 0
                  ? `${uniqueProducts} محصول (${totalUnits} عدد)`
                  : 'محصولات انتخابی شما'
                }
              </p>
            </div>
          </div>

          <div class="hidden md:block">
            <div class="text-right">
              <p class="text-sm text-gray-600">قیمت موقت</p>
              <p class="text-lg font-bold text-gray-900">
                {totalPrice.toLocaleString('fa-IR')} تومان
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});