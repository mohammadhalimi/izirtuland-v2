import { component$ } from "@builder.io/qwik";

export const SecurityNotice = component$(() => (
  <div class="mt-6 text-center">
    <div class="flex items-center justify-center text-xs text-gray-500">
      <span class="ml-1">🛡️</span>
      ارتباط شما امن است
    </div>
  </div>
));