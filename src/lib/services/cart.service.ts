import { CartItem } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    await delay();
    return storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  async addToCart(item: CartItem): Promise<CartItem[]> {
    await delay();
    const cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    const existingIndex = cart.findIndex(
      (ci) => ci.productId === item.productId && ci.size === item.size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async updateQuantity(
    productId: string,
    size: string,
    quantity: number
  ): Promise<CartItem[]> {
    await delay();
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    if (quantity <= 0) {
      cart = cart.filter((ci) => !(ci.productId === productId && ci.size === size));
    } else {
      const item = cart.find((ci) => ci.productId === productId && ci.size === size);
      if (item) {
        item.quantity = quantity;
      }
    }
    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async removeFromCart(productId: string, size: string): Promise<CartItem[]> {
    await delay();
    let cart = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    cart = cart.filter((ci) => !(ci.productId === productId && ci.size === size));
    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async clearCart(): Promise<void> {
    await delay();
    storage.remove(STORAGE_KEYS.CART);
  },

  computeTotals(items: CartItem[], discountPercent: number = 0) {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = (subtotal * discountPercent) / 100;
    const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 250;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total,
      freeShippingThreshold: 2500,
      amountNeededForFreeShipping: Math.max(0, 2500 - subtotal),
    };
  },
};
