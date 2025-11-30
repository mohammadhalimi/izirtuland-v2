// src/components/admin/dashboard/CreateAdmin.tsx
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { API_BASE_URL } from '~/config/api';

interface CreateAdminProps {
  authToken: string;
  currentAdmin: {
    _id: string;
    username: string;
    role: 'superadmin' | 'admin';
  };
}

interface Admin {
  _id: string;
  username: string;
  role: 'superadmin' | 'admin';
  createdAt?: string;
  profileImage: string;
}

export default component$<CreateAdminProps>(({ authToken, currentAdmin }) => {
  const username = useSignal('');
  const password = useSignal('');
  const confirmPassword = useSignal('');
  const isLoading = useSignal(false);
  const message = useSignal('');
  const messageType = useSignal<'success' | 'error'>('success');

  // state برای لیست ادمین‌ها
  const admins = useSignal<Admin[]>([]);
  const loadingAdmins = useSignal(true);
  const deletingAdminId = useSignal<string | null>(null);

  // state برای modal حذف
  const showDeleteModal = useSignal(false);
  const adminToDelete = useSignal<Admin | null>(null);

  // تابع برای دریافت لیست ادمین‌ها
  const fetchAdmins = $(async () => {
    try {
      loadingAdmins.value = true;
      const response = await fetch(`${API_BASE_URL}/api/auth/getAlladmin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        admins.value = data.admins || data || [];
      } else {
        console.error('Error fetching admins:', response.status);
        admins.value = [];
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      admins.value = [];
    } finally {
      loadingAdmins.value = false;
    }
  });

  // دریافت خودکار لیست ادمین‌ها هنگام لود کامپوننت
  useTask$(({ track }) => {
    track(() => authToken);
    if (authToken) {
      fetchAdmins();
    }
  });

  const handleSubmit = $(async () => {
    // اعتبارسنجی
    if (!username.value || !password.value || !confirmPassword.value) {
      message.value = 'لطفاً تمام فیلدها را پر کنید';
      messageType.value = 'error';
      return;
    }

    if (password.value !== confirmPassword.value) {
      message.value = 'رمز عبور و تکرار آن مطابقت ندارند';
      messageType.value = 'error';
      return;
    }

    if (password.value.length < 6) {
      message.value = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
      messageType.value = 'error';
      return;
    }

    isLoading.value = true;
    message.value = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.value = 'ادمین جدید با موفقیت ایجاد شد';
        messageType.value = 'success';

        // پاک کردن فرم
        username.value = '';
        password.value = '';
        confirmPassword.value = '';

        // رفرش لیست ادمین‌ها
        await fetchAdmins();
      } else {
        message.value = data.message || 'خطا در ایجاد ادمین';
        messageType.value = 'error';
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      isLoading.value = false;
    }
  });

  const openDeleteModal = $((admin: Admin) => {
    // اگر ادمین معمولی است، پیام نشان بده
    if (currentAdmin.role === 'admin') {
      message.value = 'شما دسترسی لازم برای حذف ادمین را ندارید. فقط سوپر ادمین می‌تواند ادمین‌ها را حذف کند.';
      messageType.value = 'error';
      return;
    }

    // اگر سوپر ادمین می‌خواهد خودش را حذف کند
    if (admin._id === currentAdmin._id) {
      message.value = 'شما نمی‌توانید حساب کاربری خودتان را حذف کنید.';
      messageType.value = 'error';
      return;
    }

    adminToDelete.value = admin;
    showDeleteModal.value = true;
  });

  const closeDeleteModal = $(() => {
    showDeleteModal.value = false;
    adminToDelete.value = null;
  });

  const confirmDeleteAdmin = $(async () => {
    if (!adminToDelete.value) return;

    const adminId = adminToDelete.value._id;
    deletingAdminId.value = adminId;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/deleteAdmin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.value = `ادمین "${adminToDelete.value.username}" با موفقیت حذف شد`;
        messageType.value = 'success';

        // رفرش لیست ادمین‌ها
        await fetchAdmins();
      } else {
        message.value = data.message || 'خطا در حذف ادمین';
        messageType.value = 'error';
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      message.value = 'خطا در ارتباط با سرور';
      messageType.value = 'error';
    } finally {
      deletingAdminId.value = null;
      closeDeleteModal();
    }
  });

  const formatDate = $((dateString: string) => {
    if (!dateString) return 'نامشخص';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'نامشخص';
    }
  });
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // اگر مسیر نسبی است، آدرس کامل بسازید
    return `${API_BASE_URL}${imagePath}`;
  };
  return (
    <div class="space-y-6">
      {/* اطلاعات ادمین فعلی */}
      <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">مدیریت ادمین‌ها</h2>
            <p class="opacity-90">شما با نقش <strong>{currentAdmin.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}</strong> وارد شده‌اید</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-medium">{currentAdmin.username}</p>
            <p class="text-sm opacity-80">
              {currentAdmin.role === 'superadmin' ? 'دسترسی کامل' : 'دسترسی محدود'}
            </p>
          </div>
        </div>
      </div>

      {/* فرم ایجاد ادمین جدید */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">ایجاد ادمین جدید</h2>
          <p class="text-gray-600">در این بخش می‌توانید ادمین جدید به سیستم اضافه کنید</p>
        </div>

        {/* فرم ایجاد ادمین */}
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              value={username.value}
              onInput$={(e) => username.value = (e.target as HTMLInputElement).value}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="نام کاربری ادمین جدید"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password.value}
              onInput$={(e) => password.value = (e.target as HTMLInputElement).value}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="رمز عبور (حداقل ۶ کاراکتر)"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              تکرار رمز عبور
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword.value}
              onInput$={(e) => confirmPassword.value = (e.target as HTMLInputElement).value}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="تکرار رمز عبور"
            />
          </div>

          {/* پیام */}
          {message.value && (
            <div class={`p-4 rounded-xl ${messageType.value === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message.value}
            </div>
          )}

          <button
            onClick$={handleSubmit}
            disabled={isLoading.value}
            class="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading.value ? (
              <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال ایجاد...</span>
              </div>
            ) : (
              'ایجاد ادمین جدید'
            )}
          </button>
        </div>

        {/* راهنما */}
        <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 class="font-medium text-blue-800 mb-2">راهنما:</h3>
          <ul class="text-sm text-blue-700 space-y-1 list-disc pr-4">
            <li>نام کاربری باید منحصر به فرد باشد</li>
            <li>رمز عبور باید حداقل ۶ کاراکتر باشد</li>
            <li>فقط ادمین‌های موجود می‌توانند ادمین جدید ایجاد کنند</li>
            {currentAdmin.role === 'admin' && (
              <li class="text-orange-600 font-medium">شما دسترسی حذف ادمین‌ها را ندارید</li>
            )}
          </ul>
        </div>
      </div>

      {/* لیست ادمین‌ها */}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">لیست ادمین‌ها</h2>
            <p class="text-gray-600">مدیران دسترسی به پنل مدیریت</p>
          </div>
          <button
            onClick$={fetchAdmins}
            disabled={loadingAdmins.value}
            class="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            <span>🔄</span>
            <span>بروزرسانی</span>
          </button>
        </div>

        {loadingAdmins.value ? (
          <div class="flex justify-center items-center py-8">
            <div class="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="mr-3 text-gray-600">در حال دریافت لیست ادمین‌ها...</span>
          </div>
        ) : admins.value.length === 0 ? (
          <div class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-4">👨‍💼</div>
            <p>هیچ ادمینی یافت نشد</p>
          </div>
        ) : (
          <div class="overflow-hidden rounded-xl border border-gray-200">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-right font-medium text-gray-700">نام کاربری</th>
                  <th class="px-6 py-4 text-right font-medium text-gray-700">نقش</th>
                  <th class="px-6 py-4 text-right font-medium text-gray-700">تاریخ ایجاد</th>
                  <th class="px-6 py-4 text-right font-medium text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {admins.value.map((admin, index) => (
                  <tr key={admin._id} class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3 rtl:space-x-reverse">
                        <div class="w-8 h-8 bg-linear-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          <img
                            src={getFullImageUrl(admin.profileImage)}
                            alt="Profile"
                            class="w-full h-full object-cover rounded-full"
                            onError$={(event) => {
                              const target = event.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <span class="font-medium text-gray-800 block">{admin.username}</span>
                          {admin._id === currentAdmin._id && (
                            <span class="text-xs text-green-600">(شما)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${admin.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {admin.role === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600">
                      {admin.createdAt ? formatDate(admin.createdAt) : 'نامشخص'}
                    </td>
                    <td class="px-6 py-4">
                      {admin._id !== currentAdmin._id && currentAdmin.role === 'superadmin' ? (
                        <button
                          onClick$={() => openDeleteModal(admin)}
                          disabled={deletingAdminId.value === admin._id}
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 text-sm font-medium"
                        >
                          {deletingAdminId.value === admin._id ? (
                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                              <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>در حال حذف...</span>
                            </div>
                          ) : (
                            'حذف'
                          )}
                        </button>
                      ) : admin._id === currentAdmin._id ? (
                        <span class="text-gray-400 text-sm">حساب فعلی</span>
                      ) : (
                        <span class="text-gray-400 text-sm">دسترسی محدود</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div class="mt-4 text-sm text-gray-500">
          تعداد کل ادمین‌ها: {admins.value.length}
          {currentAdmin.role === 'superadmin' && (
            <span class="mr-4"> • شما سوپر ادمین هستید</span>
          )}
        </div>
      </div>

      {/* Modal تایید حذف */}
      {showDeleteModal.value && adminToDelete.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl p-6 w-full max-w-md">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">تایید حذف ادمین</h3>
              <p class="text-gray-600">
                آیا از حذف ادمین <strong class="text-red-600">"{adminToDelete.value.username}"</strong> مطمئن هستید؟
              </p>
              <p class="text-sm text-gray-500 mt-2">این عمل غیرقابل بازگشت است.</p>
            </div>

            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button
                onClick$={closeDeleteModal}
                disabled={deletingAdminId.value === adminToDelete.value._id}
                class="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-300 disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                onClick$={confirmDeleteAdmin}
                disabled={deletingAdminId.value === adminToDelete.value._id}
                class="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors duration-200 disabled:opacity-50 font-medium"
              >
                {deletingAdminId.value === adminToDelete.value._id ? (
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال حذف...</span>
                  </div>
                ) : (
                  'حذف ادمین'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});