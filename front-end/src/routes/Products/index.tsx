// src/routes/products/index.tsx
import { component$, useResource$, Resource, useSignal, useComputed$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { Product } from '~/components/types/product';
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
            {/* هدر مینیمال */}
            <header class="border-b border-gray-100">
                <div class="container mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <Link
                                href="/"
                                class="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-200"
                            >
                                پربارباغستان
                            </Link>
                            <div class="h-6 w-px bg-gray-200"></div>
                            <nav class="flex items-center space-x-6 text-sm text-gray-600 px-2">
                                <Link href="/" class="hover:text-gray-900 transition-colors">خانه</Link>
                                <span class="text-green-600 font-medium">محصولات</span>
                                <Link href="/Blog" class="hover:text-gray-900 transition-colors">بلاگ</Link>
                                <Link href="/About" class="hover:text-gray-900 transition-colors">درباره ما</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* هیرو سکشن */}
            <section class="bg-linear-to-br from-gray-50 to-white py-16">
                <div class="container mx-auto px-6">
                    <div class="text-center max-w-3xl mx-auto">
                        <h1 class="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            محصولات <span class="text-green-600">کشاورزی</span>
                        </h1>
                        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                            با کیفیت‌ترین محصولات کود و سموم کشاورزی با استانداردهای بین‌المللی
                        </p>
                    </div>
                </div>
            </section>
            {/* فیلترها */}
            <section class="border-b border-gray-100 bg-white sticky top-0 z-30">
                <div class="container mx-auto px-6 py-6">
                    <div class="flex flex-col lg:flex-row items-center justify-between gap-6">

                        {/* search */}
                        <div class="flex-1 w-full max-w-xl">
                            <div class="relative">
                                <input
                                    type="text"
                                    placeholder="جستجو در محصولات..."
                                    class="w-full px-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500"
                                    value={searchText.value}
                                    onInput$={(e) => (searchText.value = (e.target as HTMLInputElement).value)}
                                />
                                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </div>
                            </div>
                        </div>

                        {/* brand */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 rounded-lg"
                            onChange$={(e) => (selectedBrand.value = (e.target as HTMLSelectElement).value)}
                        >
                            <option value="">همه برندها</option>
                            <option value="Izirtu Land">Izirtu Land</option>
                            <option value="Khak Shimi">Khak Shimi</option>
                        </select>

                        {/* model */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 rounded-lg"
                            onChange$={(e) => (selectedModel.value = (e.target as HTMLSelectElement).value)}
                        >
                            <option value="">همه انواع</option>
                            <option value="جامد">جامد</option>
                            <option value="مایع">مایع</option>
                        </select>

                        {/* size */}
                        <select
                            class="px-4 cursor-pointer py-3 bg-gray-50 rounded-lg"
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
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    )}
                    onRejected={() => (
                        <div class="text-center py-20">
                            <div class="text-gray-400 mb-4">
                                {/* ... */}
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">خطا در دریافت محصولات</h3>
                            <p class="text-gray-600">لطفاً دوباره تلاش کنید</p>
                        </div>
                    )}
                    onResolved={(products: Product[]) => {
                        const allProducts: Product[] = products ?? [];


                        const q = normalizeText(searchText.value);
                        const filtered: Product[] = allProducts.filter((product: Product) => {
                            const normalizedName = normalizeText(product.name);

                            const matchSearch =
                                q === '' || normalizedName.includes(q);

                            const matchBrand = selectedBrand.value ? product.brand === selectedBrand.value : true;
                            const matchModel = selectedModel.value ? product.model === selectedModel.value : true;
                            const matchSize = selectedSize.value ? product.packageSize === selectedSize.value : true;

                            return matchSearch && matchBrand && matchModel && matchSize;
                        });

                        return (
                            <>
                                {filtered.length === 0 ? (
                                    <div class="text-center py-20">
                                        <div class="text-gray-300 mb-4">
                                            {/* ... آیکون و متن خالی ... */}
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-900 mb-2">محصولی یافت نشد</h3>
                                        <p class="text-gray-600">به زودی محصولات جدید اضافه خواهند شد</p>
                                    </div>
                                ) : (
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {filtered.map((product: Product) => (
                                            <a
                                                key={product._id}
                                                href={`/Products/${product._id}`}
                                                class="group bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden block"
                                            >
                                                {/* تصویر محصول */}
                                                <div class="relative aspect-w-16 aspect-h-12 bg-gray-100 overflow-hidden">
                                                    {product.image ? (
                                                        <img
                                                            src={getFullImageUrl(product.image)}
                                                            alt={product.name}
                                                            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div class="w-full h-48 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-400">
                                                            {/* ... placeholder svg ... */}
                                                        </div>
                                                    )}

                                                    {/* برچسب برند */}
                                                    <div
                                                        class={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getBrandColor(product.brand) === 'blue' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                                                            }`}
                                                    >
                                                        {product.brand}
                                                    </div>
                                                </div>

                                                {/* محتوای محصول */}
                                                <div class="p-5">
                                                    <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>

                                                    <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.content}</p>

                                                    <div class="flex items-center justify-between mb-4">
                                                        <span
                                                            class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getModelColor(product.model) === 'green' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                                                }`}
                                                        >
                                                            {product.model}
                                                        </span>
                                                        <span class="text-sm text-gray-500 font-medium">{formatPackageSize(product.packageSize)}</span>
                                                    </div>

                                                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <div class="text-lg font-bold text-gray-900">{formatPrice(product.price)}</div>
                                                        <div class="text-green-600 text-sm font-medium group-hover:text-green-700">مشاهده جزئیات →</div>
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