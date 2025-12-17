// src/components/layouts/Header.tsx
import { component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { AuthContext } from '~/context/auth-context';
import { API_BASE_URL } from '~/config/api';
import Logo from '../Header/Logo';
import DesktopNav from '../Header/DesktopNav';
import UserMenu from '../Header/UserMenu';
import CartIcon from '../Header/CartIcon';
import MobileMenuButton from '../Header/MobileMenuButton';
import MobileMenu from '../Header/MobileMenu';

export default component$(() => {
  const isMenuOpen = useSignal(false);
  const auth = useContext(AuthContext);
  
  useVisibleTask$(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      auth.isAuthenticated = !!data.success;
    } catch {
      auth.isAuthenticated = false;
    } finally {
      auth.loading = false;
    }
  });

  const cartState = useStore({
    uniqueProductCount: 0,
    cartVersion: 0,
    isClient: false
  });

  useVisibleTask$(({ cleanup }) => {
    cartState.isClient = true;

    const readCartFromStorage = () => {
      try {
        const cartData = localStorage.getItem('perebar_cart');
        if (!cartData) return 0;
        const items = JSON.parse(cartData);
        return Array.isArray(items) ? items.length : 0;
      } catch (error) {
        console.error('Error reading cart:', error);
        return 0;
      }
    };

    const updateCart = () => {
      const newCount = readCartFromStorage();
      if (cartState.uniqueProductCount !== newCount) {
        cartState.uniqueProductCount = newCount;
        cartState.cartVersion++;
      }
    };

    const handleCartEvent = () => updateCart();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'perebar_cart') updateCart();
    };

    cartState.uniqueProductCount = readCartFromStorage();
    
    window.addEventListener('cart-updated', handleCartEvent);
    window.addEventListener('cart-force-update', handleCartEvent);
    window.addEventListener('storage', handleStorageChange);

    cleanup(() => {
      window.removeEventListener('cart-updated', handleCartEvent);
      window.removeEventListener('cart-force-update', handleCartEvent);
      window.removeEventListener('storage', handleStorageChange);
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => isMenuOpen.value);
    document.body.style.overflow = isMenuOpen.value ? 'hidden' : 'auto';
  });

  return (
    <header class="sticky top-0 z-100 bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          
          {/* لوگو */}
          <Logo />
          
          {/* منوی اصلی دسکتاپ */}
          <DesktopNav />
          
          {/* آیکون‌های سمت چپ */}
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            {/* منوی کاربر */}
            <UserMenu />
            
            {/* آیکون سبد خرید */}
            <CartIcon 
              uniqueProductCount={cartState.uniqueProductCount}
              cartVersion={cartState.cartVersion}
            />
            
            {/* دکمه منوی موبایل */}
            <MobileMenuButton isMenuOpen={isMenuOpen} />
          </div>
        </div>
        
        {/* منوی موبایل */}
        <MobileMenu isMenuOpen={isMenuOpen} />
      </div>
    </header>
  );
});