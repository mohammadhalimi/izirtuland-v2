// src/components/layouts/DesktopNav.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <nav class="hidden md:flex items-center space-x-8">
      <Link href="/" class="text-gray-700 hover:text-green-600 transition-colors duration-200">خانه</Link>
      
      <div class="relative group">
        <button class="text-gray-700 hover:text-green-600 transition-colors duration-200 flex items-center cursor-pointer">
          محصولات
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
          <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">کودهای شیمیایی</Link>
          <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">کودهای ارگانیک</Link>
          <Link href="/Products" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">سموم کشاورزی</Link>
        </div>
      </div>
      
      <Link href="/Blog" class="text-gray-700 hover:text-green-600 transition-colors duration-200">وبلاگ</Link>
      <Link href="/About" class="text-gray-700 hover:text-green-600 transition-colors duration-200">درباره ما</Link>
      <Link href="/Contact" class="text-gray-700 hover:text-green-600 transition-colors duration-200">تماس</Link>
    </nav>
  );
});