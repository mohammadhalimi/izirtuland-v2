// src/components/auth/auth-panel.tsx
import { component$, useStore, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const nav = useNavigate();
  const authState = useStore({
    step: 'login' as 'login' | 'verify',
    phone: '',
    code: '',
    loading: false,
    error: ''
  });

  const sendOtp = $(async () => {
    if (!authState.phone.trim() || authState.phone.length !== 11) {
      authState.error = 'لطفاً شماره موبایل معتبر وارد کنید';
      return;
    }

    authState.loading = true;
    authState.error = '';

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authState.phone }),
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        authState.step = 'verify';
      } else {
        authState.error = data.message || 'خطا در ارسال کد تأیید';
      }
    } catch (err) {
      authState.error = 'خطا در ارتباط با سرور';
    } finally {
      authState.loading = false;
    }
  });

  const verifyOtp = $(async () => {
    if (!authState.code.trim() || authState.code.length !== 6) {
      authState.error = 'لطفاً کد ۶ رقمی را وارد کنید';
      return;
    }

    authState.loading = true;
    authState.error = '';

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: authState.phone, 
          code: authState.code 
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        // رفرش صفحه برای لود کامپوننت پروفایل
        window.location.reload();
      } else {
        authState.error = data.message || 'کد اشتباه است یا منقضی شده';
      }
    } catch (err) {
      authState.error = 'خطا در ارتباط با سرور';
    } finally {
      authState.loading = false;
    }
  });

  const goBack = $(() => {
    authState.step = 'login';
    authState.code = '';
    authState.error = '';
  });

  return (
    <div class="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* مرحله ورود شماره */}
        {authState.step === 'login' && (
          <>
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-linear-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl text-white">📱</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h1>
              <p class="text-gray-600">کد تأیید به شماره شما ارسال خواهد شد</p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  value={authState.phone}
                  onInput$={(e) => {
                    authState.phone = (e.target as HTMLInputElement).value;
                    authState.error = '';
                  }}
                  maxLength={11}
                />
              </div>

              {authState.error && (
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <span class="ml-2">⚠️</span>
                  <span class="text-sm">{authState.error}</span>
                </div>
              )}

              <button
                onClick$={sendOtp}
                disabled={authState.loading || !authState.phone.trim()}
                class="w-full bg-linear-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {authState.loading ? (
                  <>
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <span class="ml-2">📨</span>
                    ارسال کد تأیید
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* مرحله تأیید کد */}
        {authState.step === 'verify' && (
          <>
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl text-white">🔐</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">تأیید شماره موبایل</h1>
              <p class="text-gray-600 mb-1">کد ۶ رقمی به شماره زیر ارسال شد:</p>
              <p class="text-lg font-semibold text-gray-800 dir-ltr">{authState.phone}</p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  کد تأیید
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-center text-2xl font-bold tracking-widest"
                  placeholder="ـــ ـــ ـــ"
                  value={authState.code}
                  onInput$={(e) => {
                    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
                    authState.code = value.slice(0, 6);
                    authState.error = '';
                  }}
                  maxLength={6}
                />
              </div>

              {authState.error && (
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <span class="ml-2">⚠️</span>
                  <span class="text-sm">{authState.error}</span>
                </div>
              )}

              <div class="flex space-x-3">
                <button
                  onClick$={goBack}
                  class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                >
                  بازگشت
                </button>
                <button
                  onClick$={verifyOtp}
                  disabled={authState.loading || authState.code.length !== 6}
                  class="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  {authState.loading ? (
                    <>
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      در حال تأیید...
                    </>
                  ) : (
                    <>
                      <span class="ml-2">✅</span>
                      تأیید و ورود
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});