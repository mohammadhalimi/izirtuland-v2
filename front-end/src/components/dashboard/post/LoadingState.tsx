// src/components/admin/dashboard/posts/LoadingState.tsx
import { component$ } from '@builder.io/qwik';

export const LoadingState = component$(() => {
  return (
    <div class="space-y-6">
      <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">مدیریت پست‌های من</h2>
            <p class="opacity-90">در حال بارگذاری...</p>
          </div>
          <div class="text-4xl animate-pulse">📝</div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-12 text-center">
        <div class="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 mb-2">در حال بارگذاری پست‌های شما...</p>
        <p class="text-sm text-gray-500">لطفاً کمی صبر کنید</p>
      </div>
    </div>
  );
});