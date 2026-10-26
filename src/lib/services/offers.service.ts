import { Offer } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export const offersService = {
  async getOffers(): Promise<Offer[]> {
    await delay();
    storage.ensureSeeded();
    return storage.get<Offer[]>(STORAGE_KEYS.OFFERS, []);
  },

  async getActiveOffer(): Promise<Offer | null> {
    await delay();
    storage.ensureSeeded();
    const offers = storage.get<Offer[]>(STORAGE_KEYS.OFFERS, []);
    return offers.find((o) => o.active) || offers[0] || null;
  },

  async updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    await delay();
    const offers = storage.get<Offer[]>(STORAGE_KEYS.OFFERS, []);
    const idx = offers.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    if (updates.active) {
      // Deactivate others if this one is made active
      offers.forEach((o) => (o.active = false));
    }

    offers[idx] = { ...offers[idx], ...updates };
    storage.set(STORAGE_KEYS.OFFERS, offers);
    return offers[idx];
  },

  async validateCoupon(
    code: string
  ): Promise<{ valid: boolean; discountPercent: number; message: string }> {
    await delay();
    const clean = code.trim().toUpperCase();
    const offers = storage.get<Offer[]>(STORAGE_KEYS.OFFERS, []);
    const match = offers.find((o) => o.code.toUpperCase() === clean);

    if (match) {
      return {
        valid: true,
        discountPercent: match.discountPercent,
        message: `${match.discountPercent}% promotional discount applied!`,
      };
    }

    // Special fallback coupon
    if (clean === 'FIRST10') {
      return {
        valid: true,
        discountPercent: 10,
        message: '10% welcome discount applied!',
      };
    }

    return {
      valid: false,
      discountPercent: 0,
      message: 'Invalid or expired coupon code.',
    };
  },
};
