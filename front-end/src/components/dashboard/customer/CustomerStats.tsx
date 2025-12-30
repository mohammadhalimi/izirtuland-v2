// src/components/admin/dashboard/customer/CustomerStats.tsx
import { component$ } from '@builder.io/qwik';
import { CustomerStatsProps } from '~/components/types/customerPanelAdmin';

export const CustomerStats = component$<CustomerStatsProps>(({ stats }) => {
  const calculatePercentage = (count: number) => {
    return Math.round((count / stats.totalCustomers) * 100) || 0;
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Customers */}
      <div class="bg-linear-to-br from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">👥 کل مشتریان</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">{stats.totalCustomers}</p>
            <p class="text-xs text-gray-500 mt-2">کاربر ثبت شده</p>
          </div>
          <div class="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl text-white">👥</span>
          </div>
        </div>
      </div>

      {/* Customers with Name */}
      <div class="bg-linear-to-br from-green-50 to-white rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">👤 دارای نام کامل</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{stats.customersWithName}</p>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 bg-green-200 rounded-full h-1.5">
                <div 
                  class="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${calculatePercentage(stats.customersWithName)}%` }}
                ></div>
              </div>
              <span class="text-xs font-medium text-green-700">
                {calculatePercentage(stats.customersWithName)}%
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl text-white">👤</span>
          </div>
        </div>
      </div>

      {/* Customers with Address */}
      <div class="bg-linear-to-br from-purple-50 to-white rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">🏠 دارای آدرس</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{stats.customersWithAddress}</p>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 bg-purple-200 rounded-full h-1.5">
                <div 
                  class="bg-purple-500 h-1.5 rounded-full" 
                  style={{ width: `${calculatePercentage(stats.customersWithAddress)}%` }}
                ></div>
              </div>
              <span class="text-xs font-medium text-purple-700">
                {calculatePercentage(stats.customersWithAddress)}%
              </span>
            </div>
          </div>
          <div class="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl text-white">🏠</span>
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div class="bg-linear-to-br from-yellow-50 to-white rounded-2xl shadow-sm border border-yellow-100 p-6 hover:shadow-md transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-600">🆕 عضویت ۷ روزه</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{stats.recentCustomers}</p>
            <p class="text-xs text-gray-500 mt-2">کاربر جدید هفته اخیر</p>
          </div>
          <div class="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span class="text-2xl text-white">🆕</span>
          </div>
        </div>
      </div>
    </div>
  );
});