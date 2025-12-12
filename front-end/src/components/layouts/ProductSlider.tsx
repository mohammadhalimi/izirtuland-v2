// src/components/layouts/ProductSlider.tsx (فقط کارت محصولات حرفه‌ای‌تر)
import { component$, $, useSignal, useVisibleTask$, useOnWindow } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';

// ایمپورت Swiper و ماژول‌های مورد نیاز
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
  products: Product[];
  title?: string;
  apiBaseUrl: string;
  onAddToCart?: (product: Product) => void;
}

export default component$<ProductSliderProps>(({
  products,
  title = "محصولات مرتبط",
  apiBaseUrl,
  onAddToCart
}) => {
  const sliderContainerRef = useSignal<HTMLDivElement>();
  const swiperInstance = useSignal<Swiper | null>(null);
  const hoveredProductId = useSignal<string | null>(null);

  // تابع فرمت قیمت
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // تابع فرمت سایز بسته
  const formatPackageSize = (packageSize: string) => {
    const sizeMap: { [key: string]: string } = {
      '1kg': '۱ کیلوگرم',
      '10kg': '۱۰ کیلوگرم',
      '1litre': '۱ لیتر',
      '5liter': '۵ لیتر',
      '20litre': '۲۰ لیتر'
    };
    return sizeMap[packageSize] || packageSize;
  };

  // تابع دریافت URL کامل تصویر
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiBaseUrl}${imagePath}`;
  };

  // رنگ برند
  const getBrandColors = (brand: string) => {
    if (brand === 'Izirtu Land') {
      return {
        gradient: 'from-blue-500 to-sky-600',
        bg: 'bg-linear-to-r from-blue-500 to-sky-600',
        light: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200'
      };
    } else if (brand === 'Khak Shimi') {
      return {
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-linear-to-r from-amber-500 to-orange-600',
        light: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200'
      };
    }
    return {
      gradient: 'from-gray-500 to-gray-700',
      bg: 'bg-linear-to-r from-gray-500 to-gray-700',
      light: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200'
    };
  };

  // رنگ نوع محصول
  const getModelColors = (model: string) => {
    return model === 'جامد'
      ? {
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-linear-to-r from-green-500 to-emerald-600',
        light: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-200'
      }
      : {
        gradient: 'from-purple-500 to-indigo-600',
        bg: 'bg-linear-to-r from-purple-500 to-indigo-600',
        light: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200'
      };
  };

  // رفتن به صفحه محصول
  const goToProduct = $((productId: string) => {
    window.location.href = `/Products/${productId}`;
  });

  // مقداردهی اولیه Swiper (همان قبلی)
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => products.length);

    if (products.length === 0) return;

    await new Promise(resolve => setTimeout(resolve, 100));

    if (sliderContainerRef.value && !swiperInstance.value) {
      try {
        swiperInstance.value = new Swiper(sliderContainerRef.value, {
          modules: [Navigation, Pagination, Autoplay],
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: true,
          loop: true,
          speed: 500,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
          },
        });

        console.log('Swiper initialized with', products.length, 'products');

        cleanup(() => {
          if (swiperInstance.value) {
            swiperInstance.value.destroy();
            swiperInstance.value = null;
          }
        });
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    }
  });

  // ردیابی تغییرات محصولات و reinitialize Swiper
  useVisibleTask$(({ track }) => {
    track(() => products);

    if (swiperInstance.value && products.length > 0) {
      setTimeout(() => {
        if (swiperInstance.value) {
          swiperInstance.value.update();
        }
      }, 100);
    }
  });

  // ریسایز ویندو
  useOnWindow(
    'resize',
    $(() => {
      if (swiperInstance.value) {
        swiperInstance.value.update();
      }
    })
  );

  return (
    <div class="relative py-8">
      {/* هدر اسلایدر */}
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p class="text-gray-600">با کیفیت ترین محصولات کشاورزی</p>
        </div>
      </div>

      {/* Swiper Container */}
      <div class="relative px-4 md:px-8">
        {products.length > 0 ? (
          <>
            <div
              ref={sliderContainerRef}
              class="swiper"
            >
              <div class="swiper-wrapper">
                {products.map((product) => {
                  const brandColors = getBrandColors(product.brand);
                  const modelColors = getModelColors(product.model);
                  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                  return (
                    <div key={product._id} class="swiper-slide">
                      <div onClick$={(e) => {
                        e.stopPropagation();
                        goToProduct(product._id);
                      }}
                        class="p-2 h-full">
                        {/* کارت محصول حرفه‌ای */}
                        <div
                          class="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group h-full flex flex-col border border-gray-100 hover:border-green-300 cursor-pointer"
                          onMouseEnter$={() => hoveredProductId.value = product._id}
                          onMouseLeave$={() => hoveredProductId.value = null}
                        >
                          {/* Corner Decoration */}
                          <div class={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}>
                            <div class={`absolute transform rotate-45 ${brandColors.bg} text-white text-xs font-bold py-1 text-center w-48 top-5 -right-16 shadow-lg`}>
                              {product.brand}
                            </div>
                          </div>

                          {/* برچسب جدید */}
                          {isNew && (
                            <div class="absolute top-4 left-4 z-10">
                              <div class="relative">
                                <div class="bg-linear-to-r from-red-500 via-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-6 animate-pulse">
                                  <span class="mr-1">✨</span>جدید
                                </div>
                                <div class="absolute -inset-1 bg-linear-to-r from-red-500 to-rose-500 rounded-full blur opacity-30 animate-ping"></div>
                              </div>
                            </div>
                          )}

                          {/* تصویر محصول */}
                          <div class="relative h-64 md:h-72 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                            {/* Background Pattern */}
                            <div class="absolute inset-0 opacity-10">
                              <div class="absolute top-0 left-0 w-32 h-32 bg-linear-to-r from-green-400 to-emerald-400 rounded-full blur-3xl"></div>
                              <div class="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-r from-blue-400 to-sky-400 rounded-full blur-3xl"></div>
                            </div>

                            {product.image ? (
                              <img
                                src={getFullImageUrl(product.image)}
                                alt={product.name}
                                class={`w-full h-full object-cover transition-all duration-700 ${hoveredProductId.value === product._id ? 'scale-110' : 'scale-100'
                                  }`}
                                onError$={(e) => {
                                  (e.target as HTMLImageElement).src = '/no-image.png';
                                }}
                              />
                            ) : (
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="text-center">
                                  <span class="text-gray-300 text-6xl animate-pulse">🌱</span>
                                  <p class="text-gray-400 mt-2 text-sm">بدون تصویر</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* اطلاعات محصول */}
                          <div class="p-6 flex-1 flex flex-col">
                            {/* برند و نوع */}
                            <div class="flex items-center justify-between mb-4">
                              <div class="flex items-center gap-2">
                                <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${modelColors.bg} shadow-md`}>
                                  <span class="text-white text-sm">
                                    {product.model === 'جامد' ? '🧪' : '💧'}
                                  </span>
                                </div>
                                <span class={`text-sm font-medium ${modelColors.text}`}>
                                  {product.model}
                                </span>
                              </div>

                              <div class={`px-3 py-1.5 rounded-lg ${brandColors.light} ${brandColors.border} border`}>
                                <span class={`text-sm font-bold ${brandColors.text}`}>
                                  {product.brand || 'بدون برند'}
                                </span>
                              </div>
                            </div>

                            {/* نام محصول */}
                            <h3 class="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                              {product.name}
                            </h3>

                            {/* سایز بسته */}
                            {product.packageSize && (
                              <div class="flex items-center gap-2 text-gray-600 mb-4 p-3 bg-gray-50 rounded-xl">
                                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                  <span class="text-gray-500 text-lg">📦</span>
                                </div>
                                <div>
                                  <div class="text-sm text-gray-500">سایز بسته</div>
                                  <div class="font-medium text-gray-900">
                                    {formatPackageSize(product.packageSize)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* توضیحات مختصر */}
                            <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                              {product.content || 'محصول با کیفیت عالی و استانداردهای بین‌المللی'}
                            </p>

                            {/* قیمت و دکمه */}
                            <div class="mt-auto pt-4 border-t border-gray-100">
                              <div class="flex items-center justify-between">
                                <div>
                                  <div class="text-sm text-gray-500 mb-1">قیمت</div>
                                  <div class="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                                    {formatPrice(product.price)}
                                  </div>
                                </div>

                                <button
                                  onClick$={(e) => {
                                    e.stopPropagation();
                                    goToProduct(product._id);
                                  }}
                                  class="group relative overflow-hidden bg-linear-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                >
                                  <div class="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <span class="relative flex items-center gap-2">
                                    <span>جزئیات</span>
                                    <span class="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Price Tag Effect */}
                          <div class="absolute -top-1 -right-1">
                            <div class="relative">
                              <div class="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                              <div class="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div class="swiper-button-next text-green-600! hover:text-green-800! hidden md:block!"></div>
              <div class="swiper-button-prev text-green-600! hover:text-green-800! hidden md:block!"></div>

              {/* Pagination dots */}
              <div class="swiper-pagination relative! mt-6!"></div>
            </div>

            {/* Counter */}
            <div class="text-center mt-6">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-green-700 font-medium">
                  {products.length} محصول مرتبط
                </span>
              </div>
            </div>
          </>
        ) : (
          <div class="text-center py-12 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg">
            <div class="inline-block mb-6">
              <div class="w-20 h-20 bg-linear-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center animate-pulse">
                <span class="text-4xl text-gray-400">📦</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">محصولی یافت نشد</h3>
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              در حال حاضر محصول مرتبطی برای نمایش وجود ندارد
            </p>
            <button
              onClick$={() => window.location.href = '/Products'}
              class="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span>مشاهده همه محصولات</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});