// src/components/admin/dashboard/customer/ErrorAlert.tsx
import { component$ } from '@builder.io/qwik';
import { ErrorAlertProps } from '~/components/types/customerPanelAdmin';



export const ErrorAlert = component$<ErrorAlertProps>(({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div class="bg-linear-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm animate-fadeIn">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <span class="text-red-600">⚠️</span>
          </div>
          <div>
            <h4 class="font-medium text-red-800 mb-1">خطا در دریافت اطلاعات</h4>
            <p class="text-red-700 text-sm">{error}</p>
            <p class="text-xs text-red-600 mt-2">
              لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید
            </p>
          </div>
        </div>
        
        <button
          onClick$={onDismiss}
          class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="بستن پیام خطا"
        >
          ✕
        </button>
      </div>
    </div>
  );
});