import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, Link } from '@builder.io/qwik-city';
import type { PaymentData } from '~/components/types/payemnt';
import { API_BASE_URL } from '~/config/api';

// تابع لاگ برای حالت توسعه
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export default component$(() => {
  const loc = useLocation();

  const state = useStore<{
    paymentData: PaymentData | null;
    isLoading: boolean;
    error: string;
    smsSent: {
      user: boolean;
      admin: boolean;
    };
    smsError: string;
  }>({
    paymentData: null,
    isLoading: true,
    error: '',
    smsSent: {
      user: false,
      admin: false
    },
    smsError: ''
  });

  useVisibleTask$(async () => {
    try {
      // استخراج پارامترها از URL
      const params = new URLSearchParams(loc.url.search);
      const orderId = params.get('orderId');
      const trackId = params.get('trackId');
      const refNumber = params.get('refNumber');

      if (!orderId || !trackId) {
        state.error = 'اطلاعات پرداخت ناقص است';
        state.isLoading = false;
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
        const lastOrderItems = JSON.parse(localStorage.getItem('last_order_items') || '[]');

        existingOrders.unshift({
          _id: orderId,
          orderNumber: orderId,
          items: lastOrderItems,
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
        console.error('❌ Storage error:', storageError);
      }

      state.isLoading = false;

    } catch (error) {
      console.error('❌ Error processing success page:', error);
      state.error = 'خطا در پردازش اطلاعات پرداخت';
      state.isLoading = false;
    }
  });

  useVisibleTask$(async () => {
    // صبر کنید تا state.isLoading false شود و paymentData پر شود
    if (state.isLoading || !state.paymentData?.orderId || !state.paymentData?.trackId) {
      devLog('⏳ منتظر آماده‌سازی داده‌ها...');
      return;
    }

    // بررسی اینکه آیا پیامک‌ها قبلاً ارسال شده‌اند
    const smsSentStatus = localStorage.getItem(`smsSent_${state.paymentData.orderId}`);
    if (smsSentStatus) {
      return; // از ارسال مجدد پیامک جلوگیری می‌کنیم
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sms/order-confirmation`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: state.paymentData.orderId,
            trackId: state.paymentData.trackId
          })
        }
      );

      const result = await response.json();
      
      if (result.success) {
        state.smsSent.user = result.data?.smsResults?.user?.sent || false;
        state.smsSent.admin = result.data?.smsResults?.admin?.sent || false;

        // ذخیره وضعیت ارسال پیامک در localStorage
        localStorage.setItem(`smsSent_${state.paymentData.orderId}`, 'true');
      } else {
        devLog('⚠️ خطا در ارسال اس‌ام‌اس:', result.message);
        state.smsError = result.message || 'خطا در ارسال پیامک تأیید';
      }
    } catch (error) {
      console.error('❌ خطا در فراخوانی API:', error);
      state.smsError = 'خطا در ارتباط با سرور';
    }
  });

  // نمایش وضعیت اس‌ام‌اس در UI
  const renderSMSStatus = () => {
    if (state.smsError) {
      return (
        <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div class="flex items-center justify-center gap-2 text-yellow-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm">{state.smsError}</span>
          </div>
        </div>
      );
    }

    if (state.smsSent.user || state.smsSent.admin) {
      return (
        <div class="space-y-2 mt-4">
          {state.smsSent.user && (
            <div class="flex items-center justify-center gap-2 p-2 bg-green-50 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-green-700">پیامک تأیید برای شما ارسال شد</span>
            </div>
          )}

          {state.smsSent.admin && (
            <div class="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-blue-700">اطلاع‌رسانی به مدیریت ارسال شد</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-center gap-2 text-gray-600">
          <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm">در حال ارسال پیامک تأیید...</span>
        </div>
      </div>
    );
  };

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
            {state.paymentData?.refNumber && (
              <div class="flex justify-between items-center">
                <span class="text-gray-600">شماره پیگیری بانک:</span>
                <span class="font-mono text-sm">{state.paymentData.refNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* نمایش وضعیت ارسال اس‌ام‌اس */}
        {renderSMSStatus()}

        <div class="space-y-3 mt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
});