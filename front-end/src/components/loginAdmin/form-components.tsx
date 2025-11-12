// src/components/loginAdmin/form-components.tsx
import { component$, $, Slot } from '@builder.io/qwik';
import type { FieldErrors } from '~/components/types/authAdmin';

interface UsernameInputProps {
  fieldErrors?: FieldErrors;
}

interface PasswordInputProps {
  fieldErrors?: FieldErrors;
  showPassword: { value: boolean };
}

interface LoginButtonProps {
  isRunning: boolean;
}

interface ErrorMessageProps {
  message?: string;
}

// کامپوننت‌های reusable
export const FormField = component$(() => (
  <div>
    <Slot />
  </div>
));

export const Label = component$<{ htmlFor: string }>(({ htmlFor }) => (
  <label class="block text-sm font-medium text-gray-700 mb-2" for={htmlFor}>
    <Slot />
  </label>
));

export const InputWrapper = component$<{ icon: string }>(({ icon }) => (
  <div class="relative">
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <span class="text-gray-400">{icon}</span>
    </div>
    <Slot />
  </div>
));

export const FieldError = component$<{ messages?: string[] }>(({ messages }) => {
  if (!messages?.[0]) return null;
  
  return (
    <p class="mt-1 text-sm text-red-600">{messages[0]}</p>
  );
});

// Username Input
export const UsernameInput = component$<UsernameInputProps>(({ fieldErrors }) => (
  <FormField>
    <Label htmlFor="username">
      نام کاربری
    </Label>
    <InputWrapper icon="👤">
      <input
        type="text"
        name="username"
        class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
        placeholder="نام کاربری خود را وارد کنید"
        dir="ltr"
      />
    </InputWrapper>
    <FieldError messages={fieldErrors?.username} />
  </FormField>
));

// Password Input
export const PasswordInput = component$<PasswordInputProps>(({ fieldErrors, showPassword }) => {
  const togglePasswordVisibility = $(() => {
    showPassword.value = !showPassword.value;
  });

  return (
    <FormField>
      <Label htmlFor="password">
        رمز عبور
      </Label>
      <InputWrapper icon="🔒">
        <input
          type={showPassword.value ? "text" : "password"}
          name="password"
          class="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
          placeholder="رمز عبور خود را وارد کنید"
          dir="ltr"
        />
        <button
          type="button"
          onClick$={togglePasswordVisibility}
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword.value ? '👁️' : '👁️‍🗨️'}
        </button>
      </InputWrapper>
      <FieldError messages={fieldErrors?.password} />
    </FormField>
  );
});

// Remember Me
export const RememberMe = component$(() => (
  <div class="flex items-center justify-between">
    <label class="flex items-center">
      <input
        type="checkbox"
        name="rememberMe"
        class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <span class="mr-2 text-sm text-gray-600">مرا به خاطر بسپار</span>
    </label>
    <button
      type="button"
      class="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
    >
      رمز عبور را فراموش کرده‌اید؟
    </button>
  </div>
));

// Error Message
export const ErrorMessage = component$<ErrorMessageProps>(({ message }) => {
  if (!message) return null;

  return (
    <div class="rounded-md bg-red-50 p-4 border border-red-200">
      <div class="flex items-center">
        <span class="text-red-400 ml-2">⚠️</span>
        <p class="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
});

// Login Button
export const LoginButton = component$<LoginButtonProps>(({ isRunning }) => (
  <button
    type="submit"
    disabled={isRunning}
    class={getButtonClasses(isRunning)}
  >
    {isRunning ? <LoadingState /> : <ReadyState />}
  </button>
));

const getButtonClasses = (isRunning: boolean): string => `
  w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300
  ${isRunning 
    ? 'bg-gray-400 cursor-not-allowed' 
    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
  }
`;

const LoadingState = component$(() => (
  <div class="flex items-center justify-center">
    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
    در حال ورود...
  </div>
));

const ReadyState = component$(() => (
  <div class="flex items-center justify-center">
    <span class="ml-2">🚀</span>
    ورود به پنل مدیریت
  </div>
));