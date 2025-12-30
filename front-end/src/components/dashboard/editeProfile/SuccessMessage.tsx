// src/components/admin/dashboard/profile/SuccessMessage.tsx
import { component$ } from '@builder.io/qwik';
import { SuccessMessageProps } from '~/components/types/editeProfile';



export const SuccessMessage = component$<SuccessMessageProps>(({ 
  message, 
  type, 
  onDismiss 
}) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div class={`animate-slideDown p-4 rounded-xl border shadow-sm mb-4 ${
      isSuccess 
        ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
        : 'bg-linear-to-r from-red-50 to-orange-50 border-red-200 text-red-800'
    }`}>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {isSuccess ? '✅' : '❌'}
          </div>
          <div>
            <p class="font-medium">{message}</p>
            {isSuccess && (
              <p class="text-sm opacity-90 mt-1">تغییرات با موفقیت ذخیره شدند</p>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick$={onDismiss}
            class={`p-1 rounded-lg transition-colors ${
              isSuccess ? 'hover:bg-green-100' : 'hover:bg-red-100'
            }`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
});