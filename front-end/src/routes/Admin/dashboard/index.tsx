// src/routes/admin/dashboard/index.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$, routeAction$ } from '@builder.io/qwik-city';

// ایمپورت کامپوننت‌ها
import Dashboard from '~/components/admin/dashboard/Dashboard';
import Products from '~/components/admin/dashboard/Products';
import Orders from '~/components/admin/dashboard/Orders';
import Customers from '~/components/admin/dashboard/Customers';
import CreateAdmin from '~/components/admin/dashboard/CreateAdmin';
import EditProfile from '~/components/admin/dashboard/EditProfile';
// Type برای اطلاعات ادمین
interface AdminData {
  _id: string;
  username: string;
  role: "admin" | "superadmin";
  profileImage: string;
}

// Loader برای چک کردن احراز هویت
export const useAuthCheck = routeLoader$(({ cookie, redirect }) => {
  const authToken = cookie.get('auth-token')?.value;
  const adminDataCookie = cookie.get('admin-data')?.value;

  if (!authToken || !adminDataCookie) {
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
    cookie.delete('auth-token', { path: '/' });
    cookie.delete('admin-data', { path: '/' });
    throw redirect(302, '/Admin');
  }
});

// Action برای لاگاوت
export const useLogoutAction = routeAction$((_, { cookie, redirect }) => {
  cookie.delete('auth-token', { path: '/' });
  cookie.delete('admin-data', { path: '/' });
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

  // منوی navigation
  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊' },
    { id: 'products', label: 'محصولات', icon: '🌿' },
    { id: 'orders', label: 'سفارشات', icon: '📦' },
    { id: 'CreateAdmin', label: 'ایجاد ادمین', icon: '👨‍💼' }, // اضافه شده
    { id: 'EditProfile', label: 'ویرایش پروفایل', icon: '👤' },
    { id: 'customers', label: 'مشتریان', icon: '👥' },
    { id: 'analytics', label: 'تحلیل‌ها', icon: '📈' },
    { id: 'settings', label: 'تنظیمات', icon: '⚙️' }
  ];
  // کامپوننت‌های موجود
  const components = {
    dashboard: () => <Dashboard adminName={authData.value.admin.username} />,
    products: Products,
    orders: Orders,
    CreateAdmin: () => <CreateAdmin authToken={authData.value.token} currentAdmin={authData.value.admin} />,
    EditProfile: () => <EditProfile authToken={authData.value.token} currentAdmin={authData.value.admin} />,
    customers: Customers,
    analytics: () => <div class="p-8 text-center">📈 کامپوننت تحلیل‌ها به زودی...</div>,
    settings: () => <div class="p-8 text-center">⚙️ کامپوننت تنظیمات به زودی...</div>
  };
  // دریافت کامپوننت فعال
  const ActiveComponent = components[activeTab.value as keyof typeof components];

  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // اگر مسیر نسبی است، آدرس کامل بسازید
    return `http://localhost:5000${imagePath}`;
  };

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
            {navItems.map((item) => (
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
            <div class="flex items-center space-x-2 mb-3">
              <div class="w-10 h-10 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                <img
                  src={getFullImageUrl(authData.value.admin.profileImage)}
                  alt="Profile"
                  class="w-full h-full object-cover rounded-full"
                  onError$={(event) => {
                    const target = event.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{authData.value.admin.username}</p>
              </div>
            </div>

            <button
              onClick$={handleLogout}
              class="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
            >
              <span>🚪</span>
              <span>خروج از حساب</span>
            </button>
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
              <h1 class="text-2xl font-bold text-gray-800 mr-4">
                {navItems.find(item => item.id === activeTab.value)?.label}
              </h1>
            </div>

            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <span class="text-lg">🔔</span>
                <span class="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div class="w-8 h-8 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                <img
                  src={getFullImageUrl(authData.value.admin.profileImage)}
                  alt="Profile"
                  class="w-full h-full object-cover rounded-full"
                  onError$={(event) => {
                    const target = event.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - نمایش کامپوننت فعال */}
        <main class="flex-1 overflow-auto p-6">
          <ActiveComponent />
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