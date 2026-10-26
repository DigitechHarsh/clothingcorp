'use client';

import React from 'react';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { X } from 'lucide-react';

export default function Toast() {
  const { toast, clearToast } = useCartWishlist();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1A1A1A] text-white p-3.5 rounded shadow-lg border border-[#E8E2D9]/20 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="font-medium pr-2">{toast}</span>
      <button
        type="button"
        onClick={clearToast}
        className="text-[#6B6B6B] hover:text-white p-1"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
}
