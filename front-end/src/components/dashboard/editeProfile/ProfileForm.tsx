// src/components/admin/dashboard/profile/ProfileForm.tsx
import { component$ } from '@builder.io/qwik';
import type { ProfileFormProps } from '~/components/types/editeProfile';

export const ProfileForm = component$<ProfileFormProps>((props) => {
  return (
    <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600">
            👤
          </div>
          <h3 class="text-xl font-bold text-gray-800">اطلاعات حساب</h3>
        </div>
        <p class="text-gray-600">می‌توانید نام کاربری و رمز عبور خود را تغییر دهید</p>
      </div>

      <div class="space-y-6">
        {/* Username Change Section */}
        <div class="border-b border-green-200 pb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-green-500">🔄</span>
            <span>تغییر نام کاربری</span>
          </h4>
          
          <div class="space-y-4">
            {/* Current Username */}
            <div class="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-700 mb-1">نام کاربری فعلی</p>
                  <p class="font-bold text-gray-800 text-lg">{props.currentUsername}</p>
                </div>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span>✅</span>
                  <span>فعال</span>
                </span>
              </div>
            </div>

            {/* New Username Input */}
            <div>
              <label for="newUsername" class="block text-sm font-medium text-gray-700 mb-2">
                نام کاربری جدید
              </label>
              <div class="relative">
                <input
                  id="newUsername"
                  type="text"
                  value={props.newUsername}
                  onInput$={(e) => props.onUsernameChange((e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-3 pr-12 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="نام کاربری جدید را وارد کنید"
                />
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  @
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                پس از تغییر نام کاربری، برای اعمال تغییرات باید دوباره وارد سیستم شوید.
              </p>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-green-500">🔒</span>
            <span>تغییر رمز عبور</span>
          </h4>
          
          <div class="space-y-4">
            {/* Current Password */}
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور فعلی
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  type="password"
                  value={props.currentPassword}
                  onInput$={(e) => props.onCurrentPasswordChange((e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-3 pr-12 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="رمز عبور فعلی را وارد کنید"
                />
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔐
                </div>
              </div>
            </div>

            {/* New Passwords */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور جدید
                </label>
                <div class="relative">
                  <input
                    id="newPassword"
                    type="password"
                    value={props.newPassword}
                    onInput$={(e) => props.onNewPasswordChange((e.target as HTMLInputElement).value)}
                    class="w-full px-4 py-3 pr-12 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                  />
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔑
                  </div>
                </div>
              </div>

              <div>
                <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  تکرار رمز عبور جدید
                </label>
                <div class="relative">
                  <input
                    id="confirmNewPassword"
                    type="password"
                    value={props.confirmPassword}
                    onInput$={(e) => props.onConfirmPasswordChange((e.target as HTMLInputElement).value)}
                    class="w-full px-4 py-3 pr-12 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="رمز عبور جدید را تکرار کنید"
                  />
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔁
                  </div>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {props.newPassword && (
              <div class="p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-700">قدرت رمز عبور:</span>
                  <span class={`text-xs font-medium ${
                    props.newPassword.length >= 8 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {props.newPassword.length >= 8 ? 'قوی' : 'ضعیف'}
                  </span>
                </div>
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class={`h-full ${
                      props.newPassword.length >= 8 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((props.newPassword.length / 12) * 100, 100)}%` }}
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  حداقل ۸ کاراکتر با ترکیب حروف و اعداد
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {props.message && (
          <div class={`p-4 rounded-xl border transition-all duration-200 animate-fadeIn ${
            props.messageType === 'success' 
              ? 'bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-sm' 
              : 'bg-linear-to-r from-red-50 to-orange-50 text-red-700 border-red-200 shadow-sm'
          }`}>
            <div class="flex items-start gap-3">
              <div class={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                props.messageType === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {props.messageType === 'success' ? '✅' : '❌'}
              </div>
              <div>
                <p class="font-medium">{props.message}</p>
                {props.messageType === 'success' && (
                  <p class="text-sm opacity-90 mt-1">تغییرات با موفقیت اعمال شدند</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick$={props.onSubmit}
          disabled={props.isLoading}
          class="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          {props.isLoading ? (
            <div class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>در حال اعمال تغییرات...</span>
            </div>
          ) : (
            <div class="flex items-center justify-center gap-2">
              <span class="text-lg">💾</span>
              <span class="font-semibold">اعمال تغییرات</span>
            </div>
          )}
        </button>
      </div>

      {/* Help Section */}
      <div class="mt-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <h4 class="font-medium text-green-800 mb-3 flex items-center gap-2">
          <span class="text-green-600">💡</span>
          <span>راهنمای تغییر اطلاعات</span>
        </h4>
        <ul class="text-sm text-green-700 space-y-2 pr-4">
          <li class="flex items-start gap-2">
            <span class="text-green-500 mt-0.5">•</span>
            <span>می‌توانید نام کاربری، رمز عبور یا هر دو را تغییر دهید</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-500 mt-0.5">•</span>
            <span>برای تغییر رمز عبور، حتماً رمز عبور فعلی را وارد کنید</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-500 mt-0.5">•</span>
            <span>رمز عبور جدید باید حداقل ۶ کاراکتر باشد</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-500 mt-0.5">•</span>
            <span>پس از تغییر نام کاربری، سیستم به طور خودکار رفرش می‌شود</span>
          </li>
        </ul>
      </div>
    </div>
  );
});