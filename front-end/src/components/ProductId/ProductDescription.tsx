// src/routes/products/[id]/ProductDescription.tsx
import { component$ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';

interface ProductDescriptionProps {
    product: Product;
}

export const ProductDescription = component$<ProductDescriptionProps>(({ product }) => {
    if (!product.content) return null;

    return (
        <div class="space-y-3 md:space-y-4 border-t border-gray-100 pt-4 md:pt-6">
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 border-r-4 border-green-600 pr-2">
                توضیحات محصول
            </h2>
            <div class="text-gray-700 leading-6 md:leading-8 whitespace-pre-line text-justify bg-linear-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm text-sm md:text-base">
                {product.content}
            </div>
        </div>
    );
});