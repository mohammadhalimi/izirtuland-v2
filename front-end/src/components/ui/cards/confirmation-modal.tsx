// src/components/ui/confirmation-modal.tsx
import { component$ } from '@builder.io/qwik';
import { AlertIcon, LoaderIcon, XIcon } from '~/components/icons';

export const ConfirmationModal = component$<{
  isOpen: boolean;
  type: 'clear' | 'remove';
  itemName?: string;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}>((props) => {
  if (!props.isOpen) return null;

  const getModalContent = () => {
    if (props.type === 'clear') {
      return {
        title: 'خالی کردن سبد خرید',
        message: 'آیا از خالی کردن کامل سبد خرید مطمئن هستید؟ این عمل قابل بازگشت نیست.',
        confirmText: 'بله، سبد را خالی کن',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      };
    } else {
      return {
        title: 'حذف از سبد خرید',
        message: `آیا از حذف "${props.itemName}" از سبد خرید مطمئن هستید؟`,
        confirmText: 'بله، حذف کن',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      };
    }
  };

  const content = getModalContent();

  return (
    <div class="fixed inset-0 z-9999 overflow-y-auto animate-fade-in">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        {/* Background overlay */}
        <div 
          class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick$={props.onClose}
        ></div>

        {/* Modal panel */}
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative">
          {/* Modal header */}
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-100 rounded-xl">
                <AlertIcon />
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                {content.title}
              </h3>
            </div>
            <button
              onClick$={props.onClose}
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="بستن"
            >
              <XIcon />
            </button>
          </div>

          {/* Modal body */}
          <div class="mb-8">
            <p class="text-gray-600 leading-relaxed">
              {content.message}
            </p>
          </div>

          {/* Modal footer */}
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              onClick$={props.onConfirm}
              disabled={props.isProcessing}
              class={`flex-1 ${content.confirmColor} text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer`}
            >
              {props.isProcessing ? (
                <>
                  <LoaderIcon />
                  در حال پردازش...
                </>
              ) : (
                content.confirmText
              )}
            </button>
            <button
              onClick$={props.onClose}
              disabled={props.isProcessing}
              class="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});