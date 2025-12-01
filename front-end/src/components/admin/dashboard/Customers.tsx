// src/components/admin/dashboard/CustomerManager.tsx
import { component$, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';

interface Customer {
  _id: string;
  phone: string;
  name?: string;
  address?: string;
  createdAt: string;
  __v?: number;
}

interface CustomerManagerProps {
  authToken: string;
}

export default component$<CustomerManagerProps>(({ authToken }) => {
  const state = useStore({
    customers: [] as Customer[],
    loading: true,
    error: '',
    searchQuery: '',
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    stats: {
      totalCustomers: 0,
      customersWithName: 0,
      customersWithAddress: 0,
      recentCustomers: 0
    }
  });

  // دریافت لیست مشتریان
  // حذف تابع calculateStats و در fetchCustomers مستقیم محاسبه کنید:
  const fetchCustomers = $(async () => {
    state.loading = true;
    state.error = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/getAllUser`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 داده‌های دریافتی از API:', data);

        // دریافت آرایه کاربران
        const usersArray = Array.isArray(data) ? data : (data.users || []);

        // ذخیره کاربران
        state.customers = usersArray;

        // محاسبه مستقیم آمار
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        state.stats = {
          totalCustomers: usersArray.length,
          customersWithName: usersArray.filter((customer: any) =>
            customer.name && customer.name.trim()
          ).length,
          customersWithAddress: usersArray.filter((customer: any) =>
            customer.address && customer.address.trim()
          ).length,
          recentCustomers: usersArray.filter((customer: any) =>
            new Date(customer.createdAt) > oneWeekAgo
          ).length
        };

      } else {
        const errorText = await response.text();
        console.error('❌ خطای API:', response.status, errorText);
        state.error = `خطای سرور: ${response.status}`;
      }
    } catch (err: any) {
      console.error('❌ خطای شبکه:', err);
      state.error = 'خطا در ارتباط با سرور';
    } finally {
      state.loading = false;
    }
  });

  // محاسبه آمار بر اساس داده‌های واقعی
  const calculateStats = $(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalCustomers: state.customers.length,
      customersWithName: state.customers.filter(customer => customer.name && customer.name.trim()).length,
      customersWithAddress: state.customers.filter(customer => customer.address && customer.address.trim()).length,
      recentCustomers: state.customers.filter(customer =>
        new Date(customer.createdAt) > oneWeekAgo
      ).length
    };

    state.stats = stats;
  });

  // فیلتر مشتریان بر اساس جستجو
  const filteredCustomers = state.customers.filter(customer => {
    if (!state.searchQuery.trim()) return true;

    const query = state.searchQuery.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(query)) ||
      customer.phone.includes(query) ||
      (customer.address && customer.address.toLowerCase().includes(query))
    );
  });

  // محاسبه صفحات
  const paginatedCustomers = filteredCustomers.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  // مشاهده جزئیات مشتری
  const viewCustomerDetails = $((customer: Customer) => {
    const details = `
🧾 **جزئیات مشتری**

📱 **شماره تلفن:** ${customer.phone}
👤 **نام:** ${customer.name || 'تعیین نشده'}
🏠 **آدرس:** ${customer.address || 'ثبت نشده'}
📅 **تاریخ عضویت:** ${new Date(customer.createdAt).toLocaleDateString('fa-IR')}
⏰ **ساعت عضویت:** ${new Date(customer.createdAt).toLocaleTimeString('fa-IR')}
🆔 **شناسه:** ${customer._id}
    `.trim();

    alert(details);
  });
  // تغییر صفحه
  const goToPage = $((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      state.currentPage = page;
    }
  });

  useVisibleTask$(() => {
    fetchCustomers();
  });

  // محاسبه تعداد صفحات
  state.totalPages = Math.ceil(filteredCustomers.length / state.itemsPerPage);

  // فرمت تاریخ فارسی
  const formatPersianDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // بررسی اطلاعات کاربر
  const getUserInfo = (customer: Customer) => {
    return {
      hasName: customer.name && customer.name.trim().length > 0,
      hasAddress: customer.address && customer.address.trim().length > 0,
      isRecent: new Date(customer.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  };

  return (
    <div class="p-6">
      {/* هدر */}
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">مدیریت مشتریان</h2>
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
            🔄 آخرین بروزرسانی: اکنون
          </div>
          <button
            onClick$={() => fetchCustomers()}
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>🔄</span>
            <span>بروزرسانی لیست</span>
          </button>
        </div>
      </div>

      {/* نمایش خطا */}
      {state.error && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-red-600">⚠️</span>
            <span>{state.error}</span>
          </div>
          <button
            onClick$={() => state.error = ''}
            class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* کارت‌های آمار */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">کل مشتریان</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{state.stats.totalCustomers}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-blue-600">👥</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">با نام کامل</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{state.stats.customersWithName}</p>
              <p class="text-xs text-gray-500 mt-1">
                ({Math.round((state.stats.customersWithName / state.stats.totalCustomers) * 100 || 0)}%)
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-green-600">👤</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">با آدرس</p>
              <p class="text-3xl font-bold text-purple-600 mt-2">{state.stats.customersWithAddress}</p>
              <p class="text-xs text-gray-500 mt-1">
                ({Math.round((state.stats.customersWithAddress / state.stats.totalCustomers) * 100 || 0)}%)
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-purple-600">🏠</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">عضویت ۷ روزه</p>
              <p class="text-3xl font-bold text-yellow-600 mt-2">{state.stats.recentCustomers}</p>
              <p class="text-xs text-gray-500 mt-1">کاربر جدید</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-yellow-600">🆕</span>
            </div>
          </div>
        </div>
      </div>

      {/* جستجو */}
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            value={state.searchQuery}
            onInput$={(e) => {
              state.searchQuery = (e.target as HTMLInputElement).value;
              state.currentPage = 1;
            }}
            placeholder="جستجوی مشتری بر اساس نام، شماره تلفن یا آدرس..."
            class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
            <span class="text-gray-400">🔍</span>
          </div>
          {state.searchQuery && (
            <div class="absolute left-12 top-1/2 transform -translate-y-1/2">
              <span class="text-sm text-gray-500">
                {filteredCustomers.length} نتیجه
              </span>
            </div>
          )}
        </div>
      </div>

      {/* جدول مشتریان */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {state.loading ? (
          <div class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p class="mt-2 text-gray-600">در حال دریافت اطلاعات مشتریان...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div class="p-8 text-center">
            <div class="text-6xl mb-4">👤</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {state.searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز مشتری وجود ندارد'}
            </h3>
            <p class="text-gray-600">
              {state.searchQuery
                ? 'لطفاً عبارت جستجوی خود را تغییر دهید'
                : 'با ثبت سفارش، مشتریان جدید اضافه می‌شوند'
              }
            </p>
          </div>
        ) : (
          <>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اطلاعات تماس</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ عضویت</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {paginatedCustomers.map((customer) => {
                    const info = getUserInfo(customer);

                    return (
                      <tr key={customer._id} class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                          <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <div class="w-10 h-10 bg-linear-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                              <span class="text-lg">
                                {info.hasName ? '👤' : '📱'}
                              </span>
                            </div>
                            <div>
                              <div class="text-sm font-medium text-gray-900">
                                {customer.name || 'بدون نام'}
                              </div>
                              {!info.hasName && (
                                <div class="text-xs text-gray-500">نام ثبت نشده</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="space-y-1">
                            <div class="text-sm text-gray-900 dir-ltr font-medium">
                              📱 {customer.phone}
                            </div>
                            <div class="text-sm text-gray-600">
                              {customer.address ? (
                                <>
                                  <span class="text-green-600">🏠</span> {customer.address}
                                </>
                              ) : (
                                <span class="text-gray-400">آدرس ثبت نشده</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex flex-wrap gap-2">
                            {info.hasName && (
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                👤 دارای نام
                              </span>
                            )}
                            {info.hasAddress && (
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                🏠 دارای آدرس
                              </span>
                            )}
                            {info.isRecent && (
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                🆕 جدید
                              </span>
                            )}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="text-sm text-gray-900">
                            {formatPersianDate(customer.createdAt)}
                          </div>
                          <div class="text-xs text-gray-500">
                            {new Date(customer.createdAt).toLocaleTimeString('fa-IR')}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-700">
                    نمایش {(state.currentPage - 1) * state.itemsPerPage + 1} تا{' '}
                    {Math.min(state.currentPage * state.itemsPerPage, filteredCustomers.length)} از{' '}
                    {filteredCustomers.length} مشتری
                  </div>
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick$={() => goToPage(state.currentPage - 1)}
                      disabled={state.currentPage === 1}
                      class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      قبلی
                    </button>

                    {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                      let pageNum;
                      if (state.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (state.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (state.currentPage >= state.totalPages - 2) {
                        pageNum = state.totalPages - 4 + i;
                      } else {
                        pageNum = state.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick$={() => goToPage(pageNum)}
                          class={`px-3 py-1 rounded-lg ${state.currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick$={() => goToPage(state.currentPage + 1)}
                      disabled={state.currentPage === state.totalPages}
                      class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});