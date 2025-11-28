import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();
  
  
  const navItems = [
    {
      id: 1,
      name: 'خانه',
      icon: '🏠',
      activeIcon: '🏡',
      href: '/',
      badge: null,
      description: 'صفحه اصلی'
    },
    {
      id: 2,
      name: 'سبد خرید',
      icon: '🛒',
      activeIcon: '🛍️',
      href: '/Cart/',
      badge: 3,
      description: 'مشاهده سبد'
    },
    {
      id: 3,
      name: 'محصولات',
      icon: '🌿',
      activeIcon: '🌱',
      href: '/Products/',
      badge: 'جدید',
      description: 'محصولات ویژه'
    },
    {
      id: 4,
      name: 'پروفایل',
      icon: '👤',
      activeIcon: '🤵',
      href: '/User/', // با حروف کوچک
      badge: null,
      description: 'حساب کاربری'
    }
  ];

  const isActive = (href: string) => {
    const currentPath = location.url.pathname;
    
    
    // برای صفحه اصلی
    if (href === '/' && currentPath === '/') {
      return true;
    }
    
    // برای صفحات دیگر
    if (href !== '/' && currentPath.startsWith(href)) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
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
                {/* آیکون */}
                <div class="relative mb-1">
                  <span class={`
                    text-2xl transition-all duration-300
                    ${active ? 'scale-110' : 'scale-100'}
                  `}>
                    {active ? item.activeIcon : item.icon}
                  </span>
                  
                  {/* بدج */}
                  {item.badge && (
                    <span class={`
                      absolute -top-2 -right-2 text-xs rounded-full px-1 min-w-5 h-5 
                      flex items-center justify-center font-bold
                      ${typeof item.badge === 'number' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white text-[10px]'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* متن */}
                <span class={`
                  text-xs transition-all duration-300 whitespace-nowrap
                  ${active 
                    ? 'font-bold scale-105' 
                    : 'font-medium scale-100 opacity-90'
                  }
                `}>
                  {item.name}
                </span>

                {/* نشانگر فعال */}
                {active && (
                  <div class="absolute top-0 w-10 h-1 bg-linear-to-r from-green-400 to-green-600 rounded-b-full"></div>
                )}

                {/* Tooltip */}
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

        {/* افکت شیشه‌ای */}
        <div class="absolute -top-6 left-0 right-0 h-6 bg-linear-to-t from-white/80 to-transparent pointer-events-none"></div>
      </div>

      {/* فضای خالی در پایین صفحه */}
      <div class="lg:hidden h-20"></div>
    </>
  );
});