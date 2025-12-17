// src/components/user/UserProfileHeader.tsx
import { component$, QRL } from '@builder.io/qwik';
import type { User } from '../types/user';

interface UserProfileHeaderProps {
  user: User;
  onLogout: QRL<() => Promise<void>>;
}

export default component$<UserProfileHeaderProps>(({ user, onLogout }) => {
  return (
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span class="text-2xl text-white">👤</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">پنل کاربری</h1>
              <p class="text-gray-600 pt-2">خوش آمدید، {user.name || 'کاربر'}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              onClick$={onLogout}
              class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer "
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="text-sm">خروج</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});