import { component$, useResource$, Resource } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { API_BASE_URL } from '~/config/api';
import type { Product } from '../types/product';

export default component$(() => {
  const productsResource = useResource$<Product[]>(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success && data.products) {
        return data.products
          .sort((a: Product, b: Product) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);
      }
      if (Array.isArray(data)) {
        return data.slice(0, 4);
      }

      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  });

  const formatPackageSize = (packageSize: string) => {
    const sizeMap: { [key: string]: string } = {
      '1kg': '1 کیلوگرم',
      '10kg': '10 کیلوگرم',
      '1litre': '1 لیتر',
      '5liter': '5 لیتر',
      '20litre': '20 لیتر'
    };
    return sizeMap[packageSize] || packageSize;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getCategoryColor = (model: string) => {
    switch (model) {
      case 'مایع':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'جامد':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'پودری':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'Izirtu Land':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Khak Shimi':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <section class="py-16 bg-linear-to-b from-white to-green-50">
      <div class="container mx-auto px-4">
        {/* هدر بخش */}
        <div class="text-center mb-12">
          <div class="inline-block mb-4 p-2 bg-green-100 rounded-full">
            <span class="text-2xl">🏆</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            پرفروش‌های <span class="text-green-600">پربار باغستان</span>
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            محصولات منتخب و پرطرفدار که توسط باغداران و کشاورزان عزیز انتخاب شده‌اند
          </p>
        </div>

        <Resource
          value={productsResource}
          onPending={() => (
            <div class="mb-12">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} class="animate-pulse">
                    <div class="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                    <div class="p-4 space-y-3">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div class="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          onRejected={() => (
            <div class="text-center py-12">
              <div class="text-5xl mb-4">⚠️</div>
              <h3 class="text-xl text-gray-700 mb-2">خطا در دریافت محصولات</h3>
              <p class="text-gray-500 mb-6">لطفاً دوباره تلاش کنید</p>
              <button
                onClick$={() => window.location.reload()}
                class="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                تلاش مجدد
              </button>
            </div>
          )}
          onResolved={(products) => {
            if (!products || products.length === 0) {
              return (
                <div class="text-center py-12">
                  <div class="text-5xl mb-4">📦</div>
                  <h3 class="text-xl text-gray-700 mb-2">محصولی یافت نشد</h3>
                  <p class="text-gray-500">هنوز محصولی در سیستم ثبت نشده است</p>
                </div>
              );
            }

            return (
              <>
                {/* شبکه محصولات */}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {products.map((product) => {
                    const imageUrl = getFullImageUrl(product.image);
                    const modelColor = getCategoryColor(product.model);
                    const brandColor = getBrandColor(product.brand);

                    return (
                      <div
                        key={product._id}
                        class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2"
                      >
                        {/* افکت پس‌زمینه */}
                        <div class="absolute inset-0 bg-linear-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* تصویر محصول */}
                        <div class="relative overflow-hidden h-56">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
                              <div class="text-5xl text-green-300">🌱</div>
                            </div>
                          )}
                          
                          {/* افکت روی تصویر */}
                          <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* برچسب‌ها */}
                          <div class="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                            <span class={`px-3 py-1.5 rounded-full text-xs font-bold ${modelColor} border shadow-sm`}>
                              {product.model}
                            </span>
                            <span class={`px-3 py-1.5 rounded-full text-xs font-bold ${brandColor} border shadow-sm`}>
                              {product.brand}
                            </span>
                          </div>
                        </div>

                        {/* اطلاعات محصول */}
                        <div class="relative p-5">
                          {/* نام محصول */}
                          <h3 class="font-bold text-gray-900 mb-3 text-lg line-clamp-2 group-hover:text-green-700 transition-colors">
                            {product.name}
                          </h3>
                          
                          {/* جزئیات */}
                          <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                              <span class="text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <span class="text-green-500">📦</span>
                                {formatPackageSize(product.packageSize)}
                              </span>
                            </div>
                            <div class="text-right">
                              <div class="text-lg font-bold text-green-600">
                                {formatPrice(product.price)}
                                <span class="text-sm font-normal mr-1">تومان</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* توضیحات کوتاه */}
                          <p class="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                            {product.content?.substring(0, 100)}...
                          </p>

                          {/* دکمه‌ها */}
                          <div class="flex gap-2">
                            <Link
                              href={`/Products/${product._id}`}
                              class="flex-1 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                            >
                              <span>مشاهده محصول</span>
                              <span class="transition-transform group-hover/btn:translate-x-1">→</span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* افکت پایین کارت */}
                        <div class="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      </div>
                    );
                  })}
                </div>

                {/* دکمه مشاهده همه محصولات */}
                <div class="text-center">
                  <Link
                    href="/Products"
                    class="inline-flex items-center gap-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <span>مشاهده همه محصولات</span>
                    <svg class="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </>
            );
          }}
        />
      </div>
    </section>
  );
});