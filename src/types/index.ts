export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface GearItem {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  brand: string;
  stock: number;
  images: string[];
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  providerId: string;
  provider?: User;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  customerId: string;
  customer?: User;
  gearItemId: string;
  gearItem?: GearItem;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  rentalOrderId: string;
  rentalOrder?: RentalOrder;
  paidAt?: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  customerId: string;
  customer?: User;
  gearItemId: string;
  gearItem?: GearItem;
  createdAt: string;
}