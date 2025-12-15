// src/root.tsx
import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { CartProvider } from '~/context/cart-provider';
import { RouterHead } from './components/router-head/router-head';
import './global.css';
import { AuthProvider } from './context/auth-provider';

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <RouterHead />
      </head>
      <body lang="en" dir="rtl">
        <AuthProvider>
          <CartProvider>
            <RouterOutlet />
          </CartProvider>
        </AuthProvider>
      </body>
    </QwikCityProvider>
  );
});
