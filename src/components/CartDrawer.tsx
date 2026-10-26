'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCartWishlist();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8E2D9] shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D9] bg-white flex items-center justify-between">
            <h2 className="font-serif text-lg tracking-tight text-[#1A1A1A] font-semibold">
              Shopping Bag ({cartCount})
            </h2>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-[#1A1A1A] hover:text-[#0047AB] rounded"
              aria-label="Close bag drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Shipping Threshold Progress */}
          <div className="px-5 py-3 bg-[#FAF7F2] border-b border-[#E8E2D9]">
            <p className="text-xs text-[#1A1A1A] mb-1.5 font-medium">
              {amountRemaining > 0 ? (
                <>Add <span className="font-bold text-[#0047AB]">₹{amountRemaining.toLocaleString('en-IN')}</span> for complimentary shipping</>
              ) : (
                <span className="text-emerald-700 font-bold">You have unlocked complimentary express shipping!</span>
              )}
            </p>
            <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0047AB] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <p className="font-serif text-xl text-[#1A1A1A]">Your bag is empty</p>
                <p className="text-xs text-[#6B6B6B] max-w-xs">
                  Explore our curated single-batch garments crafted with pure natural fibres.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex space-x-4 bg-white p-3 rounded border border-[#E8E2D9]"
                >
                  <div className="relative w-20 h-24 bg-[#FAF7F2] rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#0047AB] line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-[#6B6B6B] hover:text-red-700 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">
                        Size: <span className="font-semibold text-[#1A1A1A]">{item.size}</span>
                      </p>
                      <p className="text-xs font-semibold text-[#1A1A1A] mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-[#E8E2D9] rounded bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 hover:text-[#0047AB] text-[#1A1A1A]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 hover:text-[#0047AB] text-[#1A1A1A]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E2D9] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Estimated Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[#6B6B6B]">
                Taxes and promotional coupon codes applied during checkout.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full text-center py-2.5 border border-[#1A1A1A] text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:bg-[#FAF7F2] rounded transition-colors"
                >
                  View Full Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full text-center py-2.5 bg-[#0047AB] hover:bg-[#003580] text-xs uppercase tracking-widest font-semibold text-white rounded transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
