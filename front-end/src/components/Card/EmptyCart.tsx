// src/components/cart/EmptyCart.tsx
import { component$ } from '@builder.io/qwik';
import { CartIcon, ArrowRightIcon } from '~/components/icons';

export default component$(() => {
  return (
    <div class="text-center py-20 sm:py-32">
      <div class="max-w-lg mx-auto">
        <div class="relative mx-auto mb-10">
          <div class="w-40 h-40 mx-auto bg-linear-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center shadow-xl">
            <CartIcon />
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">سبد خرید شما خالی است</h2>
        <p class="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          محصولات مورد علاقه خود را پیدا کنید و آنها را به سبد خرید اضافه کنید
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/Products" class="inline-flex items-center justify-center gap-3 px-10 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1">
            <CartIcon />
            <span>مشاهده محصولات</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </div>
  );
});