import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_USERS,
  SEED_OFFERS,
  SEED_ORDERS,
  SEED_TESTIMONIALS,
} from './seed-data';

export const STORAGE_KEYS = {
  PRODUCTS: 'clothingcorp_products',
  CATEGORIES: 'clothingcorp_categories',
  USERS: 'clothingcorp_users',
  CURRENT_USER: 'clothingcorp_current_user',
  ORDERS: 'clothingcorp_orders',
  OFFERS: 'clothingcorp_offers',
  CART: 'clothingcorp_cart',
  WISHLIST: 'clothingcorp_wishlist',
  NEWSLETTER: 'clothingcorp_newsletter',
  TESTIMONIALS: 'clothingcorp_testimonials',
  SEEDED: 'clothingcorp_has_seeded_v1',
} as const;

/**
 * Checks whether code is running on client browser
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Low-level storage accessor with SSR guarding and JSON safety
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[Storage] Failed to parse key "${key}":`, e);
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event for intra-tab reactive state updates
      window.dispatchEvent(new CustomEvent(`storage:${key}`, { detail: value }));
    } catch (e) {
      console.warn(`[Storage] Failed to persist key "${key}":`, e);
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent(`storage:${key}`, { detail: null }));
    } catch (e) {
      console.warn(`[Storage] Failed to remove key "${key}":`, e);
    }
  },

  /**
   * Initializes demo dataset on first application load
   */
  ensureSeeded(forceReset: boolean = false): void {
    if (!isBrowser()) return;

    const alreadySeeded = window.localStorage.getItem(STORAGE_KEYS.SEEDED);
    if (!alreadySeeded || forceReset) {
      console.info('[Storage] Seeding initial demonstration dataset...');
      this.set(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
      this.set(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
      this.set(STORAGE_KEYS.USERS, SEED_USERS);
      this.set(STORAGE_KEYS.OFFERS, SEED_OFFERS);
      this.set(STORAGE_KEYS.ORDERS, SEED_ORDERS);
      this.set(STORAGE_KEYS.TESTIMONIALS, SEED_TESTIMONIALS);

      // Default demo login session (Arjun Mehta)
      const demoUser = SEED_USERS.find((u) => u.email === 'demo@clothingcorp.com') || null;
      if (!this.get(STORAGE_KEYS.CURRENT_USER, null) || forceReset) {
        this.set(STORAGE_KEYS.CURRENT_USER, demoUser);
      }

      if (forceReset) {
        this.remove(STORAGE_KEYS.CART);
        this.remove(STORAGE_KEYS.WISHLIST);
      }

      window.localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
    }
  },

  /**
   * Complete reset of demo data for admin diagnostics
   */
  resetDemoData(): void {
    if (!isBrowser()) return;
    this.ensureSeeded(true);
    window.dispatchEvent(new Event('clothingcorp_data_reset'));
  },
};
