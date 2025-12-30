// src/components/admin/dashboard/customer/CustomerRow.tsx
import { component$ } from '@builder.io/qwik';
import type { Customer } from '~/components/types/customer';
import { formatDate, getInitials } from '~/components/function/function';

interface CustomerRowProps {
  customer: Customer;
}

export const CustomerRow = component$<CustomerRowProps>(({ customer }) => {
  const getUserInfo = () => {
    return {
      hasName: customer.name && customer.name.trim().length > 0,
      hasAddress: customer.address && customer.address.trim().length > 0,
      isRecent: new Date(customer.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  };

  const info = getUserInfo();

  return (
    <tr class="hover:bg-linear-to-r hover:from-green-50/50 hover:to-emerald-50/30 transition-all duration-200 group">
      {/* Customer Info */}
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-linear-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              {info.hasName ? (
                <span class="text-white font-bold text-sm">
                  {getInitials(customer.name)}
                </span>
              ) : (
                <span class="text-white text-lg">📱</span>
              )}
            </div>
            {info.isRecent && (
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div>
            <div class="text-sm font-medium text-gray-900">
              {customer.name || 'بدون نام'}
            </div>
            {!info.hasName && (
              <div class="text-xs text-gray-500">نام ثبت نشده</div>
            )}
            <div class="text-xs text-gray-400 font-mono mt-0.5">
              ID: {customer._id.slice(-8)}
            </div>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td class="px-6 py-4">
        <div class="space-y-2">
          <div class="text-sm text-gray-900 dir-ltr font-medium flex items-center gap-2">
            <span class="text-gray-500">📱</span>
            <span>{customer.phone}</span>
          </div>
          
          {customer.address ? (
            <div class="text-sm text-gray-600 flex items-start gap-2">
              <span class="text-green-600 mt-0.5">🏠</span>
              <span class="text-right max-w-xs line-clamp-2">{customer.address}</span>
            </div>
          ) : (
            <div class="text-sm text-gray-400 flex items-center gap-2">
              <span>📍</span>
              <span>آدرس ثبت نشده</span>
            </div>
          )}
        </div>
      </td>

      {/* Status */}
      <td class="px-6 py-4">
        <div class="flex flex-wrap gap-2">
          {info.hasName && (
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <span>👤</span>
              <span>دارای نام</span>
            </span>
          )}
          
          {info.hasAddress && (
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <span>🏠</span>
              <span>دارای آدرس</span>
            </span>
          )}
          
          {info.isRecent && (
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <span>🆕</span>
              <span>جدید</span>
            </span>
          )}

          {/* Empty State if no tags */}
          {!info.hasName && !info.hasAddress && !info.isRecent && (
            <span class="text-xs text-gray-400">بدون برچسب</span>
          )}
        </div>
      </td>

      {/* Join Date */}
      <td class="px-6 py-4">
        <div class="space-y-1">
          <div class="text-sm text-gray-900 font-medium">
            {formatDate(customer.createdAt)}
          </div>
          <div class="text-xs text-gray-500">
            {new Date(customer.createdAt).toLocaleTimeString('fa-IR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          
          {info.isRecent && (
            <div class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block">
              عضویت جدید
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});