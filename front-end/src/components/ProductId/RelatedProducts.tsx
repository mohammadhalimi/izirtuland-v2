// src/components/ProductId/RelatedProducts.tsx
import { component$, Resource } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import ProductSlider from '~/components/layouts/ProductSlider';
import type { Product } from '~/components/types/product';

interface RelatedProductsProps {
    productsResource: any;
    productId: string;
    apiBaseUrl: string;
    onAddToCart: (product: Product) => void; // این حالا یک QRL است
}

export const RelatedProducts = component$<RelatedProductsProps>(({ 
    productsResource, 
    productId, 
    apiBaseUrl, 
    onAddToCart 
}) => {
    return (
        <div class="mt-12 md:mt-20 max-w-7xl mx-auto">
            <div class="mb-6 md:mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 border-r-4 border-green-600 pr-2">
                    محصولات مرتبط
                </h2>
                <p class="text-gray-600 mt-2 text-sm md:text-base">
                    محصولات مشابه که ممکن است مورد علاقه شما باشند
                </p>
            </div>
            
            <Resource
                value={productsResource}
                onPending={() => (
                    <div class="flex justify-center items-center py-12">
                        <div class="relative">
                            <div class="animate-spin rounded-full h-10 w-10 border-2 border-green-200 border-t-green-600"></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-green-600 text-sm">🌿</span>
                            </div>
                        </div>
                        <p class="mr-3 text-gray-600 animate-pulse">در حال بارگذاری محصولات مرتبط...</p>
                    </div>
                )}
                onResolved={(relatedProducts: Product[]) => {
                    if (relatedProducts.length === 0) {
                        return (
                            <div class="text-center py-12 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
                                <div class="text-5xl md:text-6xl mb-4 animate-pulse">📦</div>
                                <p class="text-gray-600">در حال حاضر محصول مرتبطی وجود ندارد</p>
                                <Link
                                    href="/Products"
                                    class="inline-block mt-4 bg-linear-to-r from-green-600 to-emerald-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                    مشاهده همه محصولات
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <ProductSlider
                            products={relatedProducts}
                            title=""
                            apiBaseUrl={apiBaseUrl}
                            onAddToCart={onAddToCart}
                        />
                    );
                }}
            />
        </div>
    );
});