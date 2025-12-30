// src/components/admin/dashboard/product-manager/DeleteModal.tsx
import { component$ } from '@builder.io/qwik';
import type { DeleteModalProps } from '~/components/types/product';



export const DeleteModal = component$<DeleteModalProps>(({ 
  show, 
  product, 
  loading, 
  onClose, 
  onConfirm 
}) => {
  if (!show) return null;

  return (
    <div class="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick$={onClose}
      />
      {/* Modal */}
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl max-w-md w-full mx-auto transform transition-all">
          <div class="p-6">
            {/* آیکون */}
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* متن */}
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">حذف محصول</h3>
              <p class="text-gray-600 mb-2">
                آیا مطمئن هستید که می‌خواهید
                <span class="font-semibold text-gray-900"> "{product?.name}" </span>
                را حذف کنید؟
              </p>
              <p class="text-sm text-red-500">این عمل غیرقابل بازگشت خواهد بود</p>
            </div>

            {/* دکمه‌ها */}
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                onClick$={onClose}
                disabled={loading}
                class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50"
              >
                لغو
              </button>
              <button
                onClick$={onConfirm}
                disabled={loading}
                class="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                {loading ? (
                  <>
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال حذف...</span>
                  </>
                ) : (
                  <>
                    <span>حذف محصول</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});