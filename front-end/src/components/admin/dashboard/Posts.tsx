import { component$, useSignal, useTask$, useStore, $ } from '@builder.io/qwik';
import type { Post } from '~/components/types/posts';
import { API_BASE_URL } from '~/config/api';

interface PostsProps {
    authToken: string;
}

export default component$<PostsProps>(({ authToken }) => {
    const posts = useSignal<Post[]>([]);
    const isLoading = useSignal(true);
    const showDeleteModal = useSignal(false);
    const selectedPost = useSignal<Post | null>(null);
    const isActionLoading = useSignal(false);
    const message = useSignal('');
    const messageType = useSignal<'success' | 'error'>('success');
    const previewUrl = useSignal('');
    const newTag = useSignal('');
    const errorMessage = useSignal('');

    // استفاده از useStore برای state فرم
    const formState = useStore({
        title: '',
        content: '',
        metaDescription: '',
        image: null as File | null,
        tags: [] as string[]
    });

    // تابع ریست فرم
    const resetForm = $(() => {
        formState.title = '';
        formState.content = '';
        formState.metaDescription = '';
        formState.image = null;
        formState.tags = [];
        previewUrl.value = '';
        newTag.value = '';
    });

    // دریافت پست‌های کاربر جاری از endpoint جدید
    useTask$(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/my-posts`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const postsData = await response.json();
                console.log('📦 داده‌های دریافتی از my-posts:', postsData);

                // پردازش داده‌های دریافتی
                const postsArray = Array.isArray(postsData) ? postsData : (postsData.posts || postsData.data || []);

                posts.value = postsArray.map((post: any) => ({
                    ...post,
                    author: post.author || { username: 'شما' },
                    metaDescription: post.metaDescription || '',
                    tags: Array.isArray(post.tags) ? post.tags : [],
                    createdAt: post.createdAt || new Date().toISOString()
                }));

                console.log('✅ پست‌های پردازش شده:', posts.value);

            } else {
                console.error('Error fetching posts:', response.status);
                const errorText = await response.text();
                console.error('متن خطا:', errorText);
                errorMessage.value = 'خطا در دریافت پست‌های شما';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            errorMessage.value = 'خطا در ارتباط با سرور';
        } finally {
            isLoading.value = false;
        }
    });

    // تابع اضافه کردن تگ
    const addTag = $(() => {
        const tag = newTag.value.trim();
        if (tag && !formState.tags.includes(tag)) {
            formState.tags = [...formState.tags, tag];
            newTag.value = '';
        }
    });

    // تابع حذف تگ
    const removeTag = $((index: number) => {
        formState.tags = formState.tags.filter((_, i) => i !== index);
    });

    // تابع مدیریت کلید Enter در input تگ
    const handleTagKeyPress = $((event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    });

    // تابع برای دریافت عکس کامل
    const getFullImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    // تابع انتخاب فایل
    const handleFileSelect = $((event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            if (!file.type.startsWith('image/')) {
                showMessage('لطفاً فقط فایل تصویر انتخاب کنید', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showMessage('حجم فایل باید کمتر از ۵ مگابایت باشد', 'error');
                return;
            }

            formState.image = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                previewUrl.value = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    });

    // تابع برای نمایش پیام
    const showMessage = $((msg: string, type: 'success' | 'error') => {
        message.value = msg;
        messageType.value = type;

        setTimeout(() => {
            message.value = '';
        }, type === 'success' ? 5000 : 3000);
    });

    // تابع ایجاد پست جدید
    const handleCreatePost = $(async () => {
        console.log('🟢 شروع ایجاد پست...');

        if (!formState.title.trim() || !formState.content.trim()) {
            showMessage('عنوان و محتوای پست الزامی است', 'error');
            return;
        }

        isActionLoading.value = true;

        try {
            const formData = new FormData();
            formData.append('title', formState.title.trim());
            formData.append('content', formState.content.trim());
            formData.append('metaDescription', formState.metaDescription.trim());

            // تبدیل تگ‌ها به string با جداکننده کاما
            const tagsString = formState.tags.join(',');
            formData.append('tags', tagsString);

            // اضافه کردن عکس اگر وجود دارد
            if (formState.image) {
                formData.append('image', formState.image);
            }

            console.log('📤 ارسال FormData به /api/posts/create...');

            const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            console.log('📨 وضعیت پاسخ:', response.status, response.statusText);

            const responseText = await response.text();
            console.log('📦 پاسخ خام:', responseText);

            if (!response.ok) {
                throw new Error(`خطای سرور: ${response.status} - ${responseText}`);
            }

            const data = JSON.parse(responseText);
            console.log('✅ پست با موفقیت ایجاد شد:', data);

            // تبدیل تگ‌های string برگشتی به آرایه
            const newPost: Post = {
                ...data.post,
                author: data.post.author || { username: 'شما' },
                metaDescription: data.post.metaDescription || '',
                tags: Array.isArray(data.post.tags) ? data.post.tags : [],
                createdAt: data.post.createdAt || new Date().toISOString()
            };

            // اضافه کردن پست جدید به لیست
            posts.value = [newPost, ...posts.value];
            
            // ریست فرم
            resetForm();
            
            showMessage('🎉 پست جدید با موفقیت ایجاد شد!', 'success');

        } catch (error: any) {
            console.error('❌ خطا:', error);
            showMessage(`خطا در ایجاد پست: ${error.message}`, 'error');
        } finally {
            isActionLoading.value = false;
        }
    });

    // تابع حذف پست
    const handleDeletePost = $(async (postId: string) => {
        isActionLoading.value = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/delete/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const responseText = await response.text();

            if (response.ok) {
                const data = JSON.parse(responseText);
                // حذف پست از لیست
                posts.value = posts.value.filter(post => post._id !== postId);
                showDeleteModal.value = false;
                showMessage(data.message || '🗑️ پست با موفقیت حذف شد', 'success');
            } else {
                const data = JSON.parse(responseText);
                showMessage(data.message || 'خطا در حذف پست', 'error');
            }
        } catch (error: any) {
            console.error('خطا در حذف پست:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        } finally {
            isActionLoading.value = false;
        }
    });

    // تابع بستن Modal حذف
    const closeDeleteModal = $(() => {
        showDeleteModal.value = false;
        selectedPost.value = null;
    });

    // تابع فرمت تاریخ
    const formatDate = $((dateString: string) => {
        if (!dateString) return 'تاریخ نامشخص';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    });

    // event handlers برای input ها
    const handleTitleInput = $((event: Event) => {
        formState.title = (event.target as HTMLInputElement).value;
    });

    const handleContentInput = $((event: Event) => {
        formState.content = (event.target as HTMLTextAreaElement).value;
    });

    const handleMetaDescriptionInput = $((event: Event) => {
        formState.metaDescription = (event.target as HTMLTextAreaElement).value;
    });

    // event handler برای input تگ
    const handleTagInput = $((event: Event) => {
        newTag.value = (event.target as HTMLInputElement).value;
    });

    // در بخش رندر، حالت لودینگ را اضافه کنید
    if (isLoading.value) {
        return (
            <div class="space-y-6">
                <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">مدیریت پست‌های من</h2>
                            <p class="opacity-90">در حال بارگذاری...</p>
                        </div>
                        <div class="text-4xl">📝</div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-12 text-center">
                    <div class="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600">در حال بارگذاری پست‌های شما...</p>
                </div>
            </div>
        );
    }

    return (
        <div class="space-y-6">
            {/* هدر */}
            <div class="bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold mb-2">مدیریت پست‌های من</h2>
                        <p class="opacity-90">ایجاد و مدیریت پست‌های شخصی شما</p>
                    </div>
                    <div class="text-4xl">📝</div>
                </div>
            </div>

            {/* نمایش خطا */}
            {errorMessage.value && (
                <div class="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 ml-3">
                            ❌
                        </div>
                        <p>{errorMessage.value}</p>
                    </div>
                </div>
            )}

            {/* آمار و اقدامات */}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6 text-center">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
                        📝
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-1">{posts.value.length}</h3>
                    <p class="text-green-600 font-medium">پست‌های من</p>
                </div>
            </div>

            {/* پیام */}
            {message.value && (
                <div class={`p-4 rounded-2xl border-l-4 transition-all duration-300 ${messageType.value === 'success'
                    ? 'bg-green-50 text-green-800 border-green-500 shadow-md'
                    : 'bg-red-50 text-red-800 border-red-500 shadow-md'
                    }`}>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3 rtl:space-x-reverse">
                            <div class={`w-8 h-8 rounded-full flex items-center justify-center ${messageType.value === 'success'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                                }`}>
                                {messageType.value === 'success' ? '✅' : '❌'}
                            </div>
                            <div>
                                <p class="font-medium">
                                    {messageType.value === 'success' ? 'عملیات موفق' : 'خطا'}
                                </p>
                                <p class="text-sm">{message.value}</p>
                            </div>
                        </div>
                        <button
                            onClick$={() => message.value = ''}
                            class="p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-200"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* فرم ایجاد پست جدید */}
            <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
                <div class="mb-6">
                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            ✏️
                        </div>
                        <h3 class="text-xl font-bold text-gray-800">ایجاد پست جدید</h3>
                    </div>
                    <p class="text-gray-600 mt-2">اطلاعات پست جدید را وارد کنید</p>
                </div>

                <div class="space-y-6">
                    {/* فیلد عنوان */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span class="text-red-500">*</span>
                                <span>عنوان پست</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formState.title}
                            onInput$={handleTitleInput}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            placeholder="عنوان جذاب و مختصر برای پست خود بنویسید..."
                            maxLength={100}
                        />
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">حداکثر ۱۰۰ کاراکتر</span>
                            <span class={`text-xs ${formState.title.length > 80 ? 'text-orange-500' : 'text-gray-500'}`}>
                                {formState.title.length}/100
                            </span>
                        </div>
                    </div>

                    {/* فیلد متا دیسکریپشن */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>توضیحات متا (SEO)</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">اختیاری</span>
                            </span>
                        </label>
                        <textarea
                            value={formState.metaDescription}
                            onInput$={handleMetaDescriptionInput}
                            rows={3}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                            placeholder="توضیح مختصر و جذاب برای موتورهای جستجو (حداکثر ۱۶۰ کاراکتر)..."
                            maxLength={160}
                        />
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">ایده‌آل برای سئو: ۱۲۰-۱۶۰ کاراکتر</span>
                            <span class={`text-xs ${formState.metaDescription.length > 150 ? 'text-orange-500' : 'text-gray-500'
                                }`}>
                                {formState.metaDescription.length}/160
                            </span>
                        </div>
                    </div>

                    {/* فیلد تگ‌ها */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>تگ‌ها</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">اختیاری</span>
                            </span>
                        </label>

                        {/* نمایش تگ‌های اضافه شده */}
                        {formState.tags.length > 0 && (
                            <div class="flex flex-wrap gap-2 mb-3">
                                {formState.tags.map((tag, index) => (
                                    <div key={index} class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                        <span>#{tag}</span>
                                        <button
                                            type="button"
                                            onClick$={() => removeTag(index)}
                                            class="text-green-600 hover:text-green-800 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* input برای اضافه کردن تگ جدید */}
                        <div class="flex space-x-2">
                            <input
                                type="text"
                                value={newTag.value}
                                onInput$={handleTagInput}
                                onKeyPress$={handleTagKeyPress}
                                class="flex-1 px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="تگ جدید را وارد کنید (Enter برای اضافه کردن)"
                                maxLength={20}
                            />
                            <button
                                type="button"
                                onClick$={addTag}
                                disabled={!newTag.value.trim()}
                                class={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer duration-200 ${!newTag.value.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                اضافه
                            </button>
                        </div>
                    </div>

                    {/* فیلد محتوا */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span class="text-red-500">*</span>
                                <span>محتوای پست</span>
                            </span>
                        </label>
                        <textarea
                            value={formState.content}
                            onInput$={handleContentInput}
                            rows={6}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                            placeholder="متن کامل پست خود را اینجا بنویسید..."
                            maxLength={1000}
                        />
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs text-gray-500">حداقل ۱۰ کاراکتر - حداکثر ۱۰۰۰ کاراکتر</span>
                            <span class={`text-xs ${formState.content.length > 800 ? 'text-orange-500' :
                                formState.content.length < 10 ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                {formState.content.length}/1000
                            </span>
                        </div>
                    </div>

                    {/* آپلود عکس */}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <span class="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>عکس پست</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">اختیاری</span>
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange$={handleFileSelect}
                            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />

                        {/* پیش‌نمایش عکس */}
                        {previewUrl.value && (
                            <div class="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                <p class="text-sm text-green-700 mb-2">پیش‌نمایش عکس:</p>
                                <img
                                    src={previewUrl.value}
                                    alt="Preview"
                                    class="w-32 h-32 object-cover rounded-lg border border-green-300"
                                />
                            </div>
                        )}
                    </div>

                    {/* دکمه‌های اقدام */}
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            onClick$={resetForm}
                            class="px-6 py-3 text-gray-600 cursor-pointer hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium border border-gray-300"
                        >
                            پاک کردن فرم
                        </button>
                        <button
                            onClick$={handleCreatePost}
                            disabled={isActionLoading.value || !formState.title.trim() || !formState.content.trim() || formState.content.trim().length < 10}
                            class={`px-8 py-3 rounded-xl cursor-pointer font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse
                                ${isActionLoading.value || !formState.title.trim() || !formState.content.trim() || formState.content.trim().length < 10
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isActionLoading.value ? (
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

            {/* لیست پست‌های من */}
            <div class="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-800">پست‌های من ({posts.value.length})</h3>
                    <p class="text-gray-600 mt-1">لیست پست‌های ایجاد شده توسط شما</p>
                </div>

                {posts.value.length === 0 ? (
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📝</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز پستی ایجاد نکرده‌اید</h3>
                        <p class="text-gray-600">اولین پست خود را با استفاده از فرم بالا ایجاد کنید</p>
                    </div>
                ) : (
                    <div class="divide-y divide-gray-200">
                        {posts.value.map((post) => (
                            <div key={post._id} class="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div class="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse">
                                    {/* عکس پست */}
                                    {post.image && (
                                        <div class="shrink-0">
                                            <div class="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                                                <img
                                                    src={getFullImageUrl(post.image)}
                                                    alt={post.title}
                                                    class="w-full h-full object-cover"
                                                    onError$={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <div class="hidden w-full h-full bg-gray-100 items-center justify-center text-gray-400">
                                                    📷
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* محتوای پست */}
                                    <div class="flex-1 min-w-0">
                                        <h4 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                            {post.title}
                                        </h4>

                                        {/* نمایش تگ‌ها */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div class="flex flex-wrap gap-2 mb-2">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* نمایش متا دیسکریپشن */}
                                        {post.metaDescription && (
                                            <p class="text-sm text-gray-500 mb-2 line-clamp-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
                                                <span class="font-medium text-blue-600">SEO:</span> {post.metaDescription}
                                            </p>
                                        )}

                                        <p class="text-gray-600 mb-3 line-clamp-3">
                                            {post.content}
                                        </p>

                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                                                <span>{(post.author && post.author.username) || 'شما'}</span>
                                                {post.createdAt && (
                                                    <div class="flex items-center space-x-1 rtl:space-x-reverse">
                                                        <span>📅</span>
                                                        <span>{formatDate(post.createdAt)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                                <button
                                                    onClick$={() => {
                                                        selectedPost.value = post;
                                                        showDeleteModal.value = true;
                                                    }}
                                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="حذف پست"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal حذف پست */}
            {showDeleteModal.value && selectedPost.value && (
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-gray-800">تایید حذف</h3>
                            <button
                                onClick$={closeDeleteModal}
                                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p class="text-gray-600 mb-6">
                            آیا مطمئن هستید که می‌خواهید پست "<strong>{selectedPost.value.title}</strong>" را حذف کنید؟
                        </p>

                        <div class="flex justify-end space-x-3 rtl:space-x-reverse">
                            <button
                                onClick$={closeDeleteModal}
                                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                انصراف
                            </button>
                            <button
                                onClick$={() => handleDeletePost(selectedPost.value!._id!)}
                                disabled={isActionLoading.value}
                                class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isActionLoading.value ? 'در حال حذف...' : 'حذف پست'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});