// src/components/admin/dashboard/AdminHeader.tsx
import { component$ } from '@builder.io/qwik';
import type { AdminHeaderProps } from '~/components/types/createAdmin';


export const AdminHeader = component$<AdminHeaderProps>(({ currentAdmin }) => {
  return (
    <div class="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold mb-2">👨‍💼 مدیریت ادمین‌ها</h2>
          <p class="opacity-90">
            شما با نقش <strong class="bg-white/20 px-2 py-1 rounded-full">
              {currentAdmin.role === 'superadmin' ? 'سوپر ادمین 👑' : 'ادمین 👤'}
            </strong> وارد شده‌اید
          </p>
        </div>
        
        <div class="text-center md:text-right">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p class="text-lg font-medium mb-1">{currentAdmin.username}</p>
            <p class="text-sm opacity-80">
              {currentAdmin.role === 'superadmin' ? '🔓 دسترسی کامل' : '🔒 دسترسی محدود'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div class="mt-4 flex gap-4">
        <div class="bg-white/10 px-3 py-1 rounded-full text-sm">
          <span class="opacity-80">وضعیت:</span>
          <span class="mr-1 font-bold">فعال ✅</span>
        </div>
        <div class="bg-white/10 px-3 py-1 rounded-full text-sm">
          <span class="opacity-80">دسترسی:</span>
          <span class="mr-1 font-bold">
            {currentAdmin.role === 'superadmin' ? 'کامل' : 'محدود'}
          </span>
        </div>
      </div>
    </div>
  );
});