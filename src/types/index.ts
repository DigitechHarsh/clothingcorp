export type UserRole = 'admin' | 'customer';

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
}

export interface ProductSize {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL';
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string; // e.g. 'shirts', 'hoodies', 'jackets', 'trousers', 'traditional'
  categoryName: string;
  images: [string, string, string, string]; // guaranteed 4 distinct images
  sizes: ProductSize[];
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  fabric: string;
  care: string;
  shippingInfo: string;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL';
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  code: string;
  text: string;
  discountPercent: number;
  active: boolean;
  marqueeText: string;
  buttonText: string;
  buttonLink: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  city: string;
  quote: string;
  productName: string;
  rating: number;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featuredOnly?: boolean;
}

export type ProductSortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
