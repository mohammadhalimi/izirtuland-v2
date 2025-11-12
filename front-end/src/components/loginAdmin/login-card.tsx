import { component$, Slot } from '@builder.io/qwik';

export const LoginCard = component$(() => (
  <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
    <Slot />
  </div>
));