// src/components/layouts/CartIcon.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface CartIconProps {
  uniqueProductCount: number;
  cartVersion: number;
}

export default component$<CartIconProps>(({ uniqueProductCount, cartVersion }) => {
  return (
    <Link href='/Card' class="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 relative lg:block hidden">
      <div class="relative group">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>

        {/* Badge با تعداد محصولات منحصر به فرد */}
        {uniqueProductCount > 0 && (
          <>
            <div
              key={`header-cart-badge-${cartVersion}`}
              class="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
            >
              {uniqueProductCount > 99 ? '99+' : uniqueProductCount}
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </>
        )}
      </div>
    </Link>
  );
});