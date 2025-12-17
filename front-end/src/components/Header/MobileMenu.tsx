// src/components/layouts/MobileMenu.tsx
import { $, component$, Signal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface MobileMenuProps {
  isMenuOpen: Signal<boolean>;
}

export default component$<MobileMenuProps>(({ isMenuOpen }) => {
  const closeMenu = $(() => {
    isMenuOpen.value = false;
  });

  return (
    <>
      {/* منوی موبایل */}
      <div class={`
        md:hidden fixed inset-0 top-16 bg-white z-40
        transition-all duration-300 ease-in-out overflow-y-auto
        ${isMenuOpen.value
          ? 'opacity-100 visible translate-x-0'
          : 'opacity-0 invisible translate-x-full'
        }
      `}>
        <div class="py-6 space-y-4 px-6">
          <Link
            href="/"
            class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
            onClick$={closeMenu}
          >
            🏠 خانه
          </Link>

          <div class="px-4 py-3">
            <div class="text-gray-700 font-medium mb-3 flex items-center text-lg">
              📦 محصولات
            </div>
            <div class="space-y-3 pr-4">
              <Link
                href="/Products"
                class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                onClick$={closeMenu}
              >
                • کودهای شیمیایی
              </Link>
              <Link
                href="/Products"
                class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                onClick$={closeMenu}
              >
                • کودهای ارگانیک
              </Link>
              <Link
                href="/Products"
                class="block py-3 text-gray-600 hover:text-green-600 transition-all duration-200 hover:translate-x-2 hover:font-medium border-b border-gray-100"
                onClick$={closeMenu}
              >
                • سموم کشاورزی
              </Link>
            </div>
          </div>
          
          <Link
            href="/Blog"
            class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
            onClick$={closeMenu}
          >
            📝 وبلاگ
          </Link>
          
          <Link
            href="/About"
            class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
            onClick$={closeMenu}
          >
            ℹ️ درباره ما
          </Link>
          
          <Link
            href="/Contact"
            class="block px-4 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 hover:translate-x-2 hover:shadow-sm text-lg font-medium"
            onClick$={closeMenu}
          >
            📞 تماس
          </Link>
        </div>
      </div>

      {/* overlay برای بستن منو */}
      {isMenuOpen.value && (
        <div
          class="md:hidden fixed inset-0 top-16 bg-black bg-opacity-50 z-30"
          onClick$={closeMenu}
        />
      )}
    </>
  );
});