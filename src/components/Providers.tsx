'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        {children}
        <CartDrawer />
        <Toast />
      </CartWishlistProvider>
    </AuthProvider>
  );
}
