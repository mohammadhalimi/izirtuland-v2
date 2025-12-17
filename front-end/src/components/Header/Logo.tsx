// src/components/layouts/Logo.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <Link href="/" class="flex items-center">
      <div class="text-2xl font-bold text-green-600">
        پربار باغستان
      </div>
    </Link>
  );
});