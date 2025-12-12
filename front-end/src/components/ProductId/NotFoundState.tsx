// src/routes/products/[id]/NotFoundState.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface NotFoundStateProps {
    productId: string;
}

export const NotFoundState = component$<NotFoundStateProps>(({ productId }) => {
    return (
        <div class="text-center py-20 bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-2xl mx-auto">
            <div class="text-gray-400 mb-6">
                <div class="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span class="text-3xl md:text-4xl">📦</span>
                </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">محصول یافت نشد</h3>
            <p class="text-gray-600 mb-6">
                محصول مورد نظر با شناسه <code class="bg-gray-100 px-2 py-1 rounded">{productId}</code> وجود ندارد یا حذف شده است.
            </p>
            <Link
                href="/Products"
                class="inline-block bg-linear-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
                بازگشت به محصولات
            </Link>
        </div>
    );
});