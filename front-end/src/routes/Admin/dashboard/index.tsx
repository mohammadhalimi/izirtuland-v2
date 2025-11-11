// src/routes/admin/index.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  const sidebarOpen = useSignal(false);
  const activeTab = useSignal('dashboard');

  const toggleSidebar = $(() => {
    sidebarOpen.value = !sidebarOpen.value;
  });

  // آمار کلی
  const stats = [
    { title: 'کل فروش', value: '۱۲۵,۴۰۰,۰۰۰', change: '+۱۲.۵%', icon: '💰', color: 'green' },
    { title: 'سفارشات', value: '۲,۸۴۷', change: '+۸.۲%', icon: '📦', color: 'blue' },
    { title: 'مشتریان', value: '۱۲,۸۴۶', change: '+۵.۷%', icon: '👥', color: 'purple' },
    { title: 'محصولات', value: '۱۵۶', change: '+۳.۱%', icon: '🌿', color: 'orange' }
  ];

  // آخرین سفارشات
  const recentOrders = [
    { id: '#ORD-2847', customer: 'محمد رضایی', product: 'کود NPK', amount: '۴,۲۵۰,۰۰۰', status: 'completed', date: '۱۴۰۲/۱۰/۱۵' },
    { id: '#ORD-2846', customer: 'فاطمه محمدی', product: 'ورمی کمپوست', amount: '۲,۸۰۰,۰۰۰', status: 'processing', date: '۱۴۰۲/۱۰/۱۵' },
    { id: '#ORD-2845', customer: 'علیرضا کریمی', product: 'کود دامی', amount: '۱,۵۰۰,۰۰۰', status: 'pending', date: '۱۴۰۲/۱۰/۱۴' },
    { id: '#ORD-2844', customer: 'زهرا حسینی', product: 'سم ارگانیک', amount: '۳,۲۰۰,۰۰۰', status: 'completed', date: '۱۴۰۲/۱۰/۱۴' },
    { id: '#ORD-2843', customer: 'امیرحسین نجفی', product: 'کود مایع', amount: '۲,۱۰۰,۰۰۰', status: 'completed', date: '۱۴۰۲/۱۰/۱۳' }
  ];

  // محصولات پرفروش
  const topProducts = [
    { name: 'کود NPK 20-20-20', sales: 847, revenue: '۳۴,۸۰۰,۰۰۰', growth: '+۱۵%' },
    { name: 'ورمی کمپوست ارگانیک', sales: 632, revenue: '۱۸,۹۶۰,۰۰۰', growth: '+۲۲%' },
    { name: 'کود دامی پوسیده', sales: 521, revenue: '۷,۸۱۵,۰۰۰', growth: '+۸%' },
    { name: 'سم ارگانیک نیم آزال', sales: 487, revenue: '۱۴,۶۱۰,۰۰۰', growth: '+۱۸%' },
    { name: 'کود مایع جلبک دریایی', sales: 423, revenue: '۸,۴۶۰,۰۰۰', growth: '+۱۲%' }
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
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-10 h-10 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ا
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">ادمین</p>
                <p class="text-sm text-gray-500 truncate">admin@porbar-baghstan.ir</p>
              </div>
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
              <div class="w-8 h-8 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ا
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main class="flex-1 overflow-auto p-6">
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

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* آخرین سفارشات */}
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-gray-800">آخرین سفارشات</h2>
                <Link href="/admin/orders" class="text-green-600 hover:text-green-700 text-sm font-medium">
                  مشاهده همه
                </Link>
              </div>
              <div class="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                        <span class="text-sm font-medium text-gray-900">{order.id}</span>
                        <span class={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {order.status === 'completed' && 'تکمیل شده'}
                          {order.status === 'processing' && 'در حال پردازش'}
                          {order.status === 'pending' && 'در انتظار'}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 truncate">{order.customer} - {order.product}</p>
                    </div>
                    <div class="text-left ml-4">
                      <p class="text-sm font-medium text-gray-900">{order.amount} تومان</p>
                      <p class="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* محصولات پرفروش */}
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-gray-800">محصولات پرفروش</h2>
                <Link href="/admin/products" class="text-green-600 hover:text-green-700 text-sm font-medium">
                  مشاهده همه
                </Link>
              </div>
              <div class="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div class="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-600">
                        <span>{product.sales} فروش</span>
                        <span>{product.revenue} تومان</span>
                      </div>
                    </div>
                    <span class="text-green-600 text-sm font-medium">{product.growth}</span>
                  </div>
                ))}
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