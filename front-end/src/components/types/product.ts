// src/components/types/product.ts
export type Brand = 'Izirtu Land' | 'Khak Shimi' | string;
export type Model = 'جامد' | 'مایع' | string;
export type PackageSize = '1kg' | '10kg' | '1litre' | '5liter' | '20litre' | string;

export interface Product {
  _id: string;
  name: string;
  content: string;
  image?: string;
  createdAt: string;
  brand: Brand;
  price: number;
  model: Model;
  packageSize: PackageSize;
  id?: string;
}