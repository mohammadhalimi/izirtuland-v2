// // src/components/providers/CartProvider.tsx
// import { component$, useStore, useTask$ } from '@builder.io/qwik';
// import { CartContextId, CartState, type CartItem } from '~/context/cart-context';


// export default component$(() => {
//   // بارگذاری cart از localStorage
//   const loadCartFromStorage = (): CartItem[] => {
//     if (typeof window === 'undefined') return [];
//     const cartJson = localStorage.getItem('perebar_cart');
//     return cartJson ? JSON.parse(cartJson) : [];
//   };

//   // ذخیره cart در localStorage
//   const saveCartToStorage = (items: CartItem[]) => {
//     if (typeof window === 'undefined') return;
//     localStorage.setItem('perebar_cart', JSON.stringify(items));
//   };

//   // استفاده از reactive store
//   const cartStore = useStore<CartState>({
//     items: loadCartFromStorage(),
//   });

//   // ذخیره خودکار در localStorage هنگام تغییر
//   useTask$(({ track }) => {
//     track(() => cartStore.items);
//     saveCartToStorage(cartStore.items);
//   });

//   return (
//     <CartContextId.Provider value={cartStore}>
//       <slot />
//     </CartContextId.Provider>
//   );
// });