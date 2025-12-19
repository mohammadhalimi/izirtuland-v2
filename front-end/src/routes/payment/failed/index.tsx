import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';

export default component$(() => {
  const loc = useLocation();
  const params = new URLSearchParams(loc.url.search);
  
  const state = useStore<{
    errorMessage: string;
    orderId: string | null;
  }>({
    errorMessage: 'پرداخت ناموفق بود',
    orderId: null
  });

  useVisibleTask$(() => {
    const error = params.get('error');
    const orderId = params.get('orderId');
    
    if (error) {
      state.errorMessage = decodeURIComponent(error);
    }
    
    if (orderId) {
      state.orderId = orderId;
    }

    // پاک کردن سبد خرید در صورت شکست پرداخت
    const savedOrder = localStorage.getItem('current_order');
    if (savedOrder) {
      localStorage.removeItem('current_order');
    }
  });

  return (
    <div class="min-h-screen bg-linear-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-3">❌ پرداخت ناموفق</h1>
        <p class="text-gray-700 mb-6 leading-relaxed">
          {state.errorMessage}
        </p>
        
        {state.orderId && (
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">شماره سفارش:</span>
                <span class="font-mono font-medium">{state.orderId}</span>
              </div>
              <p class="text-sm text-gray-500 text-right mt-2">
                سفارش شما در انتظار پرداخت باقی ماند
              </p>
            </div>
          </div>
        )}
        
        <div class="space-y-3">
          <Link
            href="/Card"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            بازگشت به سبد خرید
          </Link>
          <Link
            href="/User"
            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            مشاهده سفارش‌ها
          </Link>
          <Link
            href="/"
            class="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="space-y-2">
            <p class="text-sm text-gray-600">
              در صورت کسر مبلغ از حساب شما، طی ۷۲ ساعت به حساب شما باز خواهد گشت.
            </p>
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>📞</span>
              <span>برای پیگیری با پشتیبانی تماس بگیرید</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});