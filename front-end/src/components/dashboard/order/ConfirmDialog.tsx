// src/components/shared/ConfirmDialog.tsx
import { $, component$, useSignal } from '@builder.io/qwik';
import { ConfirmDialogProps } from '~/components/types/order';



export const ConfirmDialog = component$<ConfirmDialogProps>(({
  title,
  message,
  confirmText = 'تایید',
  cancelText = 'لغو',
  isVisible,
  onConfirm,
  onCancel
}) => {
  const isClosing = useSignal(false);

  const handleClose = $(async () => {
    isClosing.value = true;
    await new Promise(resolve => setTimeout(resolve, 200));
    onCancel();
  });

  if (!isVisible) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        class={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isClosing.value ? 'opacity-0' : 'opacity-50'
        }`}
        onClick$={handleClose}
      />
      
      {/* Dialog */}
      <div class={`
        relative bg-white rounded-2xl max-w-md w-full mx-auto transform transition-all duration-200
        ${isClosing.value ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
      `}>
        <div class="p-6">
          {/* Icon */}
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <span class="text-2xl text-blue-600">⚠️</span>
            </div>
          </div>

          {/* Content */}
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p class="text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              onClick$={handleClose}
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick$={async () => {
                isClosing.value = true;
                await new Promise(resolve => setTimeout(resolve, 200));
                onConfirm();
              }}
              class="flex-1 px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});