// src/components/cart/ShippingProgress.tsx
import { component$ } from '@builder.io/qwik';
import { TruckIcon } from '~/components/icons';
import { ShippingProgressProps } from '../types/card';

export default component$<ShippingProgressProps>(({ totalPrice, shippingThreshold }) => {
  const progress = Math.min((totalPrice / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - totalPrice;
  const isFreeShipping = totalPrice >= shippingThreshold;

  return (
    <div class="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-lg">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
            <TruckIcon />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">حمل و نقل {isFreeShipping ? 'رایگان' : 'پس کرایه'}</h3>
            <p class="text-gray-600 mt-1">
              {isFreeShipping
                ? 'تبریک! سفارش شما شامل حمل و نقل رایگان می‌شود 🎉'
                : `فقط ${remaining.toLocaleString('fa-IR')} تومان دیگر برای حمل رایگان`
              }
            </p>
            {!isFreeShipping && (
              <p class="text-sm text-blue-600 mt-2">
                هزینه حمل بر اساس وزن و مسافت، پس از ثبت سفارش محاسبه می‌شود
              </p>
            )}
          </div>
        </div>

        <div class="text-right">
          <div class="text-3xl font-bold text-green-600">
            {Math.round(progress)}%
          </div>
          <div class="text-sm text-gray-500">پیشرفت شما</div>
        </div>
      </div>

      <div class="relative">
        <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});