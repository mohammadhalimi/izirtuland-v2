export interface OrderItem {
  product: {
    _id: string;
    name: string;
    packageSize: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name?: string;
    phone: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: 'iscompleted' | 'paid' | 'failed';
  createdAt: string;
}
