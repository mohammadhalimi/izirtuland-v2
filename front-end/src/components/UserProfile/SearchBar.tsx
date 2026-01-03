// src/components/user/SearchBar.tsx
import { component$, QRL } from '@builder.io/qwik';

interface SearchBarProps {
  searchTerm: string;
  onSearchInput: QRL<(value: string) => void>;
  placeholder?: string;
  onClear?: QRL<() => void>;
}

export default component$<SearchBarProps>(({ 
  searchTerm, 
  onSearchInput,
  placeholder = "بر اساس کد رهگیری جستجو کنید.",
  onClear
}) => {
  return (
    <div class="relative w-full md:w-auto">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <input
        type="text"
        value={searchTerm}
        onInput$={(e) => onSearchInput((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        class="w-full md:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-white shadow-sm text-sm"
        dir="rtl"
      />
      
      {searchTerm && (
        <button
          onClick$={() => {
            onSearchInput('');
            onClear?.();
          }}
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="پاک کردن جستجو"
        >
          ✕
        </button>
      )}
    </div>
  );
});