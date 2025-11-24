// src/components/admin/dashboard/ProductManager.tsx
import { component$, useSignal, useTask$, useStore, $ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';

interface ProductManagerProps {
  authToken: string;
}

export default component$<ProductManagerProps>(({ authToken }) => {
  const products = useSignal<Product[]>([]);
  const loading = useSignal(false);
  const showCreateForm = useSignal(false);
  const formLoading = useSignal(false);
  const error = useSignal('');
  const uploadLoading = useSignal(false);
  const previewUrl = useSignal('');
  const imageFile = useSignal<File | null>(null);

  // استفاده از useStore برای form data
  const formData = useStore({
    name: '',
    content: '',
    brand: 'Izirtu Land' as 'Izirtu Land' | 'Khak Shimi',
    price: 0,
    model: 'جامد' as 'جامد' | 'مایع',
    packageSize: '1kg' as '1kg' | '10kg' | '1litre' | '5liter' | '20litre'
  });

  // تابع ریست فرم - خارج از توابع دیگر تعریف شود
  const resetForm = $(() => {
    formData.name = '';
    formData.content = '';
    formData.brand = 'Izirtu Land';
    formData.price = 0;
    formData.model = 'جامد';
    formData.packageSize = '1kg';
    imageFile.value = null;
    previewUrl.value = '';
    console.log('🧹 فرم ریست شد');
  });

  // دریافت محصولات
  const fetchProducts = $(async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await fetch('http://localhost:5000/api/product');
      if (response.ok) {
        const data = await response.json();
        products.value = data;
      } else {
        error.value = 'خطا در دریافت محصولات';
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور';
    } finally {
      loading.value = false;
    }
  });

  // آپلود عکس
  const handleImageUpload = $(async (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      error.value = 'لطفاً فقط فایل تصویری انتخاب کنید';
      return;
    }

    // بررسی حجم فایل (5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'حجم فایل نباید بیشتر از ۵ مگابایت باشد';
      return;
    }

    uploadLoading.value = true;
    error.value = '';

    try {
      imageFile.value = file;

      // ایجاد پیش‌نمایش
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
        uploadLoading.value = false;
      };
      reader.onerror = () => {
        error.value = 'خطا در بارگذاری عکس';
        uploadLoading.value = false;
      };
      reader.readAsDataURL(file);

    } catch (err) {
      error.value = 'خطا در پردازش عکس';
      uploadLoading.value = false;
    } finally {
      fileInput.value = '';
    }
  });

  // ایجاد محصول جدید - بدون resetForm داخلی
  const createProduct = $(async () => {
    console.log('🟢 شروع ایجاد محصول...');
    formLoading.value = true;
    error.value = '';

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('model', formData.model);
      formDataToSend.append('packageSize', formData.packageSize);

      if (imageFile.value) {
        formDataToSend.append('image', imageFile.value);
        console.log('📸 فایل عکس اضافه شد');
      }

      console.log('📤 ارسال درخواست به سرور...');

      const response = await fetch('http://localhost:5000/api/product/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      console.log('📨 وضعیت پاسخ:', response.status, response.statusText);

      // اگر پاسخ موفقیت‌آمیز بود
      if (response.ok) {
        const result = await response.json();
        console.log('✅ پاسخ موفق:', result);

        products.value = [result.product, ...products.value];
        showCreateForm.value = false;

        // استفاده از resetForm که در scope全局 تعریف شده
        resetForm();

        error.value = '✅ محصول با موفقیت ایجاد شد';

        // پاک کردن پیام موفقیت بعد از ۳ ثانیه
        setTimeout(() => {
          if (error.value === '✅ محصول با موفقیت ایجاد شد') {
            error.value = '';
          }
        }, 3000);
      }
      // اگر پاسخ خطا بود
      else {
        console.log('❌ پاسخ خطا از سرور');
        try {
          const errorData = await response.json();
          console.log('📋 جزئیات خطا:', errorData);
          error.value = errorData.message || `خطا: ${response.status}`;
        } catch (parseError) {
          console.log('❌ خطا در پارس پاسخ JSON');
          error.value = `خطای سرور: ${response.status} - ${response.statusText}`;
        }
      }
    } catch (err: any) {
      // این فقط برای خطاهای شبکه اجرا می‌شود
      console.error('🌐 خطای شبکه:', err);
      error.value = `خطا در ارتباط با سرور: ${err.message}`;
    } finally {
      formLoading.value = false;
      console.log('🏁 پایان عملیات ایجاد محصول');
    }
  });

  // حذف محصول
  const deleteProduct = $(async (productId: string) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        products.value = products.value.filter(p => p._id !== productId);
        error.value = '✅ محصول با موفقیت حذف شد';

        setTimeout(() => {
          if (error.value === '✅ محصول با موفقیت حذف شد') {
            error.value = '';
          }
        }, 3000);
      } else {
        error.value = 'خطا در حذف محصول';
      }
    } catch (err) {
      error.value = 'خطا در ارتباط با سرور';
    }
  });

  // دریافت محصولات هنگام لود کامپوننت
  useTask$(() => {
    fetchProducts();
  });

  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
const truncateContent = (content: string, maxLength: number = 10) => {
  if (!content || content.length === 0) return 'بدون توضیحات';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};
  return (
    <div class="p-6">
      {/* هدر */}
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">مدیریت محصولات</h2>
        <button
          onClick$={() => showCreateForm.value = true}
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <span>➕</span>
          <span>محصول جدید</span>
        </button>
      </div>

      {/* نمایش خطا */}
      {error.value && (
        <div class={`p-4 rounded-lg mb-6 ${error.value.includes('✅')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              {error.value.includes('✅') ? (
                <span class="text-green-600">✅</span>
              ) : (
                <span class="text-red-600">❌</span>
              )}
              <span>{error.value}</span>
            </div>
            <button
              onClick$={() => error.value = ''}
              class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* فرم ایجاد محصول */}
      {showCreateForm.value && (
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">ایجاد محصول جدید</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* نام محصول */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                نام محصول *
              </label>
              <input
                type="text"
                value={formData.name}
                onInput$={(e) => formData.name = (e.target as HTMLInputElement).value}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="نام محصول"
              />
            </div>

            {/* قیمت */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                قیمت (تومان) *
              </label>
              <input
                type="number"
                value={formData.price}
                onInput$={(e) => formData.price = parseInt((e.target as HTMLInputElement).value) || 0}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="قیمت"
                min="1"
              />
            </div>

            {/* برند */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">برند</label>
              <select
                value={formData.brand}
                onChange$={(e) => formData.brand = (e.target as HTMLSelectElement).value as 'Izirtu Land' | 'Khak Shimi'}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Izirtu Land">Izirtu Land</option>
                <option value="Khak Shimi">Khak Shimi</option>
              </select>
            </div>

            {/* نوع محصول */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع محصول</label>
              <select
                value={formData.model}
                onChange$={(e) => formData.model = (e.target as HTMLSelectElement).value as 'جامد' | 'مایع'}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="جامد">جامد</option>
                <option value="مایع">مایع</option>
              </select>
            </div>

            {/* سایز بسته‌بندی */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">سایز بسته‌بندی</label>
              <select
                value={formData.packageSize}
                onChange$={(e) => formData.packageSize = (e.target as HTMLSelectElement).value as '1kg' | '10kg' | '1litre' | '5liter' | '20litre'}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="1kg">1 کیلوگرم</option>
                <option value="10kg">10 کیلوگرم</option>
                <option value="1litre">1 لیتر</option>
                <option value="5liter">5 لیتر</option>
                <option value="20litre">20 لیتر</option>
              </select>
            </div>

            {/* آپلود عکس */}
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">عکس محصول</label>

              {/* نمایش عکس انتخاب شده */}
              {previewUrl.value && (
                <div class="mb-3">
                  <img
                    src={previewUrl.value}
                    alt="Preview"
                    class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <div class="flex flex-col space-y-3">
                <label class="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange$={handleImageUpload}
                    class="hidden"
                    id="image-upload"
                  />
                  <div class="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-center">
                    {uploadLoading.value ? (
                      <div class="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        <span class="text-sm text-gray-600">در حال بارگذاری...</span>
                      </div>
                    ) : (
                      <span class="text-sm text-gray-600">
                        {previewUrl.value ? 'عکس انتخاب شده' : 'انتخاب عکس از کامپیوتر'}
                      </span>
                    )}
                  </div>
                </label>
              </div>

              <p class="text-xs text-gray-500 mt-1">
                می‌توانید عکس محصول را از کامپیوتر خود انتخاب کنید (حداکثر ۵ مگابایت)
              </p>
            </div>

            {/* توضیحات محصول */}
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                توضیحات محصول *
              </label>
              <textarea
                value={formData.content}
                onInput$={(e) => formData.content = (e.target as HTMLTextAreaElement).value}
                rows={4}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="توضیحات کامل محصول"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 rtl:space-x-reverse">
            <button
              onClick$={() => {
                showCreateForm.value = false;
                resetForm();
              }}
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-300"
            >
              انصراف
            </button>

            <button
              onClick$={createProduct}
              disabled={formLoading.value || !formData.name.trim() || !formData.content.trim() || formData.price <= 0}
              class={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse ${formLoading.value || !formData.name.trim() || !formData.content.trim() || formData.price <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {formLoading.value ? (
                <>
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال ایجاد...</span>
                </>
              ) : (
                <>
                  <span>➕</span>
                  <span>ایجاد محصول</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {/* لیست محصولات */}
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading.value ? (
          <div class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p class="mt-2 text-gray-600">در حال دریافت محصولات...</p>
          </div>
        ) : products.value.length === 0 ? (
          <div class="p-8 text-center">
            <div class="text-6xl mb-4">🌿</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">هنوز محصولی وجود ندارد</h3>
            <p class="text-gray-600">اولین محصول خود را ایجاد کنید</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">محصول</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">برند</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سایز</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {products.value.map((product) => (
                  <tr key={product._id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center space-x-3 rtl:space-x-reverse">
                        {product.image && (
                          <img
                            src={getFullImageUrl(product.image)}
                            alt={product.name}
                            class="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div class="text-sm font-medium text-gray-900">{product.name}</div>
                          <div class="text-sm text-gray-500 overflow-hidden">{truncateContent(product.content)}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.brand === 'Izirtu Land'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                        }`}>
                        {product.brand}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString()} تومان
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.model === 'جامد'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {product.model}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.packageSize}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick$={() => deleteProduct(product._id)}
                        class="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});