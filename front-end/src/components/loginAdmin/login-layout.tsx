import { component$, Slot } from '@builder.io/qwik';
import { BackgroundDecorations } from './background-decorations';

export const LoginLayout = component$(() => {
  return (
    <div class="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <BackgroundDecorations />
      <div class="relative w-full max-w-md">
        <Slot />
        <Footer />
      </div>
    </div>
  );
});

const Footer = component$(() => (
  <div class="text-center mt-8">
    <p class="text-sm text-gray-600">
      © ۱۴۰۲ پربار باغستان. تمام حقوق محفوظ است.
    </p>
  </div>
));