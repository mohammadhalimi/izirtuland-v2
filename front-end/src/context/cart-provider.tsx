// cart-provider.tsx
import { component$, useStore, useContextProvider, Slot, useTask$, $, useVisibleTask$ } from '@builder.io/qwik';
import type { CartState, CartItem } from './cart-context';
import { CartContext } from './cart-context';

export const CartProvider = component$(() => {
  const cart = useStore<CartState>({
    items: [],
    loaded: false,
  });

  // بارگذاری اولیه از localStorage (فقط در کلاینت)
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
  });

  // ردیابی تغییرات بین تب‌ها
  useVisibleTask$(({ cleanup }) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'perebar_cart') {
        try {
          if (event.newValue) {
            const parsed = JSON.parse(event.newValue);
            if (Array.isArray(parsed)) {
              cart.items = [...parsed];
            }
          } else {
            cart.items = [];
          }
        } catch (error) {
          console.error('Error parsing cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    cleanup(() => window.removeEventListener('storage', handleStorageChange));
  });

  // Helper function to save to localStorage safely
  const saveToLocalStorage = $((items: CartItem[]) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('perebar_cart', JSON.stringify(items));
    }
  });

  // تعریف توابع
  cart.addItem = $(async (item: CartItem) => {
    console.log('Adding item to cart:', item);
    const existingIndex = cart.items.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      cart.items[existingIndex].quantity += item.quantity;
      // Create new array reference for reactivity
      cart.items = [...cart.items];
    } else {
      // Add new item
      cart.items = [...cart.items, { ...item }];
    }
    
    await saveToLocalStorage(cart.items);
    
    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  });

  cart.removeItem = $(async (id: string) => {
    console.log('Removing item from cart:', id);
    cart.items = cart.items.filter(item => item.id !== id);
    await saveToLocalStorage(cart.items);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  });

  cart.updateQuantity = $(async (id: string, quantity: number) => {
    console.log('Updating quantity for item:', id, 'to', quantity);
    const item = cart.items.find(i => i.id === id);
    
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== id);
      } else {
        item.quantity = quantity;
        // Create new array reference for reactivity
        cart.items = [...cart.items];
      }
      
      await saveToLocalStorage(cart.items);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    }
  });

  cart.clearCart = $(async () => {
    console.log('Clearing cart');
    cart.items = [];
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('perebar_cart');
    }
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  });

  cart.getTotalPrice = $(() => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  cart.getTotalItems = $(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  cart.isInCart = $((id: string) => {
    return cart.items.some(item => item.id === id);
  });

  cart.getItemQuantity = $((id: string) => {
    const item = cart.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  });

  useContextProvider(CartContext, cart);

  return <Slot />;
});