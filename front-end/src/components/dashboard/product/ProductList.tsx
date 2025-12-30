// src/components/admin/dashboard/product-manager/ProductList.tsx
import { component$ } from '@builder.io/qwik';
import type { ProductListProps } from '~/components/types/product';
import { getFullImageUrl, formatPackageSize, formatDate, truncateContent } from '~/components/function/function';

export const ProductList = component$<ProductListProps>(({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">در حال دریافت محصولات...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div class="p-8 text-center">
        <div class="text-6xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز محصولی وجود ندارد</h3>
        <p class="text-gray-600">اولین محصول خود را ایجاد کنید</p>
      </div>
    );
  }

  return (
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصول</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">برند</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سایز</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  {product.image && (
                    <img
                      src={getFullImageUrl(product.image)}
                      alt={product.name}
                      class="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div class="text-sm font-medium text-gray-900">{product.name}</div>
                    <div class="text-sm text-gray-500 overflow-hidden">{truncateContent(product.content)}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.brand === 'Izirtu Land'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {product.brand}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.price.toLocaleString()} تومان
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.model === 'جامد'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {product.model}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPackageSize(product.packageSize)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(product.createdAt)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick$={() => onEdit(product)}
                    class="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                    title="ویرایش محصول"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick$={() => onDelete(product)}
                    class="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                    title="حذف محصول"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});