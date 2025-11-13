import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const customers = [
    { id: 1, name: 'محمد رضایی', email: 'mohammad@example.com', phone: '09123456789', orders: 12, joinDate: '۱۴۰۲/۰۹/۱۵' },
    { id: 2, name: 'فاطمه محمدی', email: 'fatemeh@example.com', phone: '09129876543', orders: 8, joinDate: '۱۴۰۲/۱۰/۰۲' },
    { id: 3, name: 'علیرضا کریمی', email: 'alireza@example.com', phone: '09361234567', orders: 5, joinDate: '۱۴۰۲/۱۰/۲۰' },
    { id: 4, name: 'زهرا حسینی', email: 'zahra@example.com', phone: '09107654321', orders: 15, joinDate: '۱۴۰۲/۰۹/۲۸' }
  ];

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">مدیریت مشتریان</h2>
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          افزودن مشتری جدید
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-2xl mb-2">👥</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">۱۲,۸۴۶</h3>
          <p class="text-gray-600 text-sm">مشتری کل</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-2xl mb-2">🛒</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">۲,۸۴۷</h3>
          <p class="text-gray-600 text-sm">سفارش فعال</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-2xl mb-2">💰</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">۱۲۵M</h3>
          <p class="text-gray-600 text-sm">فروش کل</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-2xl mb-2">⭐</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-1">۴.۸</h3>
          <p class="text-gray-600 text-sm">میانگین امتیاز</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مشتری</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد سفارشات</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ عضویت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{customer.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{customer.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{customer.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{customer.orders} سفارش</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{customer.joinDate}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                  <button class="text-blue-600 hover:text-blue-900">مشاهده</button>
                  <button class="text-green-600 hover:text-green-900">پیام</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});