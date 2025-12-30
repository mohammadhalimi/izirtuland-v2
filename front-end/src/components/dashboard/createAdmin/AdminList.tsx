// src/components/admin/dashboard/AdminList.tsx
import { component$, $ } from '@builder.io/qwik';
import { getFullImageUrl, formatDate } from '~/components/function/function';
import type { AdminListProps,Admin } from '~/components/types/createAdmin';


export const AdminList = component$<AdminListProps>((props) => {
  if (props.loadingAdmins) {
    return (
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-3 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 font-medium">در حال دریافت لیست ادمین‌ها...</p>
          <p class="text-sm text-gray-500 mt-1">لطفاً کمی صبر کنید</p>
        </div>
      </div>
    );
  }

  if (props.admins.length === 0) {
    return (
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="text-5xl mb-4 text-gray-300">👥</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">هیچ ادمینی یافت نشد</h3>
        <p class="text-gray-500 mb-6">هنوز ادمینی در سیستم ثبت نشده است</p>
        <button
          onClick$={props.onRefresh}
          class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          🔄 بروزرسانی لیست
        </button>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div class="p-6 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-800 mb-1">👥 لیست ادمین‌ها</h2>
            <p class="text-gray-600">مدیران دسترسی به پنل مدیریت</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button
              onClick$={props.onRefresh}
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <span>🔄</span>
              <span>بروزرسانی</span>
            </button>
            
            <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {props.admins.length} نفر
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-right font-semibold text-gray-700 text-sm">👤 اطلاعات</th>
              <th class="px-6 py-4 text-right font-semibold text-gray-700 text-sm">🎭 نقش</th>
              <th class="px-6 py-4 text-right font-semibold text-gray-700 text-sm">📅 تاریخ عضویت</th>
              <th class="px-6 py-4 text-right font-semibold text-gray-700 text-sm">⚙️ عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {props.admins.map((admin) => (
              <tr 
                key={admin._id}
                class="hover:bg-gray-50/80 transition-colors duration-200"
              >
                {/* Admin Info */}
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    {/* Avatar */}
                    <div class="relative">
                      <div class="w-10 h-10 rounded-full overflow-hidden bg-linear-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <img
                          src={getFullImageUrl(admin.profileImage)}
                          alt={admin.username}
                          class="w-full h-full object-cover"
                          onError$={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Show fallback
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center text-white font-bold';
                              fallback.textContent = admin.username.charAt(0).toUpperCase();
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                      {admin._id === props.currentAdmin._id && (
                        <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span class="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <div class="font-medium text-gray-800 flex items-center gap-2">
                        {admin.username}
                        {admin._id === props.currentAdmin._id && (
                          <span class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            شما
                          </span>
                        )}
                      </div>
                      <div class="text-xs text-gray-500 mt-0.5">
                        ID: {admin._id?.slice(-6) || '---'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td class="px-6 py-4">
                  <span class={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    admin.role === 'superadmin'
                      ? 'bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200'
                      : 'bg-linear-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                  }`}>
                    {admin.role === 'superadmin' ? '👑 سوپر ادمین' : '👤 ادمین'}
                  </span>
                </td>

                {/* Date */}
                <td class="px-6 py-4">
                  <div class="text-gray-700">
                    {admin.createdAt ? formatDate(admin.createdAt) : 'نامشخص'}
                  </div>
                  {admin.lastLogin && (
                    <div class="text-xs text-gray-500 mt-1">
                      آخرین ورود: {formatDate(admin.lastLogin)}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td class="px-6 py-4">
                  {admin._id !== props.currentAdmin._id && props.currentAdmin.role === 'superadmin' ? (
                    <button
                      onClick$={() => props.onDeleteClick(admin)}
                      disabled={props.deletingAdminId === admin._id}
                      class="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm hover:shadow-md"
                    >
                      {props.deletingAdminId === admin._id ? (
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>حذف...</span>
                        </div>
                      ) : (
                        '🗑️ حذف'
                      )}
                    </button>
                  ) : admin._id === props.currentAdmin._id ? (
                    <span class="text-gray-400 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                      حساب فعلی
                    </span>
                  ) : (
                    <span class="text-gray-400 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                      🔒 قفل شده
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="text-sm text-gray-600">
            <span class="font-medium">{props.admins.length}</span> ادمین در سیستم
            {props.currentAdmin.role === 'superadmin' && (
              <span class="mr-3 text-green-600 font-medium"> • شما دسترسی کامل دارید</span>
            )}
          </div>
          
          <div class="text-xs text-gray-500">
            آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
          </div>
        </div>
      </div>
    </div>
  );
});