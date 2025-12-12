// src/components/layouts/BottomNav.tsx
import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();
  
  const state = useStore({
    uniqueProductCount: 0, // تعداد محصولات منحصر به فرد
    cartVersion: 0,
    isClient: false
  });

  useVisibleTask$(({ cleanup }) => {
    state.isClient = true;
    
    // تابع برای خواندن از localStorage و محاسبه تعداد محصولات منحصر به فرد
    const readCartFromStorage = () => {
      try {
        const cartData = localStorage.getItem('perebar_cart');
        if (!cartData) return 0;
        
        const items = JSON.parse(cartData);
        if (!Array.isArray(items)) return 0;
        
        // تعداد محصولات منحصر به فرد = طول آرایه
        return items.length;
      } catch (error) {
        console.error('Error reading cart:', error);
        return 0;
      }
    };

    // مقدار اولیه
    state.uniqueProductCount = readCartFromStorage();

    // تابع به‌روزرسانی
    const updateCart = () => {
      const newCount = readCartFromStorage();
      if (state.uniqueProductCount !== newCount) {
        state.uniqueProductCount = newCount;
        state.cartVersion++;
      }
    };

    // گوش دادن به eventها
    const handleCartEvent = () => {
      updateCart();
    };

    window.addEventListener('cart-updated', handleCartEvent);
    window.addEventListener('cart-force-update', handleCartEvent);
    
    // گوش دادن به storage events
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'perebar_cart') {
        updateCart();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    cleanup(() => {
      window.removeEventListener('cart-updated', handleCartEvent);
      window.removeEventListener('cart-force-update', handleCartEvent);
      window.removeEventListener('storage', handleStorageChange);
    });
  });

  const navItems = [
    {
      id: 1,
      name: 'خانه',
      icon: '🏠',
      activeIcon: '🏡',
      href: '/',
      description: 'صفحه اصلی'
    },
    {
      id: 2,
      name: 'سبد خرید',
      icon: '🛒',
      activeIcon: '🛍️',
      href: '/Card/',
      description: state.uniqueProductCount > 0 
        ? `${state.uniqueProductCount} محصول` 
        : 'سبد خرید خالی است'
    },
    {
      id: 3,
      name: 'محصولات',
      icon: '🌿',
      activeIcon: '🌱',
      href: '/Products/',
      description: 'محصولات ویژه'
    },
    {
      id: 4,
      name: 'پروفایل',
      icon: '👤',
      activeIcon: '🤵',
      href: '/User/',
      description: 'حساب کاربری'
    }
  ];

  const isActive = (href: string) => {
    const currentPath = location.url.pathname;

    if (href === '/' && currentPath === '/') {
      return true;
    }

    if (href !== '/' && currentPath.startsWith(href)) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-2xl">
        <div class="flex justify-around items-center">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                class={`
                  relative flex flex-col items-center justify-center py-3 px-1 
                  transition-all duration-300 flex-1 min-w-0 group
                  ${active
                    ? 'text-green-600 transform -translate-y-1'
                    : 'text-gray-500 hover:text-green-500'
                  }
                `}
              >
                <div class="relative mb-1">
                  <span class={`
                    text-2xl transition-all duration-300
                    ${active ? 'scale-110' : 'scale-100'}
                  `}>
                    {active ? item.activeIcon : item.icon}
                  </span>

                  {item.id === 2 && state.uniqueProductCount > 0 && (
                    <div
                      key={`bottom-cart-badge-${state.cartVersion}`}
                      class="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
                    >
                      {state.uniqueProductCount > 99 ? '99+' : state.uniqueProductCount}
                    </div>
                  )}
                </div>

                <span class={`
                  text-xs transition-all duration-300 whitespace-nowrap
                  ${active
                    ? 'font-bold scale-105'
                    : 'font-medium scale-100 opacity-90'
                  }
                `}>
                  {item.name}
                </span>

                {active && (
                  <div class="absolute top-0 w-10 h-1 bg-linear-to-r from-green-400 to-green-600 rounded-b-full"></div>
                )}

                <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div class="bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    {item.description}
                    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div class="absolute -top-6 left-0 right-0 h-6 bg-linear-to-t from-white/80 to-transparent pointer-events-none"></div>
      </div>
      <div class="lg:hidden h-20"></div>
    </>
  );
});