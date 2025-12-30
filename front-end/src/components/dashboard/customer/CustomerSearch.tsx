// src/components/admin/dashboard/customer/CustomerSearch.tsx
import { component$ } from '@builder.io/qwik';
import { CustomerSearchProps } from '~/components/types/customerPanelAdmin';

export const CustomerSearch = component$<CustomerSearchProps>(({ 
  searchQuery, 
  resultsCount, 
  onSearchChange 
}) => {
  return (
    <div class="mb-6">
      <div class="relative group">
        <input
          type="text"
          value={searchQuery}
          onInput$={(e) => onSearchChange((e.target as HTMLInputElement).value)}
          placeholder="🔍 جستجوی مشتری بر اساس نام، شماره تلفن یا آدرس..."
          class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 group-hover:border-green-400"
        />
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
          <span class="text-gray-400">🔍</span>
        </div>
        
        {searchQuery && (
          <div class="absolute left-12 top-1/2 transform -translate-y-1/2">
            <span class="text-sm text-green-600 font-medium">
              {resultsCount} نتیجه
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div class="absolute left-24 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
          {searchQuery && (
            <button
              onClick$={() => onSearchChange('')}
              class="text-xs text-gray-500 hover:text-red-600 transition-colors"
              title="پاک کردن جستجو"
            >
              ✕ پاک کردن
            </button>
          )}
        </div>
      </div>

      {/* Search Tips */}
      {!searchQuery && (
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="text-xs text-gray-500">راهنما: </span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">نام</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">شماره تماس</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">آدرس</span>
        </div>
      )}
    </div>
  );
});