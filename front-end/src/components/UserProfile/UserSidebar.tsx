// src/components/user/UserSidebar.tsx
import { component$ } from '@builder.io/qwik';
import type { User } from '../types/user';

interface UserSidebarProps {
  user: User;
  showEditModal: { value: boolean };
}


export default component$<UserSidebarProps>(({ user, showEditModal }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <div class="text-center mb-6">
        <div class="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-3xl text-white">👤</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-1">
          {user.name || 'کاربر'}
        </h2>
        <p class="text-gray-500 text-sm dir-ltr">{user.phone}</p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <span class="text-gray-600 flex items-center">
            <span class="ml-2">📱</span>
            شماره موبایل
          </span>
          <span class="font-medium dir-ltr">{user.phone}</span>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <span class="text-gray-600 flex items-center">
            <span class="ml-2">👤</span>
            نام
          </span>
          <span class="font-medium">{user.name || 'تعیین نشده'}</span>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-100">
          <span class="text-gray-600 flex items-center">
            <span class="ml-2">🏠</span>
            آدرس
          </span>
          <span class="font-medium text-right max-w-xs text-sm">
            {user.address || 'ثبت نشده'}
          </span>
        </div>

        <div class="flex items-center justify-between py-3">
          <span class="text-gray-600 flex items-center">
            <span class="ml-2">📅</span>
            تاریخ عضویت
          </span>
          <span class="font-medium text-sm">{formatDate(user.createdAt)}</span>
        </div>
      </div>
      <button
        onClick$={() => (showEditModal.value = true)}
        class="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm flex items-center justify-center cursor-pointer"
      >
        ✏️ ویرایش پروفایل
      </button>
    </div>
  );
});