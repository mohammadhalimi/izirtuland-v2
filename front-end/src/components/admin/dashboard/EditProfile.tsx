// src/components/admin/dashboard/EditProfile.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';

interface EditProfileProps {
  authToken: string;
  currentAdmin: {
    _id: string;
    username: string;
    role: 'superadmin' | 'admin';
  };
}

export default component$<EditProfileProps>(({ authToken, currentAdmin }) => {
  console.log(currentAdmin)
  // state برای فرم
  const newUsername = useSignal('');
  const currentPassword = useSignal('');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  
  const isLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');

  // تابع تغییر پروفایل
  const handleUpdateProfile = $(async () => {
    // اعتبارسنجی
    if (!newUsername.value.trim() && !newPassword.value) {
      message.value = 'لطفاً حداقل یکی از فیلدها را پر کنید';
      messageType.value = 'error';
      return;
    }

    // اعتبارسنجی نام کاربری
    if (newUsername.value.trim() && newUsername.value.trim() === currentAdmin.username) {
      message.value = 'نام کاربری جدید باید با نام کاربری فعلی متفاوت باشد';
      messageType.value = 'error';
      return;
    }

    // اعتبارسنجی رمز عبور
    if (newPassword.value) {
      if (!currentPassword.value) {
        message.value = 'برای تغییر رمز عبور، رمز عبور فعلی را وارد کنید';
        messageType.value = 'error';
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        message.value = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
        messageType.value = 'error';
        return;
      }

      if (newPassword.value.length < 6) {
        message.value = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
        messageType.value = 'error';
        return;
      }
    }

    isLoading.value = true;
    message.value = '';

    try {
      // ساخت آبجکت داده برای ارسال
      const updateData: any = {};
      
      if (newUsername.value.trim()) {
        updateData.username = newUsername.value.trim();
      }
      
      if (newPassword.value) {
        updateData.currentPassword = currentPassword.value;
        updateData.newPassword = newPassword.value;
      }

      const response = await fetch(`http://localhost:5000/api/auth/update/${currentAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        message.value = 'تغییرات با موفقیت اعمال شد';
        messageType.value = 'success';
        
        // پاک کردن فرم
        newUsername.value = '';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        
        // اگر نام کاربری تغییر کرد، رفرش صفحه
        if (updateData.username) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        message.value = data.message || 'خطا در اعمال تغییرات';
        messageType.value = 'error';
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="space-y-6">
      {/* اطلاعات ادمین فعلی */}
      <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">ویرایش پروفایل</h2>
            <p class="opacity-90">مدیریت اطلاعات حساب کاربری</p>
          </div>
          <div class="text-right">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {currentAdmin.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="text-lg font-medium">{currentAdmin.username}</p>
                <p class="text-sm opacity-80">
                  {currentAdmin.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* فرم ویرایش پروفایل */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">اطلاعات حساب</h3>
          <p class="text-gray-600">می‌توانید نام کاربری و رمز عبور خود را تغییر دهید</p>
        </div>

        <div class="space-y-6">
          {/* بخش تغییر نام کاربری */}
          <div class="border-b border-gray-200 pb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">تغییر نام کاربری</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p class="text-sm text-gray-600">نام کاربری فعلی</p>
                  <p class="font-medium text-gray-800">{currentAdmin.username}</p>
                </div>
                <span class="text-green-600 text-sm">✓ فعال</span>
              </div>
              
              <div>
                <label for="newUsername" class="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری جدید
                </label>
                <input
                  id="newUsername"
                  type="text"
                  value={newUsername.value}
                  onInput$={(e) => newUsername.value = (e.target as HTMLInputElement).value}
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="نام کاربری جدید را وارد کنید"
                />
                <p class="text-xs text-gray-500 mt-1">
                  پس از تغییر نام کاربری، برای اعمال تغییرات باید دوباره وارد سیستم شوید.
                </p>
              </div>
            </div>
          </div>

          {/* بخش تغییر رمز عبور */}
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-4">تغییر رمز عبور</h4>
            <div class="space-y-4">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور فعلی
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword.value}
                  onInput$={(e) => currentPassword.value = (e.target as HTMLInputElement).value}
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="رمز عبور فعلی را وارد کنید"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور جدید
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword.value}
                    onInput$={(e) => newPassword.value = (e.target as HTMLInputElement).value}
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
                  />
                </div>

                <div>
                  <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmPassword.value}
                    onInput$={(e) => confirmPassword.value = (e.target as HTMLInputElement).value}
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="رمز عبور جدید را تکرار کنید"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* پیام */}
          {message.value && (
            <div class={`p-4 rounded-xl ${
              messageType.value === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.value}
            </div>
          )}

          {/* دکمه تغییر */}
          <button
            onClick$={handleUpdateProfile}
            disabled={isLoading.value}
            class="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading.value ? (
              <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال اعمال تغییرات...</span>
              </div>
            ) : (
              'اعمال تغییرات'
            )}
          </button>
        </div>

        {/* راهنما */}
        <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 class="font-medium text-blue-800 mb-2">💡 راهنما</h4>
          <ul class="text-sm text-blue-700 space-y-1 list-disc pr-4">
            <li>می‌توانید نام کاربری، رمز عبور یا هر دو را تغییر دهید</li>
            <li>برای تغییر رمز عبور، حتماً رمز عبور فعلی را وارد کنید</li>
            <li>رمز عبور جدید باید حداقل ۶ کاراکتر باشد</li>
            <li>پس از تغییر نام کاربری، سیستم به طور خودکار رفرش می‌شود</li>
          </ul>
        </div>
      </div>

      {/* اطلاعات امنیتی */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">اطلاعات حساب</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-medium text-gray-700 mb-2">نقش کاربری</h4>
            <p class="text-lg font-bold text-gray-800">
              {currentAdmin.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-medium text-gray-700 mb-2">وضعیت حساب</h4>
            <p class="text-lg font-bold text-green-600">فعال</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-medium text-gray-700 mb-2">آخرین تغییر</h4>
            <p class="text-sm text-gray-600">هم اکنون</p>
          </div>
        </div>
      </div>
    </div>
  );
});