// src/components/ProductId/ProductInfo.tsx
import { $, component$ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';
import { Breadcrumb } from './Breadcrumb';
import { ProductActions } from './ProductActions';

interface ProductInfoProps {
    product: Product;
    isAddingToCart: boolean; // اضافه شده
    isProductInCart: boolean;
    onAddToCart: () => void; // این حالا یک QRL است
    apiBaseUrl: string;
}

export const ProductInfo = component$<ProductInfoProps>(({
    product,
    isProductInCart,
    isAddingToCart,
    onAddToCart,
    apiBaseUrl
}) => {
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

    const getBrandColor = (brand: string): string => {
        if (brand === 'Izirtu Land') return 'blue';
        if (brand === 'Khak Shimi') return 'orange';
        return 'gray';
    };

    const getModelColor = (model: string) => {
        return model === 'جامد' ? 'green' : 'purple';
    };

    return (
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
            <Breadcrumb productName={product.name} />

            {/* نام و برچسب‌ها */}
            <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                    {product.brand && (
                        <span class={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-md ${getBrandColor(product.brand) === 'blue'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                            {product.brand}
                        </span>
                    )}
                    {product.model && (
                        <span class={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-md ${getModelColor(product.model) === 'green'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                            {product.model}
                        </span>
                    )}
                    {product.packageSize && (
                        <span class="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-800 border border-gray-200 rounded-full text-xs md:text-sm font-semibold shadow-md">
                            📦 {formatPackageSize(product.packageSize)}
                        </span>
                    )}
                </div>

                <h1 class="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {product.name}
                </h1>
            </div>

            {/* قیمت */}
            <div class="flex items-end justify-between border-b border-gray-200 pb-4 md:pb-6">
                <div>
                    <div class="text-sm text-gray-500 mb-1">قیمت:</div>
                    <div class="flex items-baseline space-x-2">
                        <span class="text-2xl md:text-4xl font-bold text-green-700">
                            {product.price ? formatPrice(product.price) : 'قیمت نامشخص'}
                        </span>
                    </div>
                </div>
                <div class="text-3xl md:text-4xl animate-float">💰</div>
            </div>

            {/* دکمه‌های اکشن */}
            <ProductActions
                product={product}
                isProductInCart={isProductInCart}
                onAddToCart={onAddToCart}
                isAddingToCart={isAddingToCart}
            />
        </div>
    );
});