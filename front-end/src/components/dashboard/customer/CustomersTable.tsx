// src/components/admin/dashboard/customer/CustomersTable.tsx
import { component$ } from '@builder.io/qwik';
import { CustomerRow } from './CustomerRow';
import { CustomersTableProps } from '~/components/types/customerPanelAdmin';

export const CustomersTable = component$<CustomersTableProps>(({
  customers,
  loading,
  searchQuery,
  paginatedCustomers
}) => {
  if (loading) {
    return (
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p class="text-gray-600 font-medium">در حال دریافت اطلاعات مشتریان...</p>
          <p class="text-sm text-gray-500 mt-1">لطفاً کمی صبر کنید</p>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="text-6xl mb-4 text-gray-300">👤</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز مشتری وجود ندارد</h3>
        <p class="text-gray-600 mb-6">با ثبت سفارش، مشتریان جدید اضافه می‌شوند</p>
        <button class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
          🔄 بروزرسانی
        </button>
      </div>
    );
  }

  if (searchQuery && paginatedCustomers.length === 0) {
    return (
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="text-5xl mb-4 text-gray-300">🔍</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">نتیجه‌ای یافت نشد</h3>
        <p class="text-gray-600 mb-4">هیچ مشتری با "{searchQuery}" پیدا نشد</p>
        <p class="text-sm text-gray-500">لطفاً عبارت جستجوی خود را تغییر دهید</p>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div class="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">👥 لیست مشتریان</h3>
            <p class="text-sm text-gray-600">مدیریت اطلاعات کاربران سیستم</p>
          </div>
          <div class="text-sm text-gray-500">
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {customers.length} نفر
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">👤 مشتری</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">📞 اطلاعات تماس</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">🏷️ وضعیت</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">📅 تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {paginatedCustomers.map((customer) => (
              <CustomerRow key={customer._id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});