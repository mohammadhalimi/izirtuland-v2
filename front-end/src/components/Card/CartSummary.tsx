// src/components/cart/CartSummary.tsx
import { $, component$ } from '@builder.io/qwik';
import { ArrowRightIcon, ShieldIcon, ReceiptIcon, CheckIcon, TruckIcon } from '~/components/icons';

interface CartSummaryProps {
  totalPrice: number;
  totalUnits: number;
  isFreeShipping: boolean;
}

export default component$<CartSummaryProps>(({
  totalPrice,
  totalUnits,
  isFreeShipping
}) => {
  // فقط قیمت کالاها را نمایش می‌دهیم
  const items = [
    {
      label: `قیمت کالاها (${totalUnits} عدد)`,
      value: totalPrice,
      color: 'text-gray-900'
    },
  ];

  const check = [
    {
      text: "پشتیبانی ۲۴ ساعته در خدمت شماست",
      id: 1
    },
    {
      text: "حمل و نقل رایگان برای سفارش‌های بالای ۱۰ میلیون تومان",
      id: 2
    },
    {
      text: "سایر سفارش‌ها: هزینه حمل به صورت جداگانه (پس کرایه) محاسبه می‌شود",
      id: 3
    },
    {
      text: "ارسال سریع در تهران (۲۴ ساعت) و سایر شهرها (۴۸-۷۲ ساعت)",
      id: 4
    },
    {
      text: "هزینه دقیق حمل پس از ثبت سفارش توسط پشتیبانی اعلام می‌گردد",
      id: 5
    },
  ]
  // در حالت پس کرایه، فقط قیمت کالاها را نمایش می‌دهیم
  const total = totalPrice;
const goToCheckout$ = $(() => {
  const cartStr = localStorage.getItem('perebar_cart');
  if (!cartStr) return;

  let cartItems: any[] = [];
  let checkoutItems: any[] = [];

  try {
    cartItems = JSON.parse(cartStr);
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    const checkoutStr = localStorage.getItem('perebar_checkout');
    if (checkoutStr) {
      checkoutItems = JSON.parse(checkoutStr);
      if (!Array.isArray(checkoutItems)) {
        checkoutItems = [];
      }
    }
  } catch (err) {
    console.error('LocalStorage parse error', err);
    return;
  }

  // ✅ اضافه شدن آیتم‌های جدید به قبلی‌ها
  const mergedCheckout = [...checkoutItems, ...cartItems];

  localStorage.setItem(
    'perebar_checkout',
    JSON.stringify(mergedCheckout)
  );

  // خالی کردن سبد خرید
  localStorage.removeItem('perebar_cart');

  // رفتن به پنل کاربر
  window.location.assign('/User');
});

  return (
    <div class="sticky top-28">
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-600 opacity-90"></div>
          <div class="relative p-6">
            <h2 class="text-2xl font-bold text-white mb-2">خلاصه سفارش</h2>
            <p class="text-green-100">هزینه حمل و نقل به صورت جداگانه محاسبه می‌شود</p>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} class="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div class="flex flex-col">
                  <span class="text-gray-600">{item.label}</span>
                </div>
                <span class={`font-semibold ${item.color}`}>
                  {Math.abs(item.value).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            ))}

            {/* بخش هزینه حمل و نقل */}
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <div class="flex flex-col">
                <span class="text-gray-600">هزینه حمل و نقل</span>
                <span class={`text-xs ${isFreeShipping ? 'text-green-600 font-medium' : 'text-blue-600'} mt-1`}>
                  {isFreeShipping ? 'رایگان' : 'پس کرایه'}
                </span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 italic">
                  {isFreeShipping ? 'رایگان' : 'محاسبه پس از ثبت'}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 my-4"></div>

            <div class="flex justify-between items-center py-4 bg-linear-to-r from-gray-50 to-white rounded-xl px-4">
              <div>
                <span class="text-lg font-bold text-gray-900">مجموع قابل پرداخت</span>
                <p class="text-sm text-gray-500 mt-1">قیمت کالاها ({totalUnits} عدد)</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">
                  {total.toLocaleString('fa-IR')}
                </div>
                <div class="text-sm text-gray-500">تومان</div>
              </div>
            </div>
          </div>

          {/* توضیح درباره پس کرایه */}
          {!isFreeShipping && (
            <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <TruckIcon />
                </div>
                <div>
                  <p class="text-sm font-bold text-blue-800 mb-1">نحوه محاسبه هزینه حمل و نقل</p>
                  <ul class="text-xs text-blue-700 space-y-1">
                    <li class="flex items-start gap-1">
                      <span class="mt-0.5">•</span>
                      <span>هزینه حمل و نقل بر اساس وزن کالاها و مسافت محاسبه می‌شود</span>
                    </li>
                    <li class="flex items-start gap-1">
                      <span class="mt-0.5">•</span>
                      <span>پس از ثبت سفارش، هزینه دقیق توسط پشتیبانی اعلام می‌شود</span>
                    </li>
                    <li class="flex items-start gap-1">
                      <span class="mt-0.5">•</span>
                      <span>هزینه حمل به صورت جداگانه و هنگام تحویل دریافت می‌گردد</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isFreeShipping && (
            <div class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <TruckIcon />
                </div>
                <div>
                  <p class="text-sm font-bold text-green-800 mb-1">تبریک! حمل و نقل رایگان</p>
                  <p class="text-xs text-green-700">
                    سفارش شما بالای ۱۰ میلیون تومان است و شامل حمل و نقل رایگان می‌شود.
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick$={goToCheckout$}
            class="mt-8 w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <ArrowRightIcon />
            <span class="text-lg">ادامه جهت تسویه حساب</span>
          </button>
          <div class="mt-8 space-y-4">
            <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <ShieldIcon />
              <div>
                <p class="font-medium text-gray-900">پرداخت امن</p>
                <p class="text-sm text-gray-600">اطلاعات شما محفوظ است</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <ReceiptIcon />
          </div>
          <div>
            <p class="font-bold text-gray-900">نکات مهم:</p>
            <ul class="mt-2 space-y-2 text-sm text-gray-600 text-justify ">
              {check.map((check) => (
                <li key={check.id} class="flex items-start gap-2 ">
                  <CheckIcon />
                  <span>{check.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});