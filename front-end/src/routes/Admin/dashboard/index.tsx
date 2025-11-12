// src/routes/admin/dashboard/index.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, routeAction$ } from '@builder.io/qwik-city';

// Type برای اطلاعات ادمین
interface AdminData {
  _id: string;
  username: string;
  email: string;
}

// Loader برای چک کردن احراز هویت
export const useAuthCheck = routeLoader$(({ cookie, redirect }) => {
  const authToken = cookie.get('auth-token')?.value;
  const adminDataCookie = cookie.get('admin-data')?.value;
  
  console.log('Auth Token:', authToken);
  console.log('Admin Data:', adminDataCookie);
  
  if (!authToken || !adminDataCookie) {
    console.log('Redirecting to /Admin - No auth data');
    throw redirect(302, '/Admin');
  }
  
  try {
    const adminData: AdminData = JSON.parse(adminDataCookie);
    return {
      isAuthenticated: true,
      admin: adminData,
      token: authToken
    };
  } catch (error) {
    console.log('Error parsing admin data:', error);
    // اگر اطلاعات معتبر نبود، کوکی‌ها را پاک کن
    cookie.delete('auth-token', { path: '/' });
    cookie.delete('admin-data', { path: '/' });
    throw redirect(302, '/Admin');
  }
});

// Action برای لاگاوت - اصلاح شده
export const useLogoutAction = routeAction$((_, { cookie, redirect }) => {
  // پاک کردن کوکی‌ها با Qwik cookie
  cookie.delete('auth-token', { path: '/' });
  cookie.delete('admin-data', { path: '/' });
  
  // ریدایرکت به صفحه لاگین
  throw redirect(302, '/Admin');
});

export default component$(() => {
  const authData = useAuthCheck();
  const logoutAction = useLogoutAction();
  const sidebarOpen = useSignal(false);
  const activeTab = useSignal('dashboard');
  const showLogoutModal = useSignal(false);

  const toggleSidebar = $(() => {
    sidebarOpen.value = !sidebarOpen.value;
  });

  const handleLogout = $(() => {
    showLogoutModal.value = true;
  });

  const confirmLogout = $(() => {
    logoutAction.submit();
  });

  const cancelLogout = $(() => {
    showLogoutModal.value = false;
  });

  // آمار کلی
  const stats = [
    { title: 'کل فروش', value: '۱۲۵,۴۰۰,۰۰۰', change: '+۱۲.۵%', icon: '💰', color: 'green' },
    { title: 'سفارشات', value: '۲,۸۴۷', change: '+۸.۲%', icon: '📦', color: 'blue' },
    { title: 'مشتریان', value: '۱۲,۸۴۶', change: '+۵.۷%', icon: '👥', color: 'purple' },
    { title: 'محصولات', value: '۱۵۶', change: '+۳.۱%', icon: '🌿', color: 'orange' }
  ];

  return (
    <div class="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <div class={`
        fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen.value ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div class="flex flex-col h-full">
          {/* Logo */}
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-8 h-8 bg-linear-to-r from-green-500 to-green-600 rounded-lg"></div>
              <span class="text-xl font-bold text-gray-800">پربار باغستان</span>
            </div>
            <button 
              onClick$={toggleSidebar}
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav class="flex-1 px-4 py-6 space-y-2">
            {[
              { id: 'dashboard', label: 'داشبورد', icon: '📊' },
              { id: 'products', label: 'محصولات', icon: '🌿' },
              { id: 'orders', label: 'سفارشات', icon: '📦' },
              { id: 'customers', label: 'مشتریان', icon: '👥' },
              { id: 'analytics', label: 'تحلیل‌ها', icon: '📈' },
              { id: 'settings', label: 'تنظیمات', icon: '⚙️' }
            ].map((item) => (
              <button
                key={item.id}
                onClick$={() => activeTab.value = item.id}
                class={`
                  w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab.value === item.id 
                    ? 'bg-green-50 text-green-700 border-r-4 border-green-500' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span class="text-lg">{item.icon}</span>
                <span class="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-3">
              <div class="w-10 h-10 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {authData.value.admin.username.charAt(0)}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{authData.value.admin.username}</p>
                <p class="text-sm text-gray-500 truncate">{authData.value.admin.email}</p>
              </div>
            </div>
            
            {/* دکمه خروج */}
            <button
              onClick$={handleLogout}
              class="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
            >
              <span>🚪</span>
              <span>خروج از حساب</span>
            </button>

            {/* اطلاعات session (برای دیباگ) */}
            <div class="mt-3 p-2 bg-gray-100 rounded-lg">
              <p class="text-xs text-gray-600">
                وضعیت: <span class="text-green-600 font-medium">فعال</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                مدت زمان باقی‌مانده: ۲۴ ساعت
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center">
              <button 
                onClick$={toggleSidebar}
                class="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 class="text-2xl font-bold text-gray-800 mr-4">داشبورد مدیریت</h1>
            </div>
            
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <span class="text-lg">🔔</span>
                <span class="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* منوی کاربر */}
              <div class="relative">
                <div class="w-8 h-8 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                  {authData.value.admin.username.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main class="flex-1 overflow-auto p-6">
          {/* Welcome Message */}
          <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-8">
            <h2 class="text-2xl font-bold mb-2">سلام، {authData.value.admin.username}!</h2>
            <p class="opacity-90">خوش آمدید به پنل مدیریت پربار باغستان</p>
            <div class="mt-2 text-sm opacity-80">
              <p>آخرین ورود: {new Date().toLocaleDateString('fa-IR')}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <span class={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p class="text-gray-600 text-sm">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Session Management Card */}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-lg font-bold text-gray-800 mb-4">مدیریت session</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 class="font-medium text-green-800 mb-2">وضعیت احراز هویت</h3>
                <p class="text-sm text-green-700">شما با موفقیت وارد شده‌اید</p>
                <p class="text-xs text-green-600 mt-1">session شما فعال است</p>
              </div>
              
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 class="font-medium text-blue-800 mb-2">مدیریت حساب</h3>
                <p class="text-sm text-blue-700">می‌توانید از حساب خود خارج شوید</p>
                <button 
                  onClick$={handleLogout}
                  class="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  خروج از سیستم
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl text-green-600 mx-auto mb-3">
                ➕
              </div>
              <h3 class="font-medium text-gray-800 mb-1">محصول جدید</h3>
              <p class="text-sm text-gray-600">افزودن محصول جدید به فروشگاه</p>
            </button>

            <button class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl text-blue-600 mx-auto mb-3">
                📊
              </div>
              <h3 class="font-medium text-gray-800 mb-1">گزارش فروش</h3>
              <p class="text-sm text-gray-600">مشاهده گزارش‌های دقیق فروش</p>
            </button>

            <button class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl text-purple-600 mx-auto mb-3">
                👥
              </div>
              <h3 class="font-medium text-gray-800 mb-1">مدیریت کاربران</h3>
              <p class="text-sm text-gray-600">مدیریت مشتریان و دسترسی‌ها</p>
            </button>

            <button class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl text-orange-600 mx-auto mb-3">
                ⚙️
              </div>
              <h3 class="font-medium text-gray-800 mb-1">تنظیمات</h3>
              <p class="text-sm text-gray-600">تنظیمات سیستم و فروشگاه</p>
            </button>
          </div>
        </main>
      </div>

      {/* Modal تایید خروج */}
      {showLogoutModal.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 class="text-lg font-bold text-gray-800 mb-4">تایید خروج</h3>
            <p class="text-gray-600 mb-6">آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟</p>
            
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button
                onClick$={cancelLogout}
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                انصراف
              </button>
              <button
                onClick$={confirmLogout}
                disabled={logoutAction.isRunning}
                class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {logoutAction.isRunning ? 'در حال خروج...' : 'خروج'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen.value && (
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick$={toggleSidebar}
        />
      )}
    </div>
  );
});