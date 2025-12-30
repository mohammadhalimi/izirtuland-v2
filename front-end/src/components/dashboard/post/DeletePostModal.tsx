// src/components/admin/dashboard/posts/DeletePostModal.tsx
import { component$, $ } from '@builder.io/qwik';
import { DeletePostModalProps } from '~/components/types/post';

export const DeletePostModal = component$<DeletePostModalProps>(({
  showModal,
  selectedPost,
  isActionLoading,
  onClose,
  onConfirm
}) => {
  if (!showModal || !selectedPost) return null;

  const handleConfirm = $(() => {
    if (selectedPost._id) {
      onConfirm(selectedPost._id);
    }
  });

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn">
        {/* هدر */}
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-linear-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center text-red-600">
              🗑️
            </div>
            <h3 class="text-lg font-bold text-gray-800">تایید حذف پست</h3>
          </div>
          <button
            onClick$={onClose}
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* متن تأیید */}
        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            آیا مطمئن هستید که می‌خواهید پست زیر را حذف کنید؟
          </p>
          
          <div class="bg-linear-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <h4 class="font-bold text-gray-800 mb-2 line-clamp-2">
              {selectedPost.title}
            </h4>
            {selectedPost.createdAt && (
              <p class="text-xs text-gray-500">
                ایجاد شده در: {new Date(selectedPost.createdAt).toLocaleDateString('fa-IR')}
              </p>
            )}
          </div>

          <div class="mt-4 p-3 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div class="flex items-start gap-2">
              <span class="text-yellow-600 mt-0.5">⚠️</span>
              <p class="text-sm text-yellow-700">
                این عمل غیرقابل بازگشت است. پست به طور کامل حذف خواهد شد.
              </p>
            </div>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div class="flex justify-end space-x-3 rtl:space-x-reverse">
          <button
            onClick$={onClose}
            disabled={isActionLoading}
            class="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium border border-gray-300 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick$={handleConfirm}
            disabled={isActionLoading}
            class="px-6 py-2 bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActionLoading ? (
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال حذف...</span>
              </div>
            ) : (
              'حذف پست'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});