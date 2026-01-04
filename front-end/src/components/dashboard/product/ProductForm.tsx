// src/components/admin/dashboard/product-manager/ProductForm.tsx
import { component$ } from '@builder.io/qwik';
import type { ProductFormProps } from '~/components/types/product';

export const ProductForm = component$<ProductFormProps>((props) => {
  const isEdit = props.mode === 'edit';

  return (
    <div class={`bg-white rounded-2xl shadow-lg border p-6 mb-6 ${isEdit ? 'border-blue-200' : 'border-green-200'}`}>
      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800">
          {isEdit ? 'ویرایش محصول' : 'ایجاد محصول جدید'}
        </h3>
        {isEdit && (
          <div class="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <span class={`px-2 py-1 rounded-full text-xs ${isEdit ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              در حال ویرایش
            </span>
            <button
              onClick$={props.onCancel}
              class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نام محصول *
          </label>
          <input
            type="text"
            value={props.formData.name}
            onInput$={(e) => {
              const target = e.target as HTMLInputElement;
              props.onNameChange(target.value);
            }}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
            placeholder="نام محصول"
          />
        </div>

        {/* Price */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            قیمت (تومان) *
          </label>
          <input
            type="number"
            value={props.formData.price}
            onInput$={(e) => {
              const target = e.target as HTMLInputElement;
              props.onPriceChange(parseInt(target.value) || 0);
            }}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
            placeholder="قیمت"
            min="1"
          />
          {!isEdit && (
            <p class="px-2 pt-2 text-red-700">{props.formData.price.toLocaleString()}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">برند</label>
          <select
            value={props.formData.brand}
            onChange$={(e) => {
              const target = e.target as HTMLSelectElement;
              props.onBrandChange(target.value as 'Izirtu Land' | 'Khak Shimi');
            }}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
          >
            <option value="Izirtu Land">Izirtu Land</option>
            <option value="Khak Shimi">Khak Shimi</option>
          </select>
        </div>

        {/* Model */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع محصول</label>
          <select
            value={props.formData.model}
            onChange$={(e) => {
              const target = e.target as HTMLSelectElement;
              props.onModelChange(target.value as 'جامد' | 'مایع');
            }}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
          >
            <option value="جامد">جامد</option>
            <option value="مایع">مایع</option>
          </select>
        </div>

        {/* Package Size */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">سایز بسته‌بندی</label>
          <select
            value={props.formData.packageSize}
            onChange$={(e) => {
              const target = e.target as HTMLSelectElement;
              props.onPackageSizeChange(target.value as '1kg' | '10kg' | '1litre' | '5liter' | '20litre');
            }}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
          >
            <option value="1kg">1 کیلوگرم</option>
            <option value="10kg">10 کیلوگرم</option>
            <option value="1litre">1 لیتر</option>
            <option value="5liter">5 لیتر</option>
            <option value="20litre">20 لیتر</option>
          </select>
        </div>

        {/* Image Upload */}
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">عکس محصول</label>

          {/* Current Image */}
          {isEdit && props.productToEdit?.image && !props.previewUrl && (
            <div class="mb-3">
              <p class="text-xs text-gray-500 mb-1">عکس فعلی:</p>
              <img
                src={props.productToEdit.image}
                alt={props.productToEdit.name}
                width={20}
                height={20}
                class="w-20 h-20 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* Preview Image */}
          {props.previewUrl && (
            <div class="mb-3">
              <p class="text-xs text-gray-500 mb-1">{isEdit ? 'عکس جدید:' : 'عکس انتخاب شده:'}</p>
              <img
                src={props.previewUrl}
                alt="Preview"
                width={32}
                height={32}
                class="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div class="flex flex-col space-y-3">
            <label class="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange$={props.onImageUpload}
                class="hidden"
                id={`image-upload-${props.mode}`}
              />
              <div class="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-center">
                {props.uploadLoading ? (
                  <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <div class={`animate-spin rounded-full h-4 w-4 border-b-2 ${isEdit ? 'border-blue-600' : 'border-green-600'}`}></div>
                    <span class="text-sm text-gray-600">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <span class="text-sm text-gray-600">
                    {props.previewUrl ? (isEdit ? 'تغییر عکس' : 'عکس انتخاب شده') : 'انتخاب عکس از کامپیوتر'}
                  </span>
                )}
              </div>
            </label>
          </div>

          <p class="text-xs text-gray-500 mt-1">
            {isEdit 
              ? props.previewUrl 
                ? 'عکس جدید جایگزین عکس فعلی می‌شود' 
                : 'در صورت عدم انتخاب عکس جدید، عکس فعلی حفظ می‌شود'
              : 'می‌توانید عکس محصول را از کامپیوتر خود انتخاب کنید (حداکثر ۵ مگابایت)'
            }
          </p>
        </div>

        {/* Content */}
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            توضیحات محصول *
          </label>
          <textarea
            value={props.formData.content}
            onInput$={(e) => {
              const target = e.target as HTMLTextAreaElement;
              props.onContentChange(target.value);
            }}
            rows={4}
            class={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isEdit ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-green-500 focus:border-green-500'}`}
            placeholder="توضیحات کامل محصول"
          />
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-end space-x-3">
        <button
          onClick$={props.onCancel}
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-300"
        >
          انصراف
        </button>

        <button
          onClick$={props.onSubmit}
          disabled={props.formLoading || !props.formData.name.trim() || !props.formData.content.trim() || props.formData.price <= 0}
          class={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
            props.formLoading || !props.formData.name.trim() || !props.formData.content.trim() || props.formData.price <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : `${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white`
          }`}
        >
          {props.formLoading ? (
            <>
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEdit ? 'در حال به‌روزرسانی...' : 'در حال ایجاد...'}</span>
            </>
          ) : (
            <>
              {isEdit ? (
                <>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ذخیره تغییرات</span>
                </>
              ) : (
                <>
                  <span>➕</span>
                  <span>ایجاد محصول</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
});