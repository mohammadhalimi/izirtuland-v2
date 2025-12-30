// src/components/admin/dashboard/HelpSection.tsx
import { component$ } from '@builder.io/qwik';
import { HelpSectionProps } from '~/components/types/createAdmin';



export const HelpSection = component$<HelpSectionProps>(({ currentAdminRole }) => {
  return (
    <div class="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
      <h3 class="font-bold text-blue-800 mb-3 flex items-center gap-2">
        <span>📘</span>
        <span>راهنمای مدیریت ادمین‌ها</span>
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* General Instructions */}
        <div class="space-y-2">
          <h4 class="font-medium text-blue-700 mb-1">دستورالعمل‌ها:</h4>
          <ul class="text-sm text-blue-600 space-y-1.5 pr-4">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span>نام کاربری باید منحصر به فرد باشد</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span>رمز عبور باید حداقل ۶ کاراکتر باشد</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span>فقط ادمین‌های موجود می‌توانند ادمین جدید ایجاد کنند</span>
            </li>
          </ul>
        </div>

        {/* Role Based Instructions */}
        <div class="space-y-2">
          <h4 class="font-medium text-blue-700 mb-1">سطح دسترسی شما:</h4>
          <ul class="text-sm text-blue-600 space-y-1.5 pr-4">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">🎯</span>
              <span>
                نقش: <strong>{currentAdminRole === 'superadmin' ? 'سوپر ادمین' : 'ادمین'}</strong>
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">🔐</span>
              <span>
                ایجاد ادمین: <strong>✅ مجاز</strong>
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">🗑️</span>
              <span>
                حذف ادمین: <strong>
                  {currentAdminRole === 'superadmin' ? '✅ مجاز' : '❌ غیرمجاز'}
                </strong>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Note for Admin Role */}
      {currentAdminRole === 'admin' && (
        <div class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-start gap-2">
            <span class="text-orange-600">⚠️</span>
            <p class="text-sm text-orange-700">
              شما دسترسی حذف ادمین‌ها را ندارید. فقط سوپر ادمین می‌تواند ادمین‌ها را حذف کند.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});