import { QRL } from "@builder.io/qwik";

// src/components/types/product.ts
export interface Product {
  _id: string;
  name: string;
  content: string;
  image?: string;
  createdAt: string;
  brand: 'Izirtu Land' | 'Khak Shimi';
  price: number;
  model: 'جامد' | 'مایع';
  packageSize: '1kg' | '10kg' | '1litre' | '5liter' | '20litre';
  id?: string;
}

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: QRL<(product: Product) => void>;
  onDelete: QRL<(product: Product) => void>;
}

export interface ProductFormData {
  name: string;
  content: string;
  brand: 'Izirtu Land' | 'Khak Shimi';
  price: number;
  model: 'جامد' | 'مایع';
  packageSize: '1kg' | '10kg' | '1litre' | '5liter' | '20litre';
}

export interface ProductFormProps {
  mode: 'create' | 'edit';
  formData: ProductFormData;
  previewUrl: string;
  uploadLoading: boolean;
  formLoading: boolean;
  productToEdit?: Product | null;
  // اصلاح: توابع باید QRL<void> باشند نه QRL<string>
  onNameChange: QRL<(value: string) => void>;
  onContentChange: QRL<(value: string) => void>;
  onPriceChange: QRL<(value: number) => void>;
  onBrandChange: QRL<(value: 'Izirtu Land' | 'Khak Shimi') => void>;
  onModelChange: QRL<(value: 'جامد' | 'مایع') => void>;
  onPackageSizeChange: QRL<(value: '1kg' | '10kg' | '1litre' | '5liter' | '20litre') => void>;
  onImageUpload: QRL<(event: Event) => void>;
  onSubmit: QRL<() => void>;
  onCancel: QRL<() => void>;
}

export interface DeleteModalProps {
  show: boolean;
  product: Product | null;
  loading: boolean;
  onClose: QRL<() => void>;
  onConfirm: QRL<() => void>;
}

export interface ErrorAlertProps {
  message: string;
  onClose: QRL<() => void>;
}

export interface ProductManagerHeaderProps {
  onCreateClick: QRL<() => void>;
}