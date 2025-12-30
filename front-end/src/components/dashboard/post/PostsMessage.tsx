// src/components/admin/dashboard/posts/PostsMessage.tsx
import { component$, $ } from '@builder.io/qwik';
import { PostsMessageProps } from '~/components/types/post';



export const PostsMessage = component$<PostsMessageProps>(({
  message,
  messageType,
  errorMessage,
  onClose
}) => {
  const handleClose = $(() => {
    if (onClose) onClose();
  });

  return (
    <div class="space-y-4">
      {/* نمایش خطای اصلی */}
      {errorMessage && (
        <div class="p-4 bg-linear-to-r from-red-50 to-orange-50 text-red-800 rounded-2xl border border-red-200 shadow-sm">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 ml-3">
              ❌
            </div>
            <p class="flex-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* پیام‌های موقت */}
      {message && (
        <div class={`p-4 rounded-2xl border-l-4 transition-all duration-300 animate-fadeIn ${messageType === 'success'
          ? 'bg-linear-to-r from-green-50 to-emerald-50 text-green-800 border-green-500 shadow-md'
          : 'bg-linear-to-r from-red-50 to-orange-50 text-red-800 border-red-500 shadow-md'
          }`}>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class={`w-8 h-8 rounded-full flex items-center justify-center ${messageType === 'success'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
                }`}>
                {messageType === 'success' ? '✅' : '❌'}
              </div>
              <div>
                <p class="font-medium">
                  {messageType === 'success' ? 'عملیات موفق' : 'خطا'}
                </p>
                <p class="text-sm">{message}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick$={handleClose}
                class="p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});