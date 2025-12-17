// src/components/layouts/UserMenu.tsx
import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { AuthContext } from '~/context/auth-context';

export default component$(() => {
  const auth = useContext(AuthContext);

  if (auth.loading) return null;

  return (
    <Link
      href="/User"
      class={`hidden md:flex items-center gap-2 px-3 py-2 rounded transition-colors ${
        auth.isAuthenticated 
          ? 'text-green-700 hover:text-green-800 hover:bg-green-50' 
          : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
      }`}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <span class="text-sm">
        {auth.isAuthenticated ? 'حساب کاربری' : 'ورود / ثبت‌ نام'}
      </span>
    </Link>
  );
});