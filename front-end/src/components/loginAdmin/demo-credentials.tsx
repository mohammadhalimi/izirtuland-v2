import { component$ } from "@builder.io/qwik";

export const DemoCredentials = component$(() => (
  <div class="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
    <h3 class="text-sm font-medium text-green-800 mb-2 flex items-center">
      <span class="ml-1">💡</span>
      اطلاعات آزمایشی
    </h3>
    <CredentialList />
  </div>
));

const CredentialList = component$(() => (
  <div class="text-xs text-green-700 space-y-1">
    <CredentialItem label="نام کاربری:" value="admin@porbar-baghstan.ir" />
    <CredentialItem label="رمز عبور:" value="admin123" />
  </div>
));

const CredentialItem = component$(({ label, value }: { label: string; value: string }) => (
  <div class="flex justify-between">
    <span>{label}</span>
    <span class="font-mono">{value}</span>
  </div>
));