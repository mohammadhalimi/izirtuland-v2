// src/components/admin/dashboard/CreatePostModal.tsx
import { component$, useSignal, $, Signal, QRL } from '@builder.io/qwik';
import type { Post } from '~/components/types/posts';

interface Props {
    authToken: string;
    isOpen: Signal<boolean>;
    onCreated$: QRL<(post: Post) => void>;
    onError$: QRL<(msg?: string) => void>;
    onClose$: QRL<() => void>;
}
export default component$<Props>(({
    authToken,
    isOpen,
    onCreated$,
    onError$,
    onClose$
}) => {
    const title = useSignal('');
    const content = useSignal('');
    const file = useSignal<File | null>(null);
    const preview = useSignal('');
    const loading = useSignal(false);

    // تابع resetForm
    const resetForm = $(() => {
        title.value = '';
        content.value = '';
        file.value = null;
        preview.value = '';
    });

    // تابع برای بستن مودال
    const handleClose = $(() => {
        resetForm();
        isOpen.value = false;  // 👈 اضافه شد
        onClose$();
    });


    // تابع برای هندل کردن انتخاب فایل
    const handleFileSelect = $((event: Event) => {
        const input = event.target as HTMLInputElement;

        if (!input.files?.[0]) return;

        const selectedFile = input.files[0];

        if (!selectedFile.type.startsWith('image/')) {
            onError$('لطفاً فقط فایل تصویر انتخاب کنید');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            onError$('حجم فایل باید کمتر از ۵ مگابایت باشد');
            return;
        }

        file.value = selectedFile;

        const reader = new FileReader();
        reader.onload = () => {
            preview.value = reader.result as string;
        };
        reader.readAsDataURL(selectedFile);
    });

    // تابع برای ارسال فرم
    const handleSubmit = $(async () => {
        if (!title.value.trim()) {
            onError$('عنوان پست الزامی است');
            return;
        }

        if (!content.value.trim()) {
            onError$('محتوای پست الزامی است');
            return;
        }

        loading.value = true;

        try {
            const formData = new FormData();
            formData.append('title', title.value.trim());
            formData.append('content', content.value.trim());

            if (file.value) {
                formData.append('image', file.value);
            }

            const response = await fetch('http://localhost:5000/api/posts/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                await handleClose();       // 👈 مشکل همین بود
                onCreated$(data);          // بدون تاخیر
            } else {
                onError$(data.message || 'خطا در ایجاد پست');
            }
        } catch (error) {
            onError$('خطا در ارتباط با سرور');
        } finally {
            loading.value = false;
        }
    });


    // تابع برای جلوگیری از propagation
    const stopPropagation = $((event: Event) => {
        event.stopPropagation();
    });

    return (
        <div
            class={{
                "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4": true,
                hidden: !isOpen.value,   // 👈 فقط همین!
            }}
            onClick$={handleClose}
        >
            <div
                class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
                onClick$={stopPropagation}
            >
                {/* هدر Modal */}
                <div class="bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span class="text-lg">📝</span>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold">ایجاد پست جدید</h2>
                                <p class="text-emerald-100 text-sm mt-1">مطلب جدید خود را در وبسایت منتشر کنید</p>
                            </div>
                        </div>
                        <button
                            onClick$={handleClose}
                            class="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* بدنه Modal */}
                <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* فیلد عنوان */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span class="text-red-500">*</span>
                                <span>عنوان پست</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={title.value}
                            onInput$={(_, el) => title.value = el.value}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                            placeholder="عنوان جذاب و مختصر برای پست خود بنویسید..."
                            maxLength={100}
                        />
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">حداکثر ۱۰۰ کاراکتر</span>
                            <span class={`text-xs ${title.value.length > 80 ? 'text-orange-500' : 'text-gray-500'}`}>
                                {title.value.length}/100
                            </span>
                        </div>
                    </div>

                    {/* فیلد محتوا */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span class="text-red-500">*</span>
                                <span>محتوای پست</span>
                            </span>
                        </label>
                        <textarea
                            value={content.value}
                            onInput$={(_, el) => content.value = el.value}
                            rows={6}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white resize-none"
                            placeholder="متن کامل پست خود را اینجا بنویسید..."
                            maxLength={1000}
                        />
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">حداقل ۱۰ کاراکتر - حداکثر ۱۰۰۰ کاراکتر</span>
                            <span class={`text-xs ${content.value.length > 800 ? 'text-orange-500' :
                                content.value.length < 10 ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                {content.value.length}/1000
                            </span>
                        </div>
                    </div>

                    {/* آپلود عکس */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>عکس پست</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">اختیاری</span>
                            </span>
                        </label>

                        <div class="border-2 border-dashed border-green-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-green-400 hover:bg-green-50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange$={handleFileSelect}
                                class="hidden"
                                id="post-image-upload"
                            />
                            <label
                                for="post-image-upload"
                                class="cursor-pointer block"
                            >
                                {preview.value ? (
                                    <div class="space-y-4">
                                        <div class="relative inline-block">
                                            <img
                                                src={preview.value}
                                                alt="Preview"
                                                class="w-32 h-32 object-cover rounded-lg shadow-md mx-auto"
                                            />
                                            <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                ✓
                                            </div>
                                        </div>
                                        <p class="text-sm text-green-600 font-medium">
                                            عکس انتخاب شده است
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            برای تغییر عکس، اینجا کلیک کنید
                                        </p>
                                    </div>
                                ) : (
                                    <div class="space-y-3">
                                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-green-600 font-medium">افزودن عکس پست</p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                برای آپلود عکس اینجا کلیک کنید یا فایل را بکشید
                                            </p>
                                            <p class="text-xs text-gray-400 mt-1">
                                                فرمت‌های مجاز: JPG, PNG, GIF • حداکثر حجم: ۵ مگابایت
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        {file.value && (
                            <div class="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span class="text-green-600">📷</span>
                                        <span class="text-sm font-medium text-green-800 truncate">
                                            {file.value.name}
                                        </span>
                                    </div>
                                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        {(file.value.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* راهنما */}
                    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 class="font-medium text-blue-800 mb-2 flex items-center space-x-2 rtl:space-x-reverse">
                            <span>💡</span>
                            <span>راهنمای ایجاد پست</span>
                        </h4>
                        <ul class="text-sm text-blue-700 space-y-1 list-disc pr-4">
                            <li>عنوان باید جذاب و مرتبط با محتوا باشد</li>
                            <li>محتوا باید کامل و مفید برای خوانندگان باشد</li>
                            <li>استفاده از عکس با کیفیت تأثیرگذاری پست را افزایش می‌دهد</li>
                            <li>پس از انتشار، پست در لیست پست‌ها نمایش داده می‌شود</li>
                        </ul>
                    </div>
                </div>

                {/* فوتر Modal */}
                <div class="border-t border-gray-200 p-6 bg-gray-50">
                    <div class="flex items-center justify-between">
                        <button
                            onClick$={handleClose}
                            class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-200 font-medium border border-gray-300"
                        >
                            انصراف
                        </button>

                        <button
                            onClick$={handleSubmit}
                            disabled={loading.value || !title.value.trim() || !content.value.trim() || content.value.trim().length < 10}
                            class={`
                px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse
                ${loading.value || !title.value.trim() || !content.value.trim() || content.value.trim().length < 10
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                                }
              `}
                        >
                            {loading.value ? (
                                <>
                                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>در حال ایجاد پست...</span>
                                </>
                            ) : (
                                <>
                                    <span>📤</span>
                                    <span>انتشار پست</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});