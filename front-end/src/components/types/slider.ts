import type { Product } from '~/components/types/product';

export interface ProductSliderProps {
  products: Product[];
  title?: string;
  apiBaseUrl: string;
  onAddToCart?: (product: Product) => void;
}