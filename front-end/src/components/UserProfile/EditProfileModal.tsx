import { $, component$, useStore, type QRL } from '@builder.io/qwik';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose$: QRL<() => void>;
  onSave$: QRL<(name: string, address: string) => Promise<void>>;
  initialName: string;
  initialAddress: string;
  loading: boolean;
  error: string;
}

export default component$<EditProfileModalProps>(({
  isOpen,
  onClose$,
  onSave$,
  initialName,
  initialAddress,
  loading,
  error
}) => {
  const form = useStore({
    name: initialName,
    address: initialAddress
  });

  const handleSubmit = $(async () => {
    await onSave$(form.name.trim(), form.address.trim());
  });

  const handleOverlayClick = $(() => {

    onClose$();
  });

  const handleModalClick = $((e: MouseEvent) => {
    // جلوگیری از bubble شدن event به overlay
    e.stopPropagation();
  });

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity"
        onClick$={handleOverlayClick}
      />

      {/* Modal Container */}
      <div class="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div 
          onClick$={handleModalClick}
          class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden"
        >
          {/* Header */}
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-xl font-bold text-gray-900">ویرایش پروفایل</h3>
            <button
              onClick$={onClose$}
              class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={form.name}
                  onInput$={(e) => form.name = (e.target as HTMLInputElement).value}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  آدرس
                </label>
                <textarea
                  value={form.address}
                  onInput$={(e) => form.address = (e.target as HTMLTextAreaElement).value}
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  placeholder="آدرس کامل خود را وارد کنید"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <span class="ml-2">⚠️</span>
                  <span class="text-sm">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div class="flex space-x-3 pt-4">
                <button
                  onClick$={onClose$}
                  disabled={loading}
                  class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50 cursor-pointer"
                >
                  لغو
                </button>
                <button
                  onClick$={handleSubmit}
                  disabled={loading}
                  class="flex-1 px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>ذخیره تغییرات</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});