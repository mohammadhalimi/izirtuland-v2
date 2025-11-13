// src/components/admin/Products.tsx
import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const products = [
    { id: 1, name: 'کود NPK 20-20-20', price: '۱۵۰,۰۰۰', stock: 45, status: 'فعال' },
    { id: 2, name: 'ورمی کمپوست ارگانیک', price: '۹۵,۰۰۰', stock: 23, status: 'فعال' },
    { id: 3, name: 'کود دامی پوسیده', price: '۷۵,۰۰۰', stock: 0, status: 'ناموجود' },
    { id: 4, name: 'سم ارگانیک نیم آزال', price: '۱۲۰,۰۰۰', stock: 12, status: 'فعال' },
    { id: 5, name: 'کود مایع جلبک دریایی', price: '۸۵,۰۰۰', stock: 34, status: 'فعال' }
  ];

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">مدیریت محصولات</h2>
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          افزودن محصول جدید
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصول</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موجودی</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{product.price} تومان</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'فعال' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                  <button class="text-blue-600 hover:text-blue-900">ویرایش</button>
                  <button class="text-red-600 hover:text-red-900">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});