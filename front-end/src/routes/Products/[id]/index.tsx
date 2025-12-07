// src/routes/products/[id]/index.tsx (اصلاح شده)
import { $, component$, Resource, useContext, useResource$ } from '@builder.io/qwik';
import { useLocation, Link, routeLoader$ } from '@builder.io/qwik-city';
import ProductSlider from '~/components/layouts/ProductSlider';
import type { Product } from '~/components/types/product';
import { API_BASE_URL } from '~/config/api';
import { CartContext } from '~/context/cart-context';

export const useProduct = routeLoader$(async (requestEvent) => {
    const { params, status } = requestEvent;

    if (!params.id || params.id === 'undefined') {
        console.error('Product ID is missing or undefined');
        status(404);
        return null;
    }

    const apiUrl = `${API_BASE_URL}/api/product/${params.id}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();

            // تبدیل داده API به Product type
            const product: Product = {
                _id: data._id || data.id || '',
                id: data.id || data._id || '',
                name: data.name || '',
                content: data.content || '',
                image: data.image || '',
                createdAt: data.createdAt || new Date().toISOString(),
                brand: data.brand || '',
                price: Number(data.price) || 0,
                model: data.model || '',
                packageSize: data.packageSize || ''
            };

            return product;
        } else {
            const errorText = await response.text();
            status(response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        status(500);
        return null;
    }
});

export default component$(() => {
    const location = useLocation();
    const productId = location.params.id;
    const productResource = useProduct();
    const cart = useContext(CartContext);

    // دریافت تصادفی محصولات برای اسلایدر
    const relatedProductsResource = useResource$<Product[]>(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/product`);
            if (response.ok) {
                const allProducts: Product[] = await response.json();

                // حذف محصول فعلی از لیست
                const filteredProducts = allProducts.filter(p => p._id !== productId);

                // اگر کمتر از ۴ محصول باقی مانده، همه را برگردان
                if (filteredProducts.length <= 4) {
                    return filteredProducts;
                }

                // انتخاب تصادفی ۴ محصول
                const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, 5);
            }
            return [];
        } catch (error) {
            console.error('Error fetching related products:', error);
            return [];
        }
    });

    const addToCart = $(async (product: Product) => {
        if (!cart.addItem) {
            console.error('Cart functions not initialized yet');
            alert('سیستم سبد خرید آماده نیست. لطفاً چند لحظه صبر کنید.');
            return;
        }

        await cart.addItem({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            packageSize: product.packageSize,
            brand: product.brand,
            model: product.model,
            image: product.image
        });

        alert("محصول به سبد خرید اضافه شد!");
    });

    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR') + ' تومان';
    };

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

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('fa-IR');
        } catch {
            return dateString;
        }
    };

    return (
        <div class="min-h-screen bg-linear-to-br from-gray-50 to-white">
            {/* هدر */}
            <header class="sticky top-0 z-10 bg-white shadow-md">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6 rtl:space-x-reverse">
                            <Link
                                href="/"
                                class="text-3xl font-extrabold text-green-700 hover:text-green-800 transition-colors duration-200"
                            >
                                پربارباغستان
                            </Link>
                            <div class="h-6 w-px bg-gray-300 hidden md:block"></div>
                            <nav class="hidden md:flex items-center space-x-6 text-sm text-gray-700">
                                <Link href="/" class="hover:text-green-700 transition-colors">خانه</Link>
                                <Link href="/Products" class="hover:text-green-700 transition-colors">محصولات</Link>
                                <span class="text-green-600 font-semibold border-b-2 border-green-600 pb-1">جزئیات محصول</span>
                            </nav>
                        </div>
                        {/* نمایش تعداد محصولات در سبد */}
                        <Link href="/Card" class="relative">
                            <div class="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-700 bg-emerald-50">
                                🛒
                            </div>
                            {cart.items.length > 0 && (
                                <div class="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Resource
                    value={productResource}
                    onPending={() => (
                        <div class="flex flex-col justify-center items-center py-40">
                            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                            <p class="mt-6 text-xl text-gray-600">در حال بارگذاری محصول...</p>
                        </div>
                    )}
                    onRejected={(error) => (
                        <div class="text-center py-20 bg-white rounded-xl shadow-lg p-10">
                            <div class="text-red-500 mb-6">
                                <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-3">خطا در دریافت محصول</h3>
                            <p class="text-gray-600 mb-8">{error?.message || 'مشکلی پیش آمده، لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.'}</p>
                            <Link
                                href="/products"
                                class="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md"
                            >
                                مشاهده همه محصولات
                            </Link>
                        </div>
                    )}
                    onResolved={(product: Product | null) => {
                        if (!product) {
                            return (
                                <div class="text-center py-20 bg-white rounded-xl shadow-lg p-10">
                                    <div class="text-gray-400 mb-6">
                                        <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 class="text-2xl font-bold text-gray-900 mb-3">محصول یافت نشد</h3>
                                    <p class="text-gray-600 mb-8">محصول مورد نظر با شناسه **{productId}** وجود ندارد یا حذف شده است.</p>
                                    <Link
                                        href="/products"
                                        class="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
                                    >
                                        مشاهده همه محصولات
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <>
                                <div class="max-w-6xl mx-auto">
                                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                        {/* تصویر محصول */}
                                        <div class="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-gray-200/50 transition-transform hover:shadow-2xl hover:shadow-gray-300/60 duration-300">
                                            <div class="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                                                {product.image ? (
                                                    <img
                                                        src={getFullImageUrl(product.image)}
                                                        alt={product.name}
                                                        class="w-full h-full object-contain"
                                                        onError$={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                                                <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                                    <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            `;
                                                        }}
                                                    />
                                                ) : (
                                                    <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* اطلاعات محصول */}
                                        <div class="lg:col-span-2 space-y-8">
                                            {/* نام و برچسب‌ها */}
                                            <div class="space-y-4">
                                                <div class="flex items-center space-x-3">
                                                    <span class={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm ${product.brand === 'Izirtu Land'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                        }`}>
                                                        {product.brand || 'بدون برند'}
                                                    </span>
                                                    <span class={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm ${product.model === 'جامد'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-indigo-100 text-indigo-800'
                                                        }`}>
                                                        {product.model || 'بدون مدل'}
                                                    </span>
                                                </div>

                                                <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">
                                                    {product.name}
                                                </h1>
                                            </div>

                                            {/* قیمت و دکمه خرید */}
                                            <div class="space-y-6">
                                                <div class="flex items-end justify-between border-b border-gray-200 pb-4">
                                                    <div class="flex items-baseline space-x-2">
                                                        <span class="text-4xl font-bold text-green-700">
                                                            {product.price ? formatPrice(product.price) : 'قیمت نامشخص'}
                                                        </span>
                                                        {product.packageSize && (
                                                            <span class="text-lg text-gray-500 font-medium mr-2">
                                                                ( {formatPackageSize(product.packageSize)} )
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick$={() => addToCart(product)}
                                                    class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition-colors duration-200 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-600/50"
                                                >
                                                    🛒 افزودن به سبد خرید
                                                </button>
                                            </div>

                                            {/* توضیحات */}
                                            {product.content && (
                                                <div class="space-y-4 border-t border-gray-100 pt-6">
                                                    <h2 class="text-2xl font-bold text-gray-900 border-r-4 border-green-600 pr-2">توضیحات محصول</h2>
                                                    <p class="text-gray-700 leading-8 whitespace-pre-line text-justify bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        {product.content}
                                                    </p>
                                                </div>
                                            )}

                                            {/* مشخصات فنی */}
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div class="flex items-center p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                                    <span class="text-2xl mr-3">🏷️</span>
                                                    <div class="flex-1">
                                                        <div class="text-sm text-gray-500">برند</div>
                                                        <div class="font-semibold text-gray-900">{product.brand || 'نامشخص'}</div>
                                                    </div>
                                                </div>

                                                <div class="flex items-center p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                                    <span class="text-2xl mr-3">📦</span>
                                                    <div class="flex-1">
                                                        <div class="text-sm text-gray-500">نوع محصول</div>
                                                        <div class="font-semibold text-gray-900">{product.model || 'نامشخص'}</div>
                                                    </div>
                                                </div>

                                                <div class="flex items-center p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                                    <span class="text-2xl mr-3">⚖️</span>
                                                    <div class="flex-1">
                                                        <div class="text-sm text-gray-500">سایز بسته</div>
                                                        <div class="font-semibold text-gray-900">{formatPackageSize(product.packageSize) || 'نامشخص'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* اسلایدر محصولات مرتبط */}
                                <div class="mt-20 max-w-6xl mx-auto">
                                    <Resource
                                        value={relatedProductsResource}
                                        onPending={() => (
                                            <div class="flex justify-center items-center py-12">
                                                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                                                <p class="mr-3 text-gray-600">در حال بارگذاری محصولات مرتبط...</p>
                                            </div>
                                        )}
                                        onResolved={(relatedProducts) => {
                                            if (relatedProducts.length === 0) {
                                                return (
                                                    <div class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                                                        <div class="text-6xl mb-4">📦</div>
                                                        <p class="text-gray-600">در حال حاضر محصول مرتبطی وجود ندارد</p>
                                                        <Link
                                                            href="/products"
                                                            class="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            مشاهده همه محصولات
                                                        </Link>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <ProductSlider
                                                    products={relatedProducts}
                                                    title="محصولات مرتبط"
                                                    apiBaseUrl={API_BASE_URL}
                                                    onAddToCart={addToCart}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </>
                        );
                    }}
                />
            </main>
        </div>
    );
});