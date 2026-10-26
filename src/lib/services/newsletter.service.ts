import { NewsletterSubscriber } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export const newsletterService = {
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    await delay();
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const list = storage.get<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
    if (list.some((item) => item.email.toLowerCase() === clean)) {
      return { success: true, message: 'You are already subscribed to our journal.' };
    }

    list.push({
      email: clean,
      subscribedAt: new Date().toISOString(),
    });
    storage.set(STORAGE_KEYS.NEWSLETTER, list);

    return {
      success: true,
      message: 'Thank you for subscribing to the Clothing Corp. journal.',
    };
  },

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    await delay();
    return storage.get<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
  },
};
