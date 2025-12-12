// src/components/cart/LoadingCart.tsx
import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute top-0 left-0 w-24 h-24 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div class="text-center space-y-2">
        <p class="text-xl font-bold text-gray-800">در حال بارگذاری سبد خرید...</p>
        <p class="text-gray-500">لطفاً چند لحظه صبر کنید</p>
      </div>
    </div>
  );
});