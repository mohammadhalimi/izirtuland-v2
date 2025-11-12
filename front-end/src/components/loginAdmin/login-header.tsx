import { component$ } from "@builder.io/qwik";

export const LoginHeader = component$(() => (
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-6">
      <Logo />
      <Title />
    </div>
    <WelcomeMessage />
  </div>
));

const Logo = component$(() => (
  <div class="w-12 h-12 bg-linear-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
    🌿
  </div>
));

const Title = component$(() => (
  <div class="mr-3 text-right">
    <h1 class="text-2xl font-bold text-gray-800">پربار باغستان</h1>
    <p class="text-green-600 text-sm font-medium">پنل مدیریت</p>
  </div>
));

const WelcomeMessage = component$(() => (
  <>
    <h2 class="text-3xl font-bold text-gray-800 mb-2">خوش آمدید</h2>
    <p class="text-gray-600">لطفا وارد حساب کاربری خود شوید</p>
  </>
));