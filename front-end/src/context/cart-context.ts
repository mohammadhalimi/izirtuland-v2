// cart-context.ts
import { createContextId, type QRL } from '@builder.io/qwik';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  packageSize?: string;
  model?: string;
  brand?: string;
}

export interface CartState {
  items: CartItem[];
  loaded: boolean;
  addItem?: QRL<(item: CartItem) => void>;
  removeItem?: QRL<(id: string) => void>;
  updateQuantity?: QRL<(id: string, quantity: number) => void>;
  clearCart?: QRL<() => void>;
  getTotalPrice?: QRL<() => number>;
  getTotalItems?: QRL<() => number>;
}

export const CartContext = createContextId<CartState>('cart-context');