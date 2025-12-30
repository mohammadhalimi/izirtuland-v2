// src/components/cart/CartActions.tsx
import { component$ } from '@builder.io/qwik';
import { CheckIcon, TrashIcon } from '~/components/icons';
import { CartActionsProps } from '../types/card';

export default component$<CartActionsProps>(({ uniqueProducts, totalUnits, onClearCart }) => {
  return (
    <div class="mb-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">محصولات انتخابی شما</h2>
          <p class="text-gray-500 mt-1">
            {uniqueProducts} محصول ({totalUnits} عدد)
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <CheckIcon />
            <span class="font-medium">قابل ویرایش</span>
          </div>
          <button
            onClick$={onClearCart}
            class="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <TrashIcon />
            <span class="font-medium">خالی کردن سبد</span>
          </button>
        </div>
      </div>
      <div class="h-1.5 w-full bg-linear-to-r from-green-500 via-emerald-500 to-green-500 rounded-full opacity-80"></div>
    </div>
  );
});