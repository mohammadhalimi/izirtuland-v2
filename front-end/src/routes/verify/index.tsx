import { component$, useSignal, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const code = useSignal('');
  const loc = useLocation();
  const phone = loc.url.searchParams.get('phone');

  const verifyOtp = $(async () => {
    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: code.value }),
      credentials: 'include'
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = '/Profile/';
    } else {
      alert('کد اشتباه است یا منقضی شده');
    }
  });

  return (
    <div class="max-w-sm mx-auto p-4 mt-10 border rounded">
      <h2 class="text-xl font-bold mb-4 text-center">ورود کد تایید</h2>

      <input
        class="border p-2 w-full mb-3 rounded"
        placeholder="کد ۶ رقمی"
        value={code.value}
        onInput$={(e) => (code.value = (e.target as HTMLInputElement).value)}
      />

      <button
        class="bg-green-600 text-white p-2 w-full rounded"
        onClick$={verifyOtp}
      >
        تایید
      </button>
    </div>
  );
});
