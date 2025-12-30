import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';
import type { PaymentData } from '~/components/types/payemnt';

export default component$(() => {
  const loc = useLocation();
  
  const state = useStore<{
    paymentData: PaymentData | null;
    isLoading: boolean;
    error: string;
  }>({
    paymentData: null,
    isLoading: true,
    error: ''
  });

  useVisibleTask$(async () => {
    try {
      // استخراج پارامترها از URL
      // روش 1: از searchParams استفاده کنیم
      const params = new URLSearchParams(loc.url.search);
      
      // روش 2: همچنین می‌توانیم از object URL استفاده کنیم
      const url = new URL(loc.url.href);
      const searchParams = url.searchParams;
      const orderId = params.get('orderId') || searchParams.get('orderId');
      const trackId = params.get('trackId') || searchParams.get('trackId');
      const refNumber = params.get('refNumber') || searchParams.get('refNumber')

      if (!orderId || !trackId) {
        state.error = 'اطلاعات پرداخت ناقص است';
        return;
      }

      state.paymentData = {
        orderId,
        trackId,
        refNumber: refNumber || undefined,
        paidAt: new Date().toISOString()
      };

      // پاک کردن سبد خرید
      localStorage.removeItem('perebar_checkout');
      localStorage.removeItem('current_order');
      
      // ذخیره سفارش در تاریخچه
      try {
        const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        existingOrders.unshift({
          _id: orderId,
          orderNumber: orderId,
          items: JSON.parse(localStorage.getItem('last_order_items') || '[]'),
          status: 'completed',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          payment: {
            trackId,
            paidAt: new Date().toISOString(),
            refNumber: refNumber || undefined
          }
        });
        localStorage.setItem('user_orders', JSON.stringify(existingOrders));
      } catch (storageError) {
        console.error('Storage error:', storageError);
      }

    } catch (error) {
      console.error('❌ Error processing success page:', error);
      state.error = 'خطا در پردازش اطلاعات پرداخت';
    } finally {
      state.isLoading = false;
    }
  });

  if (state.isLoading) {
    return (
      <div class="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">در حال بارگذاری اطلاعات پرداخت...</p>
          <p class="text-sm text-gray-500 mt-2">لطفا صبر کنید</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div class="min-h-screen bg-linear-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 mb-3">❌ خطا</h1>
          <p class="text-gray-700 mb-6">{state.error}</p>
          
          <div class="space-y-3">
            <Link
              href="/user"
              class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              بازگشت به صفحه کاربر
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-3">✅ پرداخت موفق</h1>
        <p class="text-gray-600 mb-6">
          سفارش شما با موفقیت ثبت و پرداخت شد.
        </p>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">شماره سفارش:</span>
              <span class="font-mono font-medium text-gray-900">
                {state.paymentData?.orderId || 'نامشخص'}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">کد رهگیری:</span>
              <span class="font-mono font-bold text-blue-600">
                {state.paymentData?.trackId || 'نامشخص'}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">مبلغ پرداختی:</span>
            </div>
            {state.paymentData?.refNumber && (
              <div class="flex justify-between items-center">
                <span class="text-gray-600">شماره پیگیری بانک:</span>
                <span class="font-mono text-sm">{state.paymentData.refNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        <div class="space-y-3">
          <Link
            href="/User"
            class="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            مشاهده سفارش‌های من
          </Link>
          <Link
            href="/"
            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600">
              شماره سفارش: <span class="font-medium">{state.paymentData?.orderId}</span>
            </p>
            <p class="text-xs text-gray-500">
              این شماره را برای پیگیری حفظ کنید
            </p>
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <span>📧</span>
              <span>رسید پرداخت به ایمیل شما ارسال خواهد شد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});