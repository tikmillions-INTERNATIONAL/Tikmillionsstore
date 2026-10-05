export type OrderStatus =
  | 'pending'
  | 'reviewing'
  | 'approved'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type UserRole = 'customer' | 'admin';

export type DeliveryTier = 'standard_2_weeks' | 'express_5_7_days';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  company?: string;
  password?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  // Address & Database details
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
  discountTier?: 'Standard' | 'Wholesale Tier 1 (10% off)' | 'VIP Studio (15% off)' | 'Contract Partner';
  totalSpent?: number;
  ordersCount?: number;
}

export interface StoreConfig {
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  supportPhone: string;
  currency: string;
  address: string;
  announcement?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Kitchen & Table' | 'Objects & Studio' | 'Textiles & Living' | 'Hardware & Tools';
  price: number;
  standardDeliveryPrice: number; // Standard 2 weeks delivery price
  expressDeliveryPrice: number;  // 5-7 days delivery price
  costPrice?: number;
  stock: number;
  minOrderQuantity: number;
  description: string;
  details: string[];
  imageUrl: string;
  status: 'active' | 'draft' | 'archived';
  leadTimeDays: number;
  options?: {
    name: string;
    choices: string[];
  };
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  selectedOption?: string;
  deliveryTier?: DeliveryTier;
  imageUrl: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  actor?: 'customer' | 'merchant' | 'owner';
}

export interface OrderRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  notes?: string;
  merchantNotes?: string;
  paymentPreference: 'invoice' | 'wire' | 'card' | 'cod';
  paymentStatus: 'unpaid' | 'invoiced' | 'paid';
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  trackingCarrier?: string;
  history: OrderTimelineEvent[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  deliveryTier?: DeliveryTier;
}
