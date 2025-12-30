// src/components/admin/dashboard/product-manager/index.tsx
import { component$, useSignal, useTask$, useStore, $ } from '@builder.io/qwik';
import type { Product } from '~/components/types/product';
import { API_BASE_URL } from '~/config/api';
import { getFullImageUrl } from '~/components/function/function';
import { ProductManagerHeader } from '~/components/dashboard/product/ProductManagerHeader';
import { ErrorAlert } from '~/components/dashboard/product/ErrorAlert';
import { ProductForm } from '~/components/dashboard/product/ProductForm';
import { ProductList } from '~/components/dashboard/product/ProductList';
import { DeleteModal } from '~/components/dashboard/product/DeleteModal';

interface ProductManagerProps {
  authToken: string;
}

export default component$<ProductManagerProps>(({ authToken }) => {
  // Signals
  const products = useSignal<Product[]>([]);
  const loading = useSignal(false);
  const showCreateForm = useSignal(false);
  const formLoading = useSignal(false);
  const error = useSignal('');
  const uploadLoading = useSignal(false);
  const previewUrl = useSignal('');
  const imageFile = useSignal<File | null>(null);
  const showDeleteModal = useSignal(false);
  const productToDelete = useSignal<Product | null>(null);
  const deleteLoading = useSignal(false);
  const showEditForm = useSignal(false);
  const productToEdit = useSignal<Product | null>(null);
  const editLoading = useSignal(false);

  // Form data store
  const formData = useStore({
    name: '',
    content: '',
    brand: 'Izirtu Land' as 'Izirtu Land' | 'Khak Shimi',
    price: 0,
    model: 'جامد' as 'جامد' | 'مایع',
    packageSize: '1kg' as '1kg' | '10kg' | '1litre' | '5liter' | '20litre'
  });

  // Reset form
  const resetForm = $(() => {
    formData.name = '';
    formData.content = '';
    formData.brand = 'Izirtu Land';
    formData.price = 0;
    formData.model = 'جامد';
    formData.packageSize = '1kg';
    imageFile.value = null;
    previewUrl.value = '';
  });

  // Fetch products
  const fetchProducts = $(async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await fetch(`${API_BASE_URL}/api/product`);
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

  // Handle image upload
  const handleImageUpload = $(async (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'لطفاً فقط فایل تصویری انتخاب کنید';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'حجم فایل نباید بیشتر از ۵ مگابایت باشد';
      return;
    }

    uploadLoading.value = true;
    error.value = '';

    try {
      imageFile.value = file;

      // Create preview
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

  // Create product
  const createProduct = $(async () => {
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
      }

      const response = await fetch(`${API_BASE_URL}/api/product/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        products.value = [result.product, ...products.value];
        showCreateForm.value = false;
        resetForm();
        error.value = '✅ محصول با موفقیت ایجاد شد';

        setTimeout(() => {
          if (error.value === '✅ محصول با موفقیت ایجاد شد') {
            error.value = '';
          }
        }, 3000);
      } else {
        try {
          const errorData = await response.json();
          error.value = errorData.message || `خطا: ${response.status}`;
        } catch (parseError) {
          error.value = `خطای سرور: ${response.status} - ${response.statusText}`;
        }
      }
    } catch (err: any) {
      console.error('🌐 خطای شبکه:', err);
      error.value = `خطا در ارتباط با سرور: ${err.message}`;
    } finally {
      formLoading.value = false;
    }
  });

  // Delete product
  const deleteProduct = $(async () => {
    if (!productToDelete.value) return;

    deleteLoading.value = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/product/delete/${productToDelete.value._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        products.value = products.value.filter(p => p._id !== productToDelete.value!._id);
        error.value = '✅ محصول با موفقیت حذف شد';
        showDeleteModal.value = false;
        productToDelete.value = null;

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
    } finally {
      deleteLoading.value = false;
    }
  });

  // Open edit form
  const openEditForm = $((product: Product) => {
    productToEdit.value = product;

    // Fill form with product data
    formData.name = product.name;
    formData.content = product.content;
    formData.brand = product.brand;
    formData.price = product.price;
    formData.model = product.model;
    formData.packageSize = product.packageSize;

    // Use full URL for existing product image
    previewUrl.value = product.image ? getFullImageUrl(product.image) : '';
    imageFile.value = null;

    showEditForm.value = true;
    showCreateForm.value = false;
  });

  // Close edit form
  const closeEditForm = $(() => {
    showEditForm.value = false;
    productToEdit.value = null;
    resetForm();
  });

  // Update product
  const updateProduct = $(async () => {
    if (!productToEdit.value) return;
    editLoading.value = true;
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
      }

      const response = await fetch(`${API_BASE_URL}/api/product/update/${productToEdit.value._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        products.value = products.value.map(p =>
          p._id === productToEdit.value!._id ? result.product : p
        );

        closeEditForm();
        error.value = '✅ محصول با موفقیت به‌روزرسانی شد';

        setTimeout(() => {
          if (error.value === '✅ محصول با موفقیت به‌روزرسانی شد') {
            error.value = '';
          }
        }, 3000);
      } else {
        try {
          const errorData = await response.json();
          error.value = errorData.message || `خطا: ${response.status}`;
        } catch (parseError) {
          error.value = `خطای سرور: ${response.status} - ${response.statusText}`;
        }
      }
    } catch (err: any) {
      console.error('🌐 خطای شبکه:', err);
      error.value = `خطا در ارتباط با سرور: ${err.message}`;
    } finally {
      editLoading.value = false;
    }
  });

  // Open delete modal
  const openDeleteModal = $((product: Product) => {
    productToDelete.value = product;
    showDeleteModal.value = true;
  });

  // Close delete modal
  const closeDeleteModal = $(() => {
    showDeleteModal.value = false;
    productToDelete.value = null;
    deleteLoading.value = false;
  });

  // Handle form input
  const handleFormInput = $(
    <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
      formData[field] = value;
    }
  );

  // Fetch products on component mount
  useTask$(() => {
    fetchProducts();
  });

  return (
    <div class="p-6">
      <ProductManagerHeader
        onCreateClick={$(() => {
          showCreateForm.value = true;
        })}
      />

      <ErrorAlert message={error.value} onClose={() => error.value = ''} />

      {/* Create Form */}
      {showCreateForm.value && (
        <ProductForm
          mode="create"
          formData={formData}
          previewUrl={previewUrl.value}
          uploadLoading={uploadLoading.value}
          formLoading={formLoading.value}
          // اصلاح: از curly braces استفاده کنید تا void باشد
          onNameChange={$((value: string) => { formData.name = value; })}
          onContentChange={$((value: string) => { formData.content = value; })}
          onPriceChange={$((value: number) => { formData.price = value; })}
          onBrandChange={$((value: 'Izirtu Land' | 'Khak Shimi') => { formData.brand = value; })}
          onModelChange={$((value: 'جامد' | 'مایع') => { formData.model = value; })}
          onPackageSizeChange={$((value: '1kg' | '10kg' | '1litre' | '5liter' | '20litre') => {
            formData.packageSize = value;
          })}
          onImageUpload={handleImageUpload}
          onSubmit={createProduct}
          onCancel={$(() => {
            showCreateForm.value = false;
            resetForm();
          })}
        />
      )}

      {/* Product List */}
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <ProductList
          products={products.value}
          loading={loading.value}
          onEdit={$((product: Product) => openEditForm(product))}
          onDelete={$((product: Product) => openDeleteModal(product))}
        />
      </div>

      {/* Edit Form */}
      {showEditForm.value && productToEdit.value && (
        <ProductForm
          mode="edit"
          formData={formData}
          previewUrl={previewUrl.value}
          uploadLoading={uploadLoading.value}
          formLoading={editLoading.value}
          productToEdit={productToEdit.value}
          // همین اصلاحات را اینجا هم اعمال کنید
          onNameChange={$((value: string) => { formData.name = value; })}
          onContentChange={$((value: string) => { formData.content = value; })}
          onPriceChange={$((value: number) => { formData.price = value; })}
          onBrandChange={$((value: 'Izirtu Land' | 'Khak Shimi') => { formData.brand = value; })}
          onModelChange={$((value: 'جامد' | 'مایع') => { formData.model = value; })}
          onPackageSizeChange={$((value: '1kg' | '10kg' | '1litre' | '5liter' | '20litre') => {
            formData.packageSize = value;
          })}
          onImageUpload={handleImageUpload}
          onSubmit={updateProduct}
          onCancel={closeEditForm}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        show={showDeleteModal.value}
        product={productToDelete.value}
        loading={deleteLoading.value}
        onClose={closeDeleteModal}
        onConfirm={deleteProduct}
      />
    </div>
  );
});