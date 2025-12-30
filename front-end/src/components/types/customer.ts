export interface Customer {
  _id: string;
  phone: string;
  name?: string;
  address?: string;
  createdAt: string;
  __v?: number;
}

export interface CustomerManagerProps {
  authToken: string;
}