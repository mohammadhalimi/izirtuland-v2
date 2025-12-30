// src/components/admin/dashboard/CreateAdminForm.tsx
import { component$, $ } from '@builder.io/qwik';
import { CreateAdminFormProps } from '~/components/types/createAdmin';

export const CreateAdminForm = component$<CreateAdminFormProps>((props) => {
  return (
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">➕ ایجاد ادمین جدید</h2>
        <p class="text-gray-600">در این بخش می‌توانید ادمین جدید به سیستم اضافه کنید</p>
      </div>

      <div class="space-y-4">
        {/* Username Field */}
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            📝 نام کاربری
          </label>
          <input
            id="username"
            type="text"
            value={props.username.value}
            onInput$={(e) => props.username.value = (e.target as HTMLInputElement).value}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            placeholder="نام کاربری ادمین جدید"
          />
        </div>

        {/* Password Field */}
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            🔐 رمز عبور
          </label>
          <input
            id="password"
            type="password"
            value={props.password.value}
            onInput$={(e) => props.password.value = (e.target as HTMLInputElement).value}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            placeholder="رمز عبور (حداقل ۶ کاراکتر)"
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            🔁 تکرار رمز عبور
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={props.confirmPassword.value}
            onInput$={(e) => props.confirmPassword.value = (e.target as HTMLInputElement).value}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            placeholder="تکرار رمز عبور"
          />
        </div>

        {/* Message Display */}
        {props.message.value && (
          <div class={`p-4 rounded-xl animate-fadeIn ${props.messageType.value === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            <div class="flex items-center gap-2">
              {props.messageType.value === 'success' ? '✅' : '⚠️'}
              <span>{props.message.value}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick$={props.onSubmit}
          disabled={props.isLoading.value}
          class="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
        >
          {props.isLoading.value ? (
            <div class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>در حال ایجاد...</span>
            </div>
          ) : (
            '🎯 ایجاد ادمین جدید'
          )}
        </button>
      </div>
    </div>
  );
});