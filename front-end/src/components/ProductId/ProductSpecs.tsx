// src/routes/products/[id]/ProductSpecs.tsx
import { component$ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';

interface ProductSpecsProps {
    product: Product;
}

export const ProductSpecs = component$<ProductSpecsProps>(({ product }) => {
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

    const specs = [
        { 
            key: 'brand', 
            label: 'برند', 
            value: product.brand,
            icon: '🏷️',
            hoverColor: 'text-green-600'
        },
        { 
            key: 'model', 
            label: 'نوع محصول', 
            value: product.model,
            icon: '📦',
            hoverColor: 'text-purple-600'
        },
        { 
            key: 'packageSize', 
            label: 'سایز بسته', 
            value: formatPackageSize(product.packageSize),
            icon: '⚖️',
            hoverColor: 'text-amber-600'
        }
    ].filter(spec => spec.value);

    if (specs.length === 0) return null;

    return (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {specs.map(spec => (
                <div 
                    key={spec.key}
                    class="flex items-center p-3 md:p-4 bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-md transition-all duration-300 group"
                >
                    <span class={`text-xl md:text-2xl mr-2 md:mr-3 text-gray-400 group-hover:${spec.hoverColor} transition-colors`}>
                        {spec.icon}
                    </span>
                    <div class="flex-1">
                        <div class="text-xs md:text-sm text-gray-500">{spec.label}</div>
                        <div class="font-semibold text-gray-900 text-sm md:text-base">{spec.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
});