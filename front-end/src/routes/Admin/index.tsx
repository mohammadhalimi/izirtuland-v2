// src/routes/admin/login/index.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const nav = useNavigate();
  const email = useSignal('');
  const password = useSignal('');
  const rememberMe = useSignal(false);
  const isLoading = useSignal(false);
  const showPassword = useSignal(false);

  const handleLogin = $(async () => {
    if (!email.value || !password.value) {
      alert('لطفا ایمیل و رمز عبور را وارد کنید');
      return;
    }

    isLoading.value = true;
    
    // شبیه‌سازی فرآیند لاگین
    setTimeout(() => {
      isLoading.value = false;
      if (email.value === 'admin@porbar-baghstan.ir' && password.value === 'admin123') {
        nav('/admin');
      } else {
        alert('ایمیل یا رمز عبور اشتباه است');
      }
    }, 1500);
  });

  const togglePasswordVisibility = $(() => {
    showPassword.value = !showPassword.value;
  });

  return (
    <div class="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/4 w-60 h-60 bg-green-100 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div class="relative w-full max-w-md">
        {/* Login Card */}
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          {/* Header */}
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-6">
              <div class="w-12 h-12 bg-linear-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                🌿
              </div>
              <div class="mr-3 text-right">
                <h1 class="text-2xl font-bold text-gray-800">پربار باغستان</h1>
                <p class="text-green-600 text-sm font-medium">پنل مدیریت</p>
              </div>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">خوش آمدید</h2>
            <p class="text-gray-600">لطفا وارد حساب کاربری خود شوید</p>
          </div>

          {/* Login Form */}
          <form 
            preventdefault:submit
            onSubmit$={handleLogin}
            class="space-y-6"
          >
            {/* Email Input */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                آدرس ایمیل
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-400">📧</span>
                </div>
                <input
                  type="email"
                  value={email.value}
                  onInput$={(e) => email.value = (e.target as HTMLInputElement).value}
                  class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="admin@porbar-baghstan.ir"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-400">🔒</span>
                </div>
                <input
                  type={showPassword.value ? "text" : "password"}
                  value={password.value}
                  onInput$={(e) => password.value = (e.target as HTMLInputElement).value}
                  class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick$={togglePasswordVisibility}
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword.value ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe.value}
                  onChange$={() => rememberMe.value = !rememberMe.value}
                  class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span class="mr-2 text-sm text-gray-600">مرا به خاطر بسپار</span>
              </label>
              <button
                type="button"
                class="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                رمز عبور را فراموش کرده‌اید؟
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading.value}
              class={`
                w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300
                ${isLoading.value 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading.value ? (
                <div class="flex items-center justify-center">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  در حال ورود...
                </div>
              ) : (
                <div class="flex items-center justify-center">
                  <span class="ml-2">🚀</span>
                  ورود به پنل مدیریت
                </div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div class="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 class="text-sm font-medium text-green-800 mb-2 flex items-center">
              <span class="ml-1">💡</span>
              اطلاعات آزمایشی
            </h3>
            <div class="text-xs text-green-700 space-y-1">
              <div class="flex justify-between">
                <span>ایمیل:</span>
                <span class="font-mono">admin@porbar-baghstan.ir</span>
              </div>
              <div class="flex justify-between">
                <span>رمز عبور:</span>
                <span class="font-mono">admin123</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div class="mt-6 text-center">
            <div class="flex items-center justify-center text-xs text-gray-500">
              <span class="ml-1">🛡️</span>
              ارتباط شما امن است
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="text-center mt-8">
          <p class="text-sm text-gray-600">
            © ۱۴۰۲ پربار باغستان. تمام حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
});