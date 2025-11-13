// src/components/admin/Orders.tsx
import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const orders = [
    { id: '#ORD-2847', customer: 'محمد رضایی', amount: '۴,۲۵۰,۰۰۰', status: 'تکمیل شده', date: '۱۴۰۲/۱۰/۱۵' },
    { id: '#ORD-2846', customer: 'فاطمه محمدی', amount: '۲,۸۰۰,۰۰۰', status: 'در حال پردازش', date: '۱۴۰۲/۱۰/۱۵' },
    { id: '#ORD-2845', customer: 'علیرضا کریمی', amount: '۱,۵۰۰,۰۰۰', status: 'در انتظار', date: '۱۴۰۲/۱۰/۱۴' },
    { id: '#ORD-2844', customer: 'زهرا حسینی', amount: '۳,۲۰۰,۰۰۰', status: 'تکمیل شده', date: '۱۴۰۲/۱۰/۱۴' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تکمیل شده': return 'bg-green-100 text-green-800';
      case 'در حال پردازش': return 'bg-yellow-100 text-yellow-800';
      case 'در انتظار': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">مدیریت سفارشات</h2>
        <div class="flex space-x-3 rtl:space-x-reverse">
          <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>همه وضعیت‌ها</option>
            <option>تکمیل شده</option>
            <option>در حال پردازش</option>
            <option>در انتظار</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره سفارش</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{order.id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{order.customer}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{order.amount} تومان</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{order.date}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900">مشاهده</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});