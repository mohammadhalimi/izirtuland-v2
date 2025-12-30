// src/routes/products/[id]/ErrorState.tsx
import { $, component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { error } from 'console';

export interface ErrorStateProps {
    onRetry: () => void;
}

export const ErrorState = component$<ErrorStateProps>(({ onRetry }) => {

    const handleRetry = $(() => {
        onRetry();
    });
    
    return (
        <div class="text-center py-20 bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-2xl mx-auto">
            <div class="text-red-500 mb-6">
                <div class="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <span class="text-3xl md:text-4xl">⚠️</span>
                </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">خطا در دریافت محصول</h3>
            <p class="text-gray-600 mb-6">
                {error || 'محصول مورد نظر یافت نشد یا مشکلی در ارتباط با سرور وجود دارد.'}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/Products"
                    class="inline-block bg-linear-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                    مشاهده همه محصولات
                </Link>
                <button
                    onClick$={handleRetry}
                    class="inline-block bg-linear-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                    تلاش مجدد
                </button>
            </div>
        </div>
    );
});