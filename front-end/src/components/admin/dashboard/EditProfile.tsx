// src/components/admin/dashboard/EditProfile.tsx
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';

interface EditProfileProps {
  authToken: string;
  currentAdmin: {
    _id: string;
    username: string;
    role: 'superadmin' | 'admin';
    profileImage?: string;
  };
}

export default component$<EditProfileProps>(({ authToken, currentAdmin }) => {
  // state برای فرم
  const newUsername = useSignal('');
  const currentPassword = useSignal('');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  
  // state برای آپلود عکس
  const selectedFile = useSignal<File | null>(null);
  
  // تابع برای تبدیل آدرس نسبی به کامل
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };
  
  const previewUrl = useSignal(getFullImageUrl(currentAdmin.profileImage));
  const isUploading = useSignal(false);
  
  const isLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');
  const hasError = useSignal(false);

  // تابع برای آپدیت کوکی admin-data
  const updateAdminDataInCookie = $(async (newProfileImage: string) => {
    try {
      const currentAdminData = {
        _id: currentAdmin._id,
        username: currentAdmin.username,
        role: currentAdmin.role,
        profileImage: newProfileImage
      };

      document.cookie = `admin-data=${JSON.stringify(currentAdminData)}; path=/; max-age=86400; SameSite=Lax`;
    } catch (error) {
      console.error('خطا در آپدیت کوکی:', error);
    }
  });

  // تابع برای آپدیت localStorage
  const updateLocalStorage = $(async (newProfileImage: string) => {
    try {
      const currentAdminData = {
        _id: currentAdmin._id,
        username: currentAdmin.username,
        role: currentAdmin.role,
        profileImage: newProfileImage
      };
      
      localStorage.setItem('admin-data', JSON.stringify(currentAdminData));
    } catch (error) {
      console.error('خطا در آپدیت localStorage:', error);
    }
  });

  // چک کردن وجود _id هنگام لود کامپوننت
  useTask$(({ track }) => {
    track(() => currentAdmin._id);
    if (!currentAdmin._id) {
      hasError.value = true;
      message.value = 'خطا در دریافت اطلاعات کاربر. لطفاً دوباره وارد سیستم شوید.';
      messageType.value = 'error';
    }
  });

  // تابع برای انتخاب فایل
  const handleFileSelect = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        message.value = 'لطفاً فقط فایل تصویر انتخاب کنید';
        messageType.value = 'error';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        message.value = 'حجم فایل باید کمتر از ۵ مگابایت باشد';
        messageType.value = 'error';
        return;
      }
      
      selectedFile.value = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });

  // تابع آپلود عکس
  const handleUploadProfileImage = $(async () => {
    if (!selectedFile.value) {
      message.value = 'لطفاً یک تصویر انتخاب کنید';
      messageType.value = 'error';
      return;
    }

    if (!currentAdmin._id) {
      message.value = 'خطا در دریافت اطلاعات کاربر';
      messageType.value = 'error';
      return;
    }

    isUploading.value = true;
    message.value = '';

    try {
      const formData = new FormData();
      formData.append('profile', selectedFile.value);
      formData.append('adminId', currentAdmin._id);

      const response = await fetch(`${API_BASE_URL}/api/auth/${currentAdmin._id}/upload-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        message.value = 'عکس پروفایل با موفقیت آپلود شد 🌱';
        messageType.value = 'success';
        selectedFile.value = null;
        
        if (data.profileImage) {
          const fullImageUrl = getFullImageUrl(data.profileImage);
          previewUrl.value = fullImageUrl;
          
          await updateAdminDataInCookie(data.profileImage);
          await updateLocalStorage(data.profileImage);
          
          setTimeout(() => {
            message.value = '';
          }, 3000);
        }
      } else {
        message.value = data.message || 'خطا در آپلود عکس';
        messageType.value = 'error';
      }
    } catch (error: any) {
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isUploading.value = false;
    }
  });

  // تابع تغییر پروفایل
  const handleUpdateProfile = $(async () => {
    if (!currentAdmin._id) {
      message.value = 'خطا در دریافت اطلاعات کاربر. لطفاً دوباره وارد سیستم شوید.';
      messageType.value = 'error';
      return;
    }

    if (!newUsername.value.trim() && !newPassword.value) {
      message.value = 'لطفاً حداقل یکی از فیلدها را پر کنید';
      messageType.value = 'error';
      return;
    }

    if (newUsername.value.trim() && newUsername.value.trim() === currentAdmin.username) {
      message.value = 'نام کاربری جدید باید با نام کاربری فعلی متفاوت باشد';
      messageType.value = 'error';
      return;
    }

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
      const updateData: any = {};
      
      if (newUsername.value.trim()) {
        updateData.username = newUsername.value.trim();
      }
      
      if (newPassword.value) {
        updateData.currentPassword = currentPassword.value;
        updateData.newPassword = newPassword.value;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/update/${currentAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        message.value = 'تغییرات با موفقیت اعمال شد 🌟';
        messageType.value = 'success';
        
        newUsername.value = '';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        
        if (updateData.username) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setTimeout(() => {
            message.value = '';
          }, 3000);
        }
      } else {
        message.value = data.message || 'خطا در اعمال تغییرات';
        messageType.value = 'error';
      }
    } catch (error: any) {
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isLoading.value = false;
    }
  });

  if (hasError.value) {
    return (
      <div class="space-y-6">
        <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">خطا در سیستم</h2>
              <p class="opacity-90">مشکلی در دریافت اطلاعات کاربر رخ داده است</p>
            </div>
            <div class="text-4xl">🌱</div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center">
          <div class="text-red-500 text-6xl mb-4">❌</div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">خطا در بارگذاری اطلاعات</h3>
          <p class="text-gray-600 mb-6">
            اطلاعات کاربر به درستی بارگذاری نشد. لطفاً صفحه را رفرش کنید یا دوباره وارد سیستم شوید.
          </p>
          <button
            onClick$={() => window.location.reload()}
            class="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            رفرش صفحه
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {/* هدر اصلی */}
      <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">ویرایش پروفایل</h2>
            <p class="opacity-90">مدیریت اطلاعات حساب کاربری پنل کودهای کشاورزی</p>
          </div>
          <div class="text-right">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="relative">
                {previewUrl.value ? (
                  <img 
                    src={previewUrl.value} 
                    alt="Profile" 
                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    onError$={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div class={`w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${previewUrl.value ? 'hidden' : ''}`}>
                  {currentAdmin.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p class="text-lg font-medium">{currentAdmin.username}</p>
                <p class="text-sm opacity-80">
                  {currentAdmin.role === 'superadmin' ? 'سوپر ادمین 🌟' : 'ادمین 👨‍💼'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش آپلود عکس پروفایل */}
      <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
        <div class="mb-6">
          <div class="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              📷
            </div>
            <h3 class="text-xl font-bold text-gray-800">عکس پروفایل</h3>
          </div>
          <p class="text-gray-600">عکس پروفایل خود را آپلود کنید</p>
        </div>

        <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse">
          {/* پیش‌نمایش عکس */}
          <div class="shrink-0">
            <div class="relative">
              <div class="w-32 h-32 rounded-2xl border-4 border-green-200 overflow-hidden bg-green-50 flex items-center justify-center shadow-md">
                {previewUrl.value ? (
                  <img 
                    src={previewUrl.value} 
                    alt="Preview" 
                    class="w-full h-full object-cover"
                    onError$={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div class={`text-green-300 text-4xl ${previewUrl.value ? 'hidden' : ''}`}>
                  {currentAdmin.username.charAt(0).toUpperCase()}
                </div>
              </div>
              {selectedFile.value && (
                <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  جدید
                </div>
              )}
            </div>
          </div>

          {/* کنترل‌های آپلود */}
          <div class="flex-1 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                انتخاب عکس جدید
              </label>
              <input
                type="file"
                accept="image/*"
                onChange$={handleFileSelect}
                class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <p class="text-xs text-gray-500 mt-1">
                فرمت‌های مجاز: JPG, PNG, GIF • حداکثر حجم: ۵ مگابایت
              </p>
            </div>

            {selectedFile.value && (
              <div class="p-3 bg-green-50 rounded-xl border border-green-200">
                <p class="text-sm text-green-700">
                  فایل انتخاب شده: <strong>{selectedFile.value.name}</strong>
                </p>
                <p class="text-xs text-green-600 mt-1">
                  حجم: {(selectedFile.value.size / 1024 / 1024).toFixed(2)} مگابایت
                </p>
              </div>
            )}

            <button
              onClick$={handleUploadProfileImage}
              disabled={!selectedFile.value || isUploading.value}
              class="w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
            >
              {isUploading.value ? (
                <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال آپلود...</span>
                </div>
              ) : (
                <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <span>📤</span>
                  <span>آپلود عکس پروفایل</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {currentAdmin.profileImage && (
          <div class="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <p class="text-sm text-green-700 mb-1">
              عکس پروفایل فعلی: 
            </p>
            <p class="text-xs text-green-600 font-mono break-all">
              {getFullImageUrl(currentAdmin.profileImage)}
            </p>
          </div>
        )}
      </div>

      {/* فرم ویرایش پروفایل */}
      <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
        <div class="mb-6">
          <div class="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              👤
            </div>
            <h3 class="text-xl font-bold text-gray-800">اطلاعات حساب</h3>
          </div>
          <p class="text-gray-600">می‌توانید نام کاربری و رمز عبور خود را تغییر دهید</p>
        </div>

        <div class="space-y-6">
          {/* بخش تغییر نام کاربری */}
          <div class="border-b border-green-200 pb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔄</span>
              <span>تغییر نام کاربری</span>
            </h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <p class="text-sm text-green-700">نام کاربری فعلی</p>
                  <p class="font-medium text-gray-800">{currentAdmin.username}</p>
                </div>
                <span class="text-green-600 text-sm bg-green-100 px-2 py-1 rounded-full">✓ فعال</span>
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
                  class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔒</span>
              <span>تغییر رمز عبور</span>
            </h4>
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
                  class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                    class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                    class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="رمز عبور جدید را تکرار کنید"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* پیام */}
          {message.value && (
            <div class={`p-4 rounded-xl border transition-all duration-200 ${
              messageType.value === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' 
                : 'bg-red-50 text-red-700 border-red-200 shadow-sm'
            }`}>
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span class="text-lg">{messageType.value === 'success' ? '✅' : '❌'}</span>
                <span>{message.value}</span>
              </div>
            </div>
          )}

          {/* دکمه تغییر */}
          <button
            onClick$={handleUpdateProfile}
            disabled={isLoading.value}
            class="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          >
            {isLoading.value ? (
              <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال اعمال تغییرات...</span>
              </div>
            ) : (
              <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <span>💾</span>
                <span>اعمال تغییرات</span>
              </div>
            )}
          </button>
        </div>

        {/* راهنما */}
        <div class="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <h4 class="font-medium text-green-800 mb-2 flex items-center space-x-2 rtl:space-x-reverse">
            <span>💡</span>
            <span>راهنما</span>
          </h4>
          <ul class="text-sm text-green-700 space-y-2 list-disc pr-4">
            <li>می‌توانید نام کاربری، رمز عبور یا هر دو را تغییر دهید</li>
            <li>برای تغییر رمز عبور، حتماً رمز عبور فعلی را وارد کنید</li>
            <li>رمز عبور جدید باید حداقل ۶ کاراکتر باشد</li>
            <li>پس از تغییر نام کاربری، سیستم به طور خودکار رفرش می‌شود</li>
          </ul>
        </div>
      </div>

      {/* اطلاعات امنیتی */}
      <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
          <span>📊</span>
          <span>اطلاعات حساب</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
              👑
            </div>
            <h4 class="font-medium text-green-700 mb-2">نقش کاربری</h4>
            <p class="text-lg font-bold text-gray-800">
              {currentAdmin.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}
            </p>
          </div>
          <div class="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
              ✅
            </div>
            <h4 class="font-medium text-green-700 mb-2">وضعیت حساب</h4>
            <p class="text-lg font-bold text-green-600">فعال</p>
          </div>
          <div class="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
              🆔
            </div>
            <h4 class="font-medium text-green-700 mb-2">شناسه کاربر</h4>
            <p class="text-sm font-mono text-gray-600 truncate">{currentAdmin._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
});