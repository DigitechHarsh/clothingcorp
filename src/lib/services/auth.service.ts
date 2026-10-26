import { User, Address } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 30) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await delay();
    storage.ensureSeeded();
    return storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async login(
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay();
    storage.ensureSeeded();
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists in seeded users or previously registered
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // In demo mode: if user enters an unrecognized email, automatically create customer account
      user = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0].replace('.', ' '),
        email: cleanEmail,
        role: cleanEmail.includes('admin') ? 'admin' : 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      storage.set(STORAGE_KEYS.USERS, users);
    }

    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    return { success: true, user };
  },

  async register(
    name: string,
    email: string,
    _password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay();
    storage.ensureSeeded();
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const cleanEmail = email.trim().toLowerCase();

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      storage.set(STORAGE_KEYS.CURRENT_USER, existing);
      return { success: true, user: existing };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: cleanEmail.includes('admin') ? 'admin' : 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    storage.set(STORAGE_KEYS.CURRENT_USER, newUser);

    return { success: true, user: newUser };
  },

  async logout(): Promise<void> {
    await delay();
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    await delay();
    const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return null;

    const updated: User = { ...currentUser, ...updates };
    storage.set(STORAGE_KEYS.CURRENT_USER, updated);

    // Update in all users
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx > -1) {
      users[idx] = updated;
      storage.set(STORAGE_KEYS.USERS, users);
    }

    return updated;
  },

  async saveAddress(address: Address): Promise<User | null> {
    await delay();
    const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return null;

    const addresses = currentUser.addresses || [];
    const exists = addresses.findIndex(
      (a) => a.street === address.street && a.zip === address.zip
    );

    if (exists > -1) {
      addresses[exists] = address;
    } else {
      addresses.push(address);
    }

    return this.updateProfile({ addresses });
  },
};
