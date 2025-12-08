// src/components/layouts/ProductSlider.tsx
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

  // تابع فرمت قیمت
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
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

  // رفتن به صفحه محصول
  const goToProduct = $((productId: string) => {
    window.location.href = `/Products/${productId}`;
  });

  // مقداردهی اولیه Swiper
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => products.length);

    // منتظر بمانیم تا products بارگذاری شوند
    if (products.length === 0) return;

    // منتظر بمانیم تا DOM کاملاً رندر شود
    await new Promise(resolve => setTimeout(resolve, 100));

    if (sliderContainerRef.value && !swiperInstance.value) {
      try {
        // مقداردهی اولیه Swiper
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

        // cleanup function
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
      // منتظر بمانیم تا تغییرات اعمال شود
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
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 border-r-4 border-green-600 pr-4">
          {title}
        </h2>
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
                {products.map((product) => (
                  <div key={product._id} class="swiper-slide">
                    <div class="p-2 h-full">
                      <div class="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
                        {/* برچسب جدید */}
                        {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                          <div class="absolute top-4 right-4 z-10 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            جدید
                          </div>
                        )}

                        {/* تصویر محصول */}
                        <div class="relative h-56 md:h-64 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                          {product.image ? (
                            <img
                              src={getFullImageUrl(product.image)}
                              alt={product.name}
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError$={(e) => {
                                (e.target as HTMLImageElement).src = '/no-image.png';
                              }}
                            />
                          ) : (
                            <div class="w-full h-full flex items-center justify-center">
                              <span class="text-gray-300 text-5xl">📦</span>
                            </div>
                          )}
                          
                          {/* دکمه سریع اضافه به سبد */}
                          {onAddToCart && (
                            <button
                              onClick$={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                              }}
                              class="absolute bottom-4 left-4 bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-green-600 hover:to-emerald-700 transform translate-y-4 group-hover:translate-y-0 shadow-lg flex items-center gap-2 z-20 cursor-pointer"
                            >
                              <span class="text-lg">🛒</span>
                              <span class="text-sm font-medium whitespace-nowrap">افزودن</span>
                            </button>
                          )}
                        </div>
                        
                        {/* اطلاعات محصول */}
                        <div class="p-5 flex-1 flex flex-col">
                          <div class="flex items-center justify-between mb-3">
                            <span class={`px-3 py-1 text-xs rounded-full ${product.brand === 'Izirtu Land' 
                              ? 'bg-linear-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200' 
                              : 'bg-linear-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {product.brand || 'بدون برند'}
                            </span>
                            
                            {product.model && (
                              <span class="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                {product.model}
                              </span>
                            )}
                          </div>
                          
                          <h3 class="font-bold text-gray-900 text-lg mb-3 line-clamp-2 flex-1 group-hover:text-green-700 transition-colors">
                            {product.name}
                          </h3>
                          
                          {product.packageSize && (
                            <div class="flex items-center gap-2 text-gray-600 mb-4">
                              <span class="text-lg text-gray-500">📦</span>
                              <span class="text-sm">{formatPackageSize(product.packageSize)}</span>
                            </div>
                          )}
                          
                          <div class="mt-auto pt-4 border-t border-gray-100">
                            <div class="flex items-center justify-between">
                              <span class="font-bold text-green-700 text-xl">
                                {formatPrice(product.price)}
                              </span>
                              
                              <button
                                onClick$={(e) => {
                                  e.stopPropagation();
                                  goToProduct(product._id);
                                }}
                                class="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-2 group cursor-pointer"
                              >
                                <span class="whitespace-nowrap">جزئیات</span>
                                <span class="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div class="swiper-button-next text-green-600! hover:text-green-800! hidden "></div>
              <div class="swiper-button-prev text-green-600! hover:text-green-800! hidden"></div>
              
              {/* Pagination dots */}
              <div class="swiper-pagination relative! mt-6!"></div>
            </div>            
          </>
        ) : (
          <div class="text-center py-12 bg-gray-50 rounded-2xl">
            <div class="text-5xl mb-4">📦</div>
            <p class="text-gray-600">محصولی برای نمایش وجود ندارد</p>
          </div>
        )}
      </div>
    </div>
  );
});