// src/components/admin/dashboard/product-manager/ProductList.tsx
import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import type { ProductListProps, Product } from '~/components/types/product';
import { getFullImageUrl, formatPackageSize, formatDate, truncateContent } from '~/components/function/function';

export const ProductList = component$<ProductListProps>(({ products, loading, onEdit, onDelete }) => {
  const searchQuery = useSignal('');
  const filteredProducts = useSignal<Product[]>(products);

  // تابع فیلتر کردن محصولات بر اساس جستجو
  const filterProducts = $(() => {
    if (!searchQuery.value.trim()) {
      filteredProducts.value = products;
      return;
    }

    const query = searchQuery.value.toLowerCase().trim();
    filteredProducts.value = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.content.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.model.includes(query)
    );
  });

  // وقتی products تغییر کرد یا جستجو عوض شد
  useTask$(({ track }) => {
    track(() => products);
    track(() => searchQuery.value);
    filterProducts();
  });

  if (loading) {
    return (
      <div class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">در حال دریافت محصولات...</p>
      </div>
    );
  }

  // از filteredProducts استفاده کن
  const displayProducts = filteredProducts.value;

  if (displayProducts.length === 0) {
    return (
      <div>
        {/* Search Bar */}
        <div class="mb-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام محصول، برند، نوع یا توضیحات..."
                  class="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery.value}
                  onInput$={(e) => {
                    searchQuery.value = (e.target as HTMLInputElement).value;
                    filterProducts();
                  }}
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            
            {searchQuery.value && (
              <button
                onClick$={() => {
                  searchQuery.value = '';
                  filterProducts();
                }}
                class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>✕</span>
                <span>پاک کردن فیلتر</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        <div class="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div class="text-6xl mb-4">
            {searchQuery.value ? '🔍' : '🌿'}
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">
            {searchQuery.value 
              ? `نتیجه‌ای برای "${searchQuery.value}" یافت نشد` 
              : 'هنوز محصولی وجود ندارد'}
          </h3>
          <p class="text-gray-600">
            {searchQuery.value 
              ? 'لطفاً عبارت جستجو را تغییر دهید' 
              : 'اولین محصول خود را ایجاد کنید'}
          </p>
          
          {searchQuery.value && (
            <button
              onClick$={() => {
                searchQuery.value = '';
                filterProducts();
              }}
              class="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              نمایش همه محصولات
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div class="mb-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام محصول، برند، نوع یا توضیحات..."
                class="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={searchQuery.value}
                onInput$={(e) => {
                  searchQuery.value = (e.target as HTMLInputElement).value;
                  filterProducts();
                }}
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            {/* نتایج جستجو */}
            <div class="text-sm text-gray-600">
              <span class="font-medium">{displayProducts.length}</span>
              <span class="mr-1">محصول از</span>
              <span class="font-medium">{products.length}</span>
            </div>
            
            {searchQuery.value && (
              <button
                onClick$={() => {
                  searchQuery.value = '';
                  filterProducts();
                }}
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2"
              >
                <span>✕</span>
                <span>پاک کردن فیلتر</span>
              </button>
            )}
          </div>
        </div>
        
        {/* فیلترهای سریع */}
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            onClick$={() => {
              searchQuery.value = 'Izirtu Land';
              filterProducts();
            }}
            class="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            Izirtu Land
          </button>
          <button
            onClick$={() => {
              searchQuery.value = 'Khak Shimi';
              filterProducts();
            }}
            class="text-xs px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
          >
            Khak Shimi
          </button>
          <button
            onClick$={() => {
              searchQuery.value = 'جامد';
              filterProducts();
            }}
            class="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
          >
            جامد
          </button>
          <button
            onClick$={() => {
              searchQuery.value = 'مایع';
              filterProducts();
            }}
            class="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
          >
            مایع
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
              {displayProducts.map((product) => (
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
                        <div class="text-sm font-medium text-gray-900">
                          {/* هایلایت متن جستجو */}
                          {searchQuery.value ? (
                            <span>
                              {product.name.split(new RegExp(`(${searchQuery.value})`, 'gi')).map((part, i) => 
                                part.toLowerCase() === searchQuery.value.toLowerCase() ? (
                                  <mark key={i} class="bg-yellow-200 px-1 rounded">{part}</mark>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              )}
                            </span>
                          ) : (
                            product.name
                          )}
                        </div>
                        <div class="text-sm text-gray-500 overflow-hidden">
                          {truncateContent(product.content)}
                        </div>
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

        {/* Footer با اطلاعات جستجو */}
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              {searchQuery.value ? (
                <span>
                  نمایش <span class="font-medium">{displayProducts.length}</span> محصول از <span class="font-medium">{products.length}</span> محصول
                  {searchQuery.value && (
                    <span class="mr-2">برای عبارت "<span class="font-medium">{searchQuery.value}</span>"</span>
                  )}
                </span>
              ) : (
                <span>
                  مجموع <span class="font-medium">{products.length}</span> محصول
                </span>
              )}
            </div>
            
            {searchQuery.value && displayProducts.length > 0 && (
              <div class="text-sm text-gray-500">
                <span class="inline-flex items-center gap-1">
                  <span class="text-green-600">✓</span>
                  <span>هایلایت شده با رنگ زرد</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});