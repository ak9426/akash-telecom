export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket';

export type PaymentStatus = 'pending' | 'verified' | 'unpaid' | 'paid_on_delivery';

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  regularPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  stock: number;
  lowStockAlert: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  colors: string[];
  warranty: string;
  boxContents: string[];
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description: string;
  image: string;
  subcategories: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  cityArea: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryMethod: 'inside_dhaka' | 'outside_dhaka' | 'express_dhaka';
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  senderNumber?: string;
  orderStatus: OrderStatus;
  courierService?: 'Pathao' | 'Steadfast' | 'RedX' | 'Sundarban';
  courierTrackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  active: boolean;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  district: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface WebsiteSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  announcementText: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  deliveryFeeExpressDhaka: number;
  freeDeliveryThreshold: number;
  bkashMerchantNumber: string;
  bkashType: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  returnPolicyDays: number;
  warrantyPolicy: string;
  courierPartners: string[];
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district?: string;
  address?: string;
  createdAt: string;
}
