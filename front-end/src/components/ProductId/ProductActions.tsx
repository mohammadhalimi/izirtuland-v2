// src/components/ProductId/ProductActions.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { Product } from '~/components/types/product';

interface ProductActionsProps {
    product: Product;
    isProductInCart: boolean;
    onAddToCart: () => void; // این حالا یک QRL است
}

export const ProductActions = component$<ProductActionsProps>(({ 
    product, 
    isProductInCart, 
    onAddToCart 
}) => {
    return (
        <div class="space-y-6">
            {isProductInCart && (
                <div class="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 md:p-6">
                    <div class="flex items-center">
                        <span class="text-xl md:text-2xl text-green-600 mr-3">✅</span>
                        <div>
                            <h3 class="font-bold text-green-800 text-sm md:text-base">
                                این محصول در سبد خرید شما موجود است
                            </h3>
                            <p class="text-green-700 text-xs md:text-sm mt-1">
                                برای تغییر تعداد به صفحه سبد خرید مراجعه کنید
                            </p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <Link
                            href="/Card"
                            class="inline-block w-full bg-linear-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 text-center"
                        >
                            مشاهده سبد خرید
                        </Link>
                    </div>
                </div>
            )}

            {/* دکمه اصلی افزودن به سبد خرید */}
            <button
                data-product-id={product._id}
                onClick$={onAddToCart} // استفاده مستقیم از QRL
                disabled={isProductInCart}
                class={`w-full py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group cursor-pointer ${
                    isProductInCart
                        ? 'bg-linear-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                        : 'bg-linear-to-r from-green-600 via-emerald-500 to-green-600 text-white hover:shadow-2xl hover:shadow-green-500/50'
                }`}
            >
                <div class={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isProductInCart
                        ? 'bg-linear-to-r from-gray-500 to-gray-600'
                        : 'bg-linear-to-r from-emerald-600 to-green-600'
                }`}></div>
                
                <span class="relative flex items-center justify-center">
                    <span class="mr-2 md:mr-3 text-xl md:text-2xl">
                        {isProductInCart ? '✅' : '🛒'}
                    </span>
                    {isProductInCart ? 'موجود در سبد خرید' : 'افزودن به سبد خرید'}
                    {!isProductInCart && (
                        <span class="mr-2 group-hover:mr-0 group-hover:ml-2 transition-all duration-300">→</span>
                    )}
                </span>
            </button>
        </div>
    );
});