// src/utils/cart-store.ts
import { useStore, useTask$ } from '@builder.io/qwik';
import type { CartItem } from '~/context/cart-context';

// کلاس Singleton برای مدیریت cart
class CartStore {
  private static instance: CartStore;
  private items: CartItem[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CartStore {
    if (!CartStore.instance) {
      CartStore.instance = new CartStore();
    }
    return CartStore.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    const cartJson = localStorage.getItem('perebar_cart');
    this.items = cartJson ? JSON.parse(cartJson) : [];
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('perebar_cart', JSON.stringify(this.items));
  }

  getItems(): CartItem[] {
    return [...this.items]; // Return a copy
  }

  addItem(item: CartItem): void {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.saveToStorage();
  }

  removeItem(id: string): void {
    this.items = this.items.filter(i => i.id !== id);
    this.saveToStorage();
  }

  updateQuantity(id: string, quantity: number): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
      }
    }
  }

  clearCart(): void {
    this.items = [];
    this.saveToStorage();
  }

  getCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}

// Export singleton instance
export const cartStore = CartStore.getInstance();