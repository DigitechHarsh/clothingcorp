'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem } from '@/types';
import { cartService } from '@/lib/services/cart.service';
import { wishlistService } from '@/lib/services/wishlist.service';
import { STORAGE_KEYS } from '@/lib/storage';

interface CartWishlistContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  clearCart: () => Promise<void>;
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  toast: string | null;
  clearToast: () => void;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const items = await cartService.getCart();
      setCart(items);
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const ids = await wishlistService.getWishlist();
      setWishlist(ids);
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    refreshWishlist();

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.type === `storage:${STORAGE_KEYS.CART}`) {
        setCart(customEvent.detail || []);
      }
      if (customEvent.type === `storage:${STORAGE_KEYS.WISHLIST}`) {
        setWishlist(customEvent.detail || []);
      }
    };

    const handleDataReset = () => {
      refreshCart();
      refreshWishlist();
    };

    window.addEventListener(`storage:${STORAGE_KEYS.CART}`, handleStorageChange);
    window.addEventListener(`storage:${STORAGE_KEYS.WISHLIST}`, handleStorageChange);
    window.addEventListener('clothingcorp_data_reset', handleDataReset);

    return () => {
      window.removeEventListener(`storage:${STORAGE_KEYS.CART}`, handleStorageChange);
      window.removeEventListener(`storage:${STORAGE_KEYS.WISHLIST}`, handleStorageChange);
      window.removeEventListener('clothingcorp_data_reset', handleDataReset);
    };
  }, [refreshCart, refreshWishlist]);

  const addToCart = async (item: CartItem) => {
    const updated = await cartService.addToCart(item);
    setCart(updated);
    showToast(`Added ${item.name} (${item.size}) to your bag.`);
    setIsCartOpen(true);
  };

  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    const updated = await cartService.updateQuantity(productId, size, quantity);
    setCart(updated);
  };

  const removeFromCart = async (productId: string, size: string) => {
    const updated = await cartService.removeFromCart(productId, size);
    setCart(updated);
    showToast('Item removed from your bag.');
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  const toggleWishlist = async (productId: string) => {
    const { isInWishlist: nowIn, wishlist: updated } = await wishlistService.toggleWishlist(productId);
    setWishlist(updated);
    showToast(nowIn ? 'Added to your curated wishlist.' : 'Removed from wishlist.');
    return nowIn;
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        toast,
        clearToast: () => setToast(null),
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
}
