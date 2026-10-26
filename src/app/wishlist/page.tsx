'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StoreLayout from '@/components/StoreLayout';
import ProductCard from '@/components/ProductCard';
import { wishlistService } from '@/lib/services/wishlist.service';
import { Product } from '@/types';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function WishlistPage() {
  const { wishlist } = useCartWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistItems() {
      setLoading(true);
      const items = await wishlistService.getWishlistProducts();
      setProducts(items);
      setLoading(false);
    }
    loadWishlistItems();
  }, [wishlist]);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="border-b border-[#E8E2D9] pb-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Personal Archive</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Curated Wishlist ({products.length})
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Garments saved for thoughtful consideration. Stored locally on your current device.
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
            Loading your saved pieces...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-[#E8E2D9] rounded p-16 text-center space-y-4 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl text-[#1A1A1A]">Your wishlist is currently empty</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Click the heart icon on any garment across the store to preserve it in your personal wishlist.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
