'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Address } from '@/types';
import { authService } from '@/lib/services/auth.service';
import { STORAGE_KEYS } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User | null>;
  saveAddress: (address: Address) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const current = await authService.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error('Failed to load user session:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.type === `storage:${STORAGE_KEYS.CURRENT_USER}`) {
        setUser(customEvent.detail);
      }
    };

    const handleDataReset = () => {
      refreshUser();
    };

    window.addEventListener(`storage:${STORAGE_KEYS.CURRENT_USER}`, handleStorageChange);
    window.addEventListener('clothingcorp_data_reset', handleDataReset);

    return () => {
      window.removeEventListener(`storage:${STORAGE_KEYS.CURRENT_USER}`, handleStorageChange);
      window.removeEventListener('clothingcorp_data_reset', handleDataReset);
    };
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (name: string, email: string, password?: string) => {
    const res = await authService.register(name, email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    if (updated) setUser(updated);
    return updated;
  };

  const saveAddress = async (address: Address) => {
    const updated = await authService.saveAddress(address);
    if (updated) setUser(updated);
    return updated;
  };

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin') === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
        saveAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
