import { component$, useStore, useSignal, $ } from '@builder.io/qwik';

export default component$(() => {
  const form = useStore({ phone: '' });
  const loading = useSignal(false);
  const message = useSignal('');

  const sendCode = $(async () => {
    if (!form.phone) return;
    loading.value = true;
    message.value = '';
    try {
      const res = await fetch('http://localhost:5000/api/sms/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone })
      });
      const data = await res.json();
      if (res.ok) {
        message.value = `✅ کد ارسال شد: ${data.code}`; // برای تست نمایش کد
      } else {
        message.value = `❌ خطا: ${data.message}`;
      }
    } catch (err: any) {
      message.value = `❌ خطا در ارتباط با سرور: ${err.message}`;
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="p-6 max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">ارسال کد تایید</h2>
      <input
        type="text"
        placeholder="شماره تلفن"
        value={form.phone}
        onInput$={(e) => form.phone = (e.target as HTMLInputElement).value}
        class="w-full p-2 border rounded mb-4"
      />
      <button
        onClick$={sendCode}
        disabled={loading.value || !form.phone.trim()}
        class="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading.value ? 'در حال ارسال...' : 'ارسال کد'}
      </button>
      {message.value && (
        <p class={`mt-4 p-2 rounded ${message.value.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.value}
        </p>
      )}
    </div>
  );
});
