// cart-provider.tsx
import { component$, useStore, useContextProvider, Slot, useVisibleTask$, $ } from '@builder.io/qwik';
import type { CartState, CartItem } from './cart-context';
import { CartContext } from './cart-context';

export const CartProvider = component$(() => {
  const cart = useStore<CartState>({
    items: [],
    loaded: false,
    // تابع‌ها ابتدا undefined تعریف می‌شوند
    addItem: undefined,
    removeItem: undefined,
    updateQuantity: undefined,
    clearCart: undefined,
    getTotalPrice: undefined,
    getTotalItems: undefined,
  });

  // بارگذاری اولیه از localStorage
  useVisibleTask$(() => {
    console.log('CartProvider: Loading from localStorage...');
    const saved = localStorage.getItem('perebar_cart');
    console.log('Saved cart data:', saved);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          cart.items = parsed;
          console.log('Cart items loaded:', parsed.length, 'items');
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    } else {
      console.log('No saved cart found in localStorage');
    }
    cart.loaded = true;
    
    // ردیابی تغییرات بین تب‌ها و پنجره‌ها
    const handleStorageChange = (event: StorageEvent) => {
      console.log('Storage event detected:', event.key);
      if (event.key === 'perebar_cart') {
        try {
          if (event.newValue) {
            const parsed = JSON.parse(event.newValue);
            if (Array.isArray(parsed)) {
              cart.items = parsed;
              console.log('Cart updated from other tab:', parsed);
            }
          } else {
            cart.items = [];
            console.log('Cart cleared from other tab');
          }
        } catch (error) {
          console.error('Error parsing cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  });

  // تعریف توابع مدیریت سبد خرید
  useVisibleTask$(() => {
    cart.addItem = $((item: CartItem) => {
      console.log('Adding item to cart:', item);
      const existing = cart.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.items.push({ ...item });
      }
      localStorage.setItem('perebar_cart', JSON.stringify(cart.items));
      console.log('Cart saved to localStorage:', cart.items);
    });

    cart.removeItem = $((id: string) => {
      console.log('Removing item from cart:', id);
      cart.items = cart.items.filter(item => item.id !== id);
      localStorage.setItem('perebar_cart', JSON.stringify(cart.items));
      console.log('Cart saved to localStorage after removal:', cart.items);
    });

    cart.updateQuantity = $((id: string, quantity: number) => {
      console.log('Updating quantity for item:', id, 'to', quantity);
      const item = cart.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('perebar_cart', JSON.stringify(cart.items));
        console.log('Cart saved to localStorage after quantity update:', cart.items);
      }
    });

    cart.clearCart = $(() => {
      console.log('Clearing cart');
      cart.items = [];
      localStorage.removeItem('perebar_cart');
    });

    cart.getTotalPrice = $(() => {
      return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    cart.getTotalItems = $(() => {
      return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    });
  });

  useContextProvider(CartContext, cart);

  return <Slot />;
});