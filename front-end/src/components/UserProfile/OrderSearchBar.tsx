// src/components/user/OrderSearchBar.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';

interface OrderSearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export default component$<OrderSearchBarProps>(({ 
  onSearch, 
  placeholder = "جستجو بر اساس کد رهگیری..." 
}) => {
  const searchTerm = useSignal('');

  const handleSearch = $((value: string) => {
    searchTerm.value = value;
    onSearch(value);
  });

  const clearSearch = $(() => {
    searchTerm.value = '';
    onSearch('');
  });

  return (
    <div class="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div class="relative">
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        </div>
        <input
          type="text"
          value={searchTerm.value}
          onInput$={(e) => handleSearch((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          class="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 text-right"
          dir="rtl"
        />
        {searchTerm.value && (
          <button
            onClick$={clearSearch}
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            aria-label="پاک کردن جستجو"
          >
          </button>
        )}
      </div>
      
      {/* Tips Section */}
      <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <span class="text-green-600">💡</span>
          <span>کد رهگیری ۱۰ رقمی را وارد کنید</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-blue-600">🔍</span>
          <span>می‌توانید ۶ رقم آخر ID سفارش را هم وارد کنید</span>
        </div>
      </div>
    </div>
  );
});