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