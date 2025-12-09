// src/routes/products/index.tsx
import { component$, useResource$, Resource, useSignal, useComputed$ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';
import { UpText } from '~/components/ui/products/UpText';
import { API_BASE_URL } from '~/config/api';

const normalizeText = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')        
        .replace(/ي/g, 'ی')       
        .replace(/ك/g, 'ک');   
};

export default component$(() => {
    // -----------  STATE های فیلترها  ---------------
    const searchText = useSignal('');
    const selectedBrand = useSignal('');
    const selectedModel = useSignal('');
    const selectedSize = useSignal('');

    // -----------  دریافت محصولات از API  ---------------
    const productsResource = useResource$<Product[]>(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/product`);
            if (response.ok) return await response.json();
            return [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    });
    
    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR') + ' تومان';
    };

    const getBrandColor = (brand: string): string => {
        if (brand === 'Izirtu Land') return 'blue';
        if (brand === 'Khak Shimi') return 'orange';
        return 'gray';
    };

    const getModelColor = (model: string) => {
        return model === 'جامد' ? 'green' : 'purple';
    };

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

    return (
        <div class="min-h-screen bg-white">
            <UpText />
            {/* فیلترها */}
            <section class="border-y border-gray-100 bg-white shadow-sm">
                <div class="container mx-auto px-6 py-6">
                    <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* search */}
                        <div class="flex-1 w-full max-w-xl">
                            <div class="relative">
                                <input
                                    type="text"
                                    placeholder="جستجو در محصولات..."
                                    class="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    value={searchText.value}
                                    onInput$={(e) => (searchText.value = (e.target as HTMLInputElement).value)}
                                />
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </div>
                            </div>
                        </div>

                        {/* brand */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange$={(e) => (selectedBrand.value = (e.target as HTMLSelectElement).value)}
                        >
                            <option value="">همه برندها</option>
                            <option value="Izirtu Land">Izirtu Land</option>
                            <option value="Khak Shimi">Khak Shimi</option>
                        </select>

                        {/* model */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange$={(e) => (selectedModel.value = (e.target as HTMLSelectElement).value)}
                        >
                            <option value="">همه انواع</option>
                            <option value="جامد">جامد</option>
                            <option value="مایع">مایع</option>
                        </select>

                        {/* size */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            onChange$={(e) => (selectedSize.value = (e.target as HTMLSelectElement).value)}
                        >
                            <option value="">همه سایزها</option>
                            <option value="1kg">1 کیلوگرم</option>
                            <option value="10kg">10 کیلوگرم</option>
                            <option value="1litre">1 لیتر</option>
                            <option value="5liter">5 لیتر</option>
                            <option value="20litre">20 لیتر</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* محتوای اصلی */}
            <main class="container mx-auto px-6 py-12">
                <Resource
                    value={productsResource}
                    onPending={() => (
                        <div class="flex justify-center items-center py-20">
                            <div class="relative">
                                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-green-600 font-semibold">در حال بارگیری...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    onRejected={() => (
                        <div class="text-center py-20">
                            <div class="text-gray-400 mb-4 text-6xl">⚠️</div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">خطا در دریافت محصولات</h3>
                            <p class="text-gray-600 mb-6">لطفاً دوباره تلاش کنید</p>
                            <button 
                                onClick$={() => window.location.reload()}
                                class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                                تلاش مجدد
                            </button>
                        </div>
                    )}
                    onResolved={(products: Product[]) => {
                        const allProducts: Product[] = products ?? [];
                        const q = normalizeText(searchText.value);
                        
                        const filtered: Product[] = allProducts.filter((product: Product) => {
                            const normalizedName = normalizeText(product.name);
                            const matchSearch = q === '' || normalizedName.includes(q);
                            const matchBrand = selectedBrand.value ? product.brand === selectedBrand.value : true;
                            const matchModel = selectedModel.value ? product.model === selectedModel.value : true;
                            const matchSize = selectedSize.value ? product.packageSize === selectedSize.value : true;

                            return matchSearch && matchBrand && matchModel && matchSize;
                        });

                        return (
                            <>
                                <div class="mb-8 flex items-center justify-between">
                                    <h2 class="text-2xl font-bold text-gray-900">
                                        محصولات موجود 
                                        {filtered.length > 0 && (
                                            <span class="text-green-600 mr-2"> ({filtered.length} محصول)</span>
                                        )}
                                    </h2>
                                    
                                    <div class="text-sm text-gray-500">
                                        <span class="ml-2">🔄</span>
                                        به روزرسانی لحظه‌ای
                                    </div>
                                </div>
                                
                                {filtered.length === 0 ? (
                                    <div class="text-center py-20">
                                        <div class="text-gray-300 mb-4 text-8xl">🌱</div>
                                        <h3 class="text-2xl font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
                                        <p class="text-gray-600 mb-8 max-w-md mx-auto">
                                            متأسفانه با فیلترهای انتخابی شما محصولی یافت نشد. لطفاً فیلترها را تغییر دهید یا عبارت جستجوی دیگری را امتحان کنید.
                                        </p>
                                        <button 
                                            onClick$={() => {
                                                searchText.value = '';
                                                selectedBrand.value = '';
                                                selectedModel.value = '';
                                                selectedSize.value = '';
                                            }}
                                            class="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                                        >
                                            حذف همه فیلترها
                                        </button>
                                    </div>
                                ) : (
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {filtered.map((product: Product) => (
                                            <a
                                                key={product._id}
                                                href={`/Products/${product._id}`}
                                                class="group bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300 overflow-hidden block transform hover:-translate-y-1"
                                            >
                                                {/* تصویر محصول */}
                                                <div class="relative aspect-w-16 aspect-h-12 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                                                    {product.image ? (
                                                        <img
                                                            src={getFullImageUrl(product.image)}
                                                            alt={product.name}
                                                            class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div class="w-full h-48 flex items-center justify-center">
                                                            <div class="text-gray-300 text-6xl">🌾</div>
                                                        </div>
                                                    )}

                                                    {/* برچسب برند */}
                                                    <div
                                                        class={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getBrandColor(product.brand) === 'blue' 
                                                            ? 'bg-linear-to-r from-blue-500 to-sky-600 text-white' 
                                                            : 'bg-linear-to-r from-orange-500 to-amber-600 text-white'}`}
                                                    >
                                                        {product.brand}
                                                    </div>
                                                    
                                                    {/* برچسب نوع محصول */}
                                                    <div
                                                        class={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getModelColor(product.model) === 'green' 
                                                            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white' 
                                                            : 'bg-linear-to-r from-purple-500 to-indigo-600 text-white'}`}
                                                    >
                                                        {product.model}
                                                    </div>
                                                </div>

                                                {/* محتوای محصول */}
                                                <div class="p-6">
                                                    <h3 class="font-bold text-gray-900 mb-3 line-clamp-2 leading-tight text-lg group-hover:text-green-700 transition-colors">
                                                        {product.name}
                                                    </h3>

                                                    <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {product.content}
                                                    </p>

                                                    <div class="flex items-center justify-between mb-6">
                                                        <span class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                            📦 {formatPackageSize(product.packageSize)}
                                                        </span>
                                                        <div class="flex items-center text-amber-500">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} class="text-sm">★</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div class="flex items-center justify-between pt-5 border-t border-gray-100">
                                                        <div>
                                                            <div class="text-lg font-bold text-gray-900">
                                                                {formatPrice(product.price)}
                                                            </div>
                                                            <div class="text-xs text-gray-500 mt-1">قیمت نهایی با مالیات</div>
                                                        </div>
                                                        <div class="text-green-600 text-sm font-semibold group-hover:text-green-700 flex items-center">
                                                            مشاهده جزئیات
                                                            <span class="mr-2 group-hover:mr-0 group-hover:ml-2 transition-all duration-300">→</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    }}
                />
            </main>
        </div>
    );
});