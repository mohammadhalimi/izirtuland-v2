// src/routes/products/[id]/Breadcrumb.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface BreadcrumbProps {
    productName: string;
}

export const Breadcrumb = component$<BreadcrumbProps>(({ productName }) => {
    return (
        <nav class="flex items-center text-sm text-gray-500">
            <Link 
                href="/" 
                class="hover:text-green-600 transition-colors flex items-center"
            >
                <span class="ml-1">🏠</span>
                خانه
            </Link>
            <span class="mx-2">/</span>
            <Link 
                href="/Products" 
                class="hover:text-green-600 transition-colors"
            >
                محصولات
            </Link>
            <span class="mx-2">/</span>
            <span class="text-green-600 font-medium truncate max-w-xs">
                {productName}
            </span>
        </nav>
    );
});