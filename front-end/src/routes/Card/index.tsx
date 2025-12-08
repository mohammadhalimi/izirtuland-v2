// src/routes/card/index.tsx
import { component$, useContext, $, useTask$ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';
import { CartContext } from '~/context/cart-context';

export default component$(() => {
  const cart = useContext(CartContext);

  const removeItem = $(async (id: string) => {
    if (cart.removeItem) {
      await cart.removeItem(id);
    }
  });

  const updateQuantity = $(async (id: string, change: number) => {
    if (cart.updateQuantity) {
      const item = cart.items.find((item: any) => item.id === id);
      if (item) {
        await cart.updateQuantity(id, Math.max(1, item.quantity + change));
      }
    }
  });

  const totalPrice = cart.items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
  const totalItems = cart.items.reduce((sum: number, it: any) => sum + it.quantity, 0);

  // نمایش وضعیت لود
  useTask$(() => {
    console.log('Cart items in card page:', cart.items);
    console.log('Cart loaded:', cart.loaded);
  });

  return (
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">سبد خرید</h1>

      {!cart.loaded ? (
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">در حال بارگذاری سبد خرید...</p>
        </div>
      ) : cart.items.length === 0 ? (
        <div class="text-center py-12 bg-gray-50 rounded-lg">
          <svg class="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-4 text-gray-600 text-lg">سبد خرید شما خالی است.</p>
          <a href="/Products" class="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            مشاهده محصولات
          </a>
        </div>
      ) : (
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-700">تعداد کل آیتم‌ها:</span>
              <span class="font-bold text-lg">{totalItems} عدد</span>
            </div>
          </div>

          {cart.items.map((item: any) => (
            <div key={item.id} class="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              {/* تصویر */}
              <div class="w-24 h-24 shrink-0">
                {item.image ? (
                  <img
                    src={item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`}
                    alt={item.name}
                    class="w-full h-full object-cover rounded-md"
                    onError$={(e) => {
                      (e.target as HTMLImageElement).src = '/no-image.png';
                    }}
                  />
                ) : (
                  <div class="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                    <span class="text-gray-500 text-sm">بدون تصویر</span>
                  </div>
                )}
              </div>

              {/* اطلاعات محصول */}
              <div class="flex-1 mr-4">
                <h2 class="font-semibold text-lg">{item.name}</h2>
                <p class="text-gray-500 text-sm mt-1">{item.packageSize}</p>
                {item.brand && <p class="text-sm text-gray-600">برند: {item.brand}</p>}
                <p class="mt-2 text-lg font-bold text-green-700">
                  {item.price.toLocaleString('fa-IR')} تومان
                </p>

                {/* کنترل تعداد */}
                <div class="flex items-center gap-3 mt-3">
                  <button
                    class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    onClick$={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span class="px-4 py-1 bg-gray-100 rounded-md min-w-10 text-center">
                    {item.quantity}
                  </span>

                  <button
                    class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    onClick$={() => updateQuantity(item.id, +1)}
                  >
                    +
                  </button>

                  <span class="mr-auto text-gray-700">
                    جمع: {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              {/* دکمه حذف */}
              <button
                class="text-red-600 hover:text-red-800 font-bold px-3 py-1 hover:bg-red-50 rounded transition-colors"
                onClick$={() => {
                  if (confirm(`آیا از حذف "${item.name}" از سبد خرید مطمئن هستید؟`)) {
                    removeItem(item.id);
                  }
                }}
              >
                حذف
              </button>
            </div>
          ))}

          {/* قیمت کل */}
          <div class="p-6 border rounded-lg text-xl font-bold flex justify-between items-center bg-linear-to-r from-green-50 to-emerald-50">
            <span>مجموع مبلغ قابل پرداخت:</span>
            <span class="text-2xl text-green-700">
              {totalPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>

          {/* دکمه ثبت سفارش */}
          <div class="flex gap-4 pt-6">
            <button
              class="flex-1 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl text-lg font-bold transition-colors shadow-lg"
              onClick$={() => {
                window.location.href = "/checkout";
              }}
            >
              ادامه و ثبت سفارش
            </button>
            <button
              class="px-6 py-4 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
              onClick$={() => {
                if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟')) {
                  if (cart.clearCart) {
                    cart.clearCart();
                  }
                }
              }}
            >
              خالی کردن سبد
            </button>
          </div>
        </div>
      )}
    </div>
  );
});