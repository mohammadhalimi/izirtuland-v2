// src/components/admin/dashboard/product-manager/ErrorAlert.tsx
import { component$ } from '@builder.io/qwik';
import { ErrorAlertProps } from '~/components/types/product';



export const ErrorAlert = component$<ErrorAlertProps>(({ message, onClose }) => {
  const isSuccess = message.includes('✅');
  
  if (!message) return null;

  return (
    <div class={`p-4 rounded-lg mb-6 ${
      isSuccess
        ? 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          {isSuccess ? (
            <span class="text-green-600">✅</span>
          ) : (
            <span class="text-red-600">❌</span>
          )}
          <span>{message}</span>
        </div>
        <button
          onClick$={onClose}
          class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
});