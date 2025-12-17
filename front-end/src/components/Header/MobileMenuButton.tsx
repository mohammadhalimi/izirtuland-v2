// src/components/layouts/MobileMenuButton.tsx
import { component$, Signal } from '@builder.io/qwik';

interface MobileMenuButtonProps {
  isMenuOpen: Signal<boolean>;
}

export default component$<MobileMenuButtonProps>(({ isMenuOpen }) => {
  return (
    <button
      class="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors duration-200 relative w-8 h-8"
      onClick$={() => isMenuOpen.value = !isMenuOpen.value}
    >
      {/* آیکون همبرگر */}
      <svg
        class={`w-6 h-6 absolute top-1 left-1 transition-all duration-300 hover:cursor-pointer ${
          isMenuOpen.value ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>

      {/* آیکون ضربدر */}
      <svg
        class={`w-6 h-6 absolute top-1 left-1 transition-all duration-300 hover:cursor-pointer ${
          isMenuOpen.value ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  );
});