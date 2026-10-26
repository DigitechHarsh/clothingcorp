import { Product } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { productsService } from './products.service';

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export const wishlistService = {
  async getWishlist(): Promise<string[]> {
    await delay();
    return storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
  },

  async toggleWishlist(productId: string): Promise<{ isInWishlist: boolean; wishlist: string[] }> {
    await delay();
    let wishlist = storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
    let isInWishlist: boolean;

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
      isInWishlist = false;
    } else {
      wishlist.push(productId);
      isInWishlist = true;
    }

    storage.set(STORAGE_KEYS.WISHLIST, wishlist);
    return { isInWishlist, wishlist };
  },

  async isInWishlist(productId: string): Promise<boolean> {
    await delay();
    const wishlist = storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
    return wishlist.includes(productId);
  },

  async getWishlistProducts(): Promise<Product[]> {
    await delay();
    const ids = storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
    if (ids.length === 0) return [];

    const { products } = await productsService.getProducts(undefined, 'newest', 1, 100);
    return products.filter((p) => ids.includes(p.id));
  },
};
