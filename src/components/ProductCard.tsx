'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product, ProductSize } from '@/types';
import { useCartWishlist } from '@/context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useCartWishlist();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      setShowSizePicker(true);
      return;
    }

    await addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
      size: selectedSize as ProductSize['size'],
      quantity: 1,
    });
    setShowSizePicker(false);
  };

  const handleSelectSizeAndAdd = async (sizeObj: ProductSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (sizeObj.stock <= 0) return;

    setSelectedSize(sizeObj.size);
    await addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
      size: sizeObj.size,
      quantity: 1,
    });
    setShowSizePicker(false);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[#E8E2D9] rounded overflow-hidden transition-all duration-200 hover:shadow-sm">
      {/* Product Image with Secondary Image on Hover */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-[#FAF7F2]">
        {/* Main image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition-opacity duration-300 group-hover:opacity-0"
        />
        {/* Secondary image displayed on hover */}
        <Image
          src={product.images[1] || product.images[0]}
          alt={`${product.name} detail view`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Badges: New / Sale (Yellow token) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#FFC83D] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist toggle heart button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] border border-[#E8E2D9] transition-transform hover:scale-105"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-red-600 text-red-600' : 'text-[#1A1A1A]'}
          />
        </button>

        {/* Quick Size Picker Overlay */}
        {showSizePicker && (
          <div
            className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xs p-3 border-t border-[#E8E2D9] z-20 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-semibold mb-2 text-center">
              Select Size for Bag
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {product.sizes.map((s) => {
                const inStock = s.stock > 0;
                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={!inStock}
                    onClick={(e) => handleSelectSizeAndAdd(s, e)}
                    className={`text-xs px-2.5 py-1 border rounded font-medium transition-colors ${
                      inStock
                        ? 'border-[#1A1A1A] hover:bg-[#0047AB] hover:text-white hover:border-[#0047AB] text-[#1A1A1A]'
                        : 'border-[#E8E2D9] text-[#6B6B6B]/40 line-through cursor-not-allowed bg-[#FAF7F2]'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowSizePicker(false)}
              className="mt-2 w-full text-[10px] uppercase tracking-wider text-[#6B6B6B] hover:text-[#1A1A1A] text-center"
            >
              Cancel
            </button>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B]">
            {product.categoryName}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#0047AB] line-clamp-1 mt-0.5"
          >
            {product.name}
          </Link>
          <div className="flex items-center space-x-2 mt-1.5">
            <span className="text-sm font-semibold text-[#1A1A1A]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#6B6B6B] line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="mt-3 pt-2 border-t border-[#E8E2D9]/60">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#FAF7F2] hover:bg-[#0047AB] text-[#1A1A1A] hover:text-white border border-[#E8E2D9] hover:border-[#0047AB] rounded transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
