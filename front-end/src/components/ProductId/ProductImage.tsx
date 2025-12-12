// src/routes/products/[id]/ProductImage.tsx
import { component$ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';

interface ProductImageProps {
    product: Product;
    apiBaseUrl: string;
}

export const ProductImage = component$<ProductImageProps>(({ product, apiBaseUrl }) => {
    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${apiBaseUrl}${imagePath}`;
    };

    const getBrandColor = (brand: string): string => {
        if (brand === 'Izirtu Land') return 'blue';
        if (brand === 'Khak Shimi') return 'orange';
        return 'gray';
    };

    return (
        <div class="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-2xl shadow-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/60 hover:-translate-y-1">
            <div class="aspect-video bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden relative group">
                {product.image ? (
                    <img
                        src={getFullImageUrl(product.image)}
                        alt={product.name}
                        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                        onError$={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                    <div class="text-center p-6">
                                        <div class="text-6xl md:text-8xl text-gray-300 mb-4">🌾</div>
                                        <p class="text-gray-400 text-sm md:text-base">تصویر محصول در دسترس نیست</p>
                                    </div>
                                </div>
                            `;
                        }}
                    />
                ) : (
                    <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center p-6">
                            <div class="text-6xl md:text-8xl text-gray-300 mb-4 animate-pulse">🌱</div>
                            <p class="text-gray-400 text-sm md:text-base">تصویر محصول در دسترس نیست</p>
                        </div>
                    </div>
                )}
                
                <div class="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {product.brand && (
                    <div class={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                        getBrandColor(product.brand) === 'blue' 
                            ? 'bg-linear-to-r from-blue-500 to-sky-600 text-white'
                            : getBrandColor(product.brand) === 'orange'
                            ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-linear-to-r from-gray-600 to-gray-700 text-white'
                    }`}>
                        {product.brand}
                    </div>
                )}
            </div>
        </div>
    );
});