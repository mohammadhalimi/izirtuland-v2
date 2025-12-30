// src/components/admin/dashboard/posts/CreatePostForm.tsx
import { component$, $ } from '@builder.io/qwik';
import { CreatePostFormProps } from '~/components/types/post';

export const CreatePostForm = component$<CreatePostFormProps>((props) => {
  const isFormValid = () => {
    return (
      props.formState.title.trim().length > 0 &&
      props.formState.content.trim().length >= 10 &&
      !props.isActionLoading
    );
  };

  return (
    <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
      <div class="mb-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="w-8 h-8 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600">
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
            value={props.formState.title}
            onInput$={(e) => props.onTitleChange((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="عنوان جذاب و مختصر برای پست خود بنویسید..."
            maxLength={100}
          />
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-gray-500">حداکثر ۱۰۰ کاراکتر</span>
            <span class={`text-xs ${props.formState.title.length > 80 ? 'text-orange-500' : 'text-gray-500'}`}>
              {props.formState.title.length}/100
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
            value={props.formState.metaDescription}
            onInput$={(e) => props.onMetaDescriptionChange((e.target as HTMLTextAreaElement).value)}
            rows={3}
            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
            placeholder="توضیح مختصر و جذاب برای موتورهای جستجو (حداکثر ۱۶۰ کاراکتر)..."
            maxLength={160}
          />
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-gray-500">ایده‌آل برای سئو: ۱۲۰-۱۶۰ کاراکتر</span>
            <span class={`text-xs ${props.formState.metaDescription.length > 150 ? 'text-orange-500' : 'text-gray-500'
              }`}>
              {props.formState.metaDescription.length}/160
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
          {props.formState.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-3">
              {props.formState.tags.map((tag, index) => (
                <div key={index} class="bg-linear-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick$={() => props.onRemoveTag(index)}
                    class="text-green-600 hover:text-green-800 text-xs transition-colors"
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
              value={props.newTag}
              onInput$={(e) => props.onTagInput((e.target as HTMLInputElement).value)}
              onKeyPress$={props.onTagKeyPress}
              class="flex-1 px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="تگ جدید را وارد کنید (Enter برای اضافه کردن)"
              maxLength={20}
            />
            <button
              type="button"
              onClick$={props.onAddTag}
              disabled={!props.newTag.trim()}
              class={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${!props.newTag.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md'
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
            value={props.formState.content}
            onInput$={(e) => props.onContentChange((e.target as HTMLTextAreaElement).value)}
            rows={6}
            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
            placeholder="متن کامل پست خود را اینجا بنویسید..."
            maxLength={1000}
          />
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-gray-500">حداقل ۱۰ کاراکتر - حداکثر ۱۰۰۰ کاراکتر</span>
            <span class={`text-xs ${props.formState.content.length > 800 ? 'text-orange-500' :
              props.formState.content.length < 10 ? 'text-red-500' : 'text-gray-500'
              }`}>
              {props.formState.content.length}/1000
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
            onChange$={props.onFileSelect}
            class="w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />

          {/* پیش‌نمایش عکس */}
          {props.previewUrl && (
            <div class="mt-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p class="text-sm text-green-700 mb-2">پیش‌نمایش عکس:</p>
              <img
                src={props.previewUrl}
                alt="Preview"
                class="w-32 h-32 object-cover rounded-lg border border-green-300"
              />
            </div>
          )}
        </div>

        {/* دکمه‌های اقدام */}
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick$={props.onResetForm}
            class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium border border-gray-300"
          >
            پاک کردن فرم
          </button>
          <button
            onClick$={props.onSubmit}
            disabled={!isFormValid()}
            class={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse shadow-md hover:shadow-lg
                ${!isFormValid()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
          >
            {props.isActionLoading ? (
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
  );
});