// src/components/admin/dashboard/profile/ErrorState.tsx
import { component$, $ } from '@builder.io/qwik';
import { ErrorStateProps } from '~/components/types/editeProfile';

export const ErrorState = component$<ErrorStateProps>(({ onRetry }) => {
  return (
    <div class="space-y-6">
      <div class="bg-linear-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">خطا در سیستم</h2>
            <p class="opacity-90">مشکلی در دریافت اطلاعات کاربر رخ داده است</p>
          </div>
          <div class="text-4xl animate-pulse">❌</div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg border border-red-200 p-6 text-center">
        <div class="w-20 h-20 bg-linear-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl text-red-500">⚠️</span>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 mb-3">خطا در بارگذاری اطلاعات</h3>
        
        <div class="space-y-4 mb-6">
          <p class="text-gray-600">
            اطلاعات کاربر به درستی بارگذاری نشد. این ممکن است به دلایل زیر رخ داده باشد:
          </p>
          
          <ul class="text-sm text-gray-600 text-right space-y-2 max-w-md mx-auto">
            <li class="flex items-center justify-end gap-2">
              <span>• مشکل در اتصال اینترنت</span>
              <span class="text-gray-400">🌐</span>
            </li>
            <li class="flex items-center justify-end gap-2">
              <span>• انقضای زمان نشست (Session)</span>
              <span class="text-gray-400">⏰</span>
            </li>
            <li class="flex items-center justify-end gap-2">
              <span>• مشکل در سرور</span>
              <span class="text-gray-400">🖥️</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick$={onRetry}
            class="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🔄 تلاش مجدد
          </button>
          
          <button
            onClick$={() => window.location.reload()}
            class="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🔃 رفرش صفحه
          </button>
          
          <button
            onClick$={() => window.location.href = '/admin/login'}
            class="px-6 py-3 bg-linear-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🔑 ورود مجدد
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            اگر مشکل ادامه داشت، با پشتیبانی فنی تماس بگیرید
          </p>
        </div>
      </div>
    </div>
  );
});