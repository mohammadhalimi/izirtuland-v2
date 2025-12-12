// src/routes/products/[id]/LoadingState.tsx
import { component$ } from '@builder.io/qwik';

export const LoadingState = component$(() => {
    return (
        <div class="flex flex-col justify-center items-center py-20 md:py-32">
            <div class="relative">
                <div class="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-600"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-green-600 text-2xl animate-pulse">🌱</span>
                </div>
            </div>
            <p class="mt-6 text-xl text-gray-600 animate-pulse">در حال بارگذاری محصول...</p>
        </div>
    );
});