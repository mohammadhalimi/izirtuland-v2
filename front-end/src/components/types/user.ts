// src/components/user/types.ts
export interface User {
  _id: string;
  phone: string;
  name?: string;
  address?: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  packageSize: string;
  image?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  orderNumber: string;
}

export interface UserStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}