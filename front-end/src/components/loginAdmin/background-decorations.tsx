import { component$ } from "@builder.io/qwik";
export const BackgroundDecorations = component$(() => (
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl" />
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl" />
    <div class="absolute top-1/2 left-1/4 w-60 h-60 bg-green-100 rounded-full opacity-10 blur-2xl" />
  </div>
));