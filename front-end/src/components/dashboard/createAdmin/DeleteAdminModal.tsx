// src/components/admin/dashboard/DeleteAdminModal.tsx
import { component$ } from '@builder.io/qwik';
import type { DeleteAdminModalProps } from '~/components/types/createAdmin';



export const DeleteAdminModal = component$<DeleteAdminModalProps>((props) => {
  if (!props.showModal || !props.adminToDelete) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform scale-100 animate-scaleIn">
        {/* Modal Header */}
        <div class="p-6 text-center border-b border-gray-200">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">⚠️ تایید حذف ادمین</h3>
          <p class="text-gray-600">
            آیا از حذف ادمین <strong class="text-red-600">"{props.adminToDelete.username}"</strong> مطمئن هستید؟
          </p>
        </div>

        {/* Modal Body */}
        <div class="p-6">
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div class="flex items-start gap-3">
              <div class="text-red-600 mt-0.5">💡</div>
              <div>
                <h4 class="font-medium text-red-800 mb-1">توجه مهم:</h4>
                <ul class="text-sm text-red-700 space-y-1 pr-3">
                  <li>• این عمل غیرقابل بازگشت است</li>
                  <li>• تمام دسترسی‌های این ادمین حذف می‌شود</li>
                  <li>• ادمین دیگر نمی‌تواند به پنل وارد شود</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Admin Details */}
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-linear-to-r from-red-400 to-orange-400 flex items-center justify-center text-white font-bold">
                {props.adminToDelete.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="font-medium text-gray-800">{props.adminToDelete.username}</div>
                <div class="text-sm text-gray-600">
                  نقش: <span class={`font-medium ${
                    props.adminToDelete.role === 'superadmin' ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {props.adminToDelete.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              onClick$={props.onClose}
              disabled={props.deletingAdminId === props.adminToDelete._id}
              class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 disabled:opacity-50 font-medium border border-gray-300"
            >
              ↩️ انصراف
            </button>
            
            <button
              onClick$={props.onConfirm}
              disabled={props.deletingAdminId === props.adminToDelete._id}
              class="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
            >
              {props.deletingAdminId === props.adminToDelete._id ? (
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال حذف...</span>
                </div>
              ) : (
                '🗑️ حذف ادمین'
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl text-center">
          <p class="text-xs text-gray-500">
            برای ادامه باید عمل حذف را تایید کنید
          </p>
        </div>
      </div>
    </div>
  );
});