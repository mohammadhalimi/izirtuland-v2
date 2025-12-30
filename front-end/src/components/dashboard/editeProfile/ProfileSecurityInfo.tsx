// src/components/admin/dashboard/profile/ProfileSecurityInfo.tsx
import { component$ } from '@builder.io/qwik';
import { ProfileSecurityInfoProps } from '~/components/types/editeProfile';


export const ProfileSecurityInfo = component$<ProfileSecurityInfoProps>(({
  userId,
  role
}) => {
  const getRoleDetails = (role: string) => {
    if (role === 'superadmin') {
      return {
        label: 'سوپر ادمین',
        description: 'دسترسی کامل به تمام بخش‌های سیستم',
        color: 'from-purple-500 to-purple-600',
        badgeColor: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
        icon: '👑'
      };
    } else {
      return {
        label: 'ادمین',
        description: 'دسترسی محدود به بخش‌های مدیریتی',
        color: 'from-blue-500 to-blue-600',
        badgeColor: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
        icon: '⭐'
      };
    }
  };

  const roleDetails = getRoleDetails(role);

  return (
    <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span class="text-green-500">📊</span>
        <span>اطلاعات حساب و امنیت</span>
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Role Card */}
        <div class="group">
          <div class={`h-full p-4 rounded-xl border bg-linear-to-br from-white to-gray-50 border-gray-200 group-hover:border-green-300 transition-all duration-200 text-center`}>
            <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3 bg-linear-to-r ${roleDetails.color}`}>
              <span class="text-xl">{roleDetails.icon}</span>
            </div>
            <h4 class="font-medium text-gray-700 mb-2">نقش کاربری</h4>
            <p class="text-lg font-bold text-gray-800 mb-2">{roleDetails.label}</p>
            <p class="text-xs text-gray-600 mb-3">{roleDetails.description}</p>
            <span class={`text-xs px-3 py-1 rounded-full ${roleDetails.badgeColor}`}>
              سطح دسترسی
            </span>
          </div>
        </div>

        {/* Account Status */}
        <div class="group">
          <div class="h-full p-4 rounded-xl border bg-linear-to-br from-white to-gray-50 border-gray-200 group-hover:border-green-300 transition-all duration-200 text-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3 bg-linear-to-r from-green-500 to-emerald-600">
              <span class="text-xl">✅</span>
            </div>
            <h4 class="font-medium text-gray-700 mb-2">وضعیت حساب</h4>
            <p class="text-lg font-bold text-green-600 mb-2">فعال و تأیید شده</p>
            <p class="text-xs text-gray-600 mb-3">حساب در وضعیت عالی قرار دارد</p>
            <div class="flex items-center justify-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-green-600">آنلاین</span>
            </div>
          </div>
        </div>

        {/* User ID */}
        <div class="group">
          <div class="h-full p-4 rounded-xl border bg-linear-to-br from-white to-gray-50 border-gray-200 group-hover:border-green-300 transition-all duration-200 text-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-3 bg-linear-to-r from-gray-500 to-gray-600">
              <span class="text-xl">🆔</span>
            </div>
            <h4 class="font-medium text-gray-700 mb-2">شناسه کاربر</h4>
            <div class="mb-3">
              <div class="font-mono text-xs text-gray-600 bg-gray-100 p-2 rounded-lg break-all">
                {userId.slice(0, 8)}...{userId.slice(-8)}
              </div>
            </div>
            <button
              onClick$={() => {
                navigator.clipboard.writeText(userId);
                alert('شناسه کاربر کپی شد!');
              }}
              class="text-xs text-gray-600 hover:text-green-600 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <span>📋</span>
              <span>کپی شناسه</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-linear-to-r from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center text-yellow-600 shrink-0">
            ⚠️
          </div>
          <div>
            <h4 class="font-medium text-gray-800 mb-2">نکات امنیتی</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li class="flex items-start gap-2">
                <span class="text-gray-400 mt-0.5">•</span>
                <span>رمز عبور قوی و منحصر به فرد انتخاب کنید</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-400 mt-0.5">•</span>
                <span>هرگز اطلاعات حساب خود را با دیگران به اشتراک نگذارید</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-400 mt-0.5">•</span>
                <span>پس از اتمام کار از حساب خارج شوید</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});