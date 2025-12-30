// src/components/admin/Orders.tsx
import { component$, Resource, useResource$, useSignal } from "@builder.io/qwik";
import type { Order } from "~/components/types/order";
import { OrdersTable } from "./OrdersTable";
import { API_BASE_URL } from "~/config/api";

interface OrdersProps {
  authToken: string;
}

export default component$<OrdersProps>(({ authToken }) => {
  const activeTab = useSignal<'pending' | 'completed'>('pending');
  const searchQuery = useSignal('');

  const ordersResource = useResource$<Order[]>(async ({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());

    const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
      credentials: "include",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("خطا در دریافت سفارشات");
    }

    const data = await res.json();
    return data.orders;
  });

  return (
    <div class="p-6 space-y-6">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">📦 مدیریت سفارشات</h1>
          <p class="text-gray-600">مدیریت و پیگیری سفارشات کاربران</p>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full">👑 ادمین</div>
          <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">📊 داشبورد</div>
        </div>
      </div>

      {/* Search Bar */}
      <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس کد رهگیری، شماره تماس، نام مشتری یا شناسه سفارش..."
                class="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={searchQuery.value}
                onInput$={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Tabs Header */}
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              onClick$={() => activeTab.value = 'pending'}
              class={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab.value === 'pending'
                  ? 'text-green-700 bg-green-50 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div class="flex items-center justify-center gap-2">
                <span>⏳</span>
                <span>سفارشات در حال انتظار</span>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  <Resource
                    value={ordersResource}
                    onResolved={(orders) => {
                      const pendingOrders = orders.filter(order => 
                        order.status === 'paid'
                      );
                      return pendingOrders.length;
                    }}
                    onPending={() => "..."}
                  />
                </span>
              </div>
            </button>
            
            <button
              onClick$={() => activeTab.value = 'completed'}
              class={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab.value === 'completed'
                  ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div class="flex items-center justify-center gap-2">
                <span>✅</span>
                <span>سفارشات تکمیل شده</span>
                <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                  <Resource
                    value={ordersResource}
                    onResolved={(orders) => {
                      const completedOrders = orders.filter(order => 
                        order.status === 'iscompleted'
                      );
                      return completedOrders.length;
                    }}
                    onPending={() => "..."}
                  />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div class="p-6">
          <Resource
            value={ordersResource}
            onPending={() => (
              <div class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p class="text-gray-600">در حال بارگذاری سفارشات...</p>
              </div>
            )}
            onRejected={(err) => (
              <div class="text-center py-12">
                <div class="text-5xl mb-4">⚠️</div>
                <p class="text-red-600 text-lg mb-2">{err.message}</p>
                <p class="text-gray-600 mb-4">لطفاً دوباره تلاش کنید</p>
                <button 
                  onClick$={() => window.location.reload()}
                  class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            )}
            onResolved={(orders) => {
              // فیلتر بر اساس جستجو
              const filteredOrders = orders.filter(order => {
                if (!searchQuery.value) return true;
                
                const query = searchQuery.value.toLowerCase();
                return (
                  (order.payment?.trackId?.toString() || '').includes(query) ||
                  (order.user?.phone || '').includes(query) ||
                  (order.user?.name || '').toLowerCase().includes(query) ||
                  order._id.toLowerCase().includes(query)
                );
              });

              // جدا کردن سفارشات بر اساس تب
              const pendingOrders = filteredOrders.filter(order => 
                order.status === 'paid'
              );
              
              const completedOrders = filteredOrders.filter(order => 
                order.status === 'iscompleted'
              );

              // سفارشات فعال فعلی
              const currentOrders = activeTab.value === 'pending' ? pendingOrders : completedOrders;

              // اگر جستجو نتیجه‌ای نداشت
              if (searchQuery.value && filteredOrders.length === 0) {
                return (
                  <div class="text-center py-12">
                    <div class="text-5xl mb-4">🔍</div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">نتیجه‌ای یافت نشد</h3>
                    <p class="text-gray-500 mb-6">
                      هیچ سفارشی با "{searchQuery.value}" پیدا نشد
                    </p>
                    <button 
                      onClick$={() => searchQuery.value = ''}
                      class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    >
                      پاک کردن جستجو
                    </button>
                  </div>
                );
              }

              // اگر سفارشی در این تب نیست
              if (currentOrders.length === 0) {
                return (
                  <div class="text-center py-12">
                    <div class="text-5xl mb-4">
                      {activeTab.value === 'pending' ? '⏳' : '✅'}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">
                      {activeTab.value === 'pending' 
                        ? 'هیچ سفارش در حال انتظاری ندارید' 
                        : 'هیچ سفارش تکمیل شده‌ای ندارید'}
                    </h3>
                    <p class="text-gray-500">
                      {activeTab.value === 'pending' 
                        ? 'سفارشات جدید در این بخش نمایش داده می‌شوند' 
                        : 'سفارشات تکمیل شده در این بخش نمایش داده می‌شوند'}
                    </p>
                  </div>
                );
              }

              return (
                <>
                  {/* Tab Stats */}
                  <div class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div class="flex flex-wrap items-center justify-between gap-4">
                      <div class="flex items-center gap-4">
                        <div class={`px-3 py-2 rounded-lg ${
                          activeTab.value === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <span class="font-bold">{currentOrders.length}</span>
                          سفارش
                        </div>
                        
                        <div class="text-sm text-gray-600">
                          مجموع مبلغ:{" "}
                          <span class="font-bold text-green-700">
                            {new Intl.NumberFormat('fa-IR').format(
                              currentOrders.reduce((sum, order) => sum + order.totalPrice, 0)
                            )} تومان
                          </span>
                        </div>
                      </div>
                      
                      {searchQuery.value && (
                        <div class="flex items-center gap-2">
                          <span class="text-sm text-gray-600">
                            نتایج برای: "{searchQuery.value}"
                          </span>
                          <button 
                            onClick$={() => searchQuery.value = ''}
                            class="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕ حذف فیلتر
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <OrdersTable 
                    orders={currentOrders} 
                    authToken={authToken}
                  />

                  {/* Summary Footer */}
                  <div class="mt-6 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-right">
                      <div class="p-3 bg-white rounded-lg border">
                        <div class="text-sm text-gray-500 mb-1">کل سفارشات</div>
                        <div class="text-xl font-bold text-gray-800">{orders.length}</div>
                      </div>
                      <div class="p-3 bg-white rounded-lg border">
                        <div class="text-sm text-gray-500 mb-1">در انتظار</div>
                        <div class="text-xl font-bold text-yellow-600">{pendingOrders.length}</div>
                      </div>
                      <div class="p-3 bg-white rounded-lg border">
                        <div class="text-sm text-gray-500 mb-1">تکمیل شده</div>
                        <div class="text-xl font-bold text-emerald-600">{completedOrders.length}</div>
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
});