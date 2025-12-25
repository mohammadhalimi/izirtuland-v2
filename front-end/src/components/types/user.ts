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
  product: {
    _id: string;
    name: string;
    packageSize: string;
  };
  quantity: number;
  price: number;
  brand?: string;
  name?: string;
  packageSize?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: 'iscompleted' | 'paid' | 'failed';
  orderNumber: string;
  name:string;
  address:string;
  phone:string;
}

export interface UserStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}
export interface Notification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning' | 'confirm';
    message: string;
    title: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface CheckoutItem {
    address: any;
    id: string;
    name: string;
    brand: string;
    model: string;
    image: string;
    packageSize: string;
    price: number;
    quantity: number;
}

