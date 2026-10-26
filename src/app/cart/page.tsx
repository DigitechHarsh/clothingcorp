'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StoreLayout from '@/components/StoreLayout';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { cartService } from '@/lib/services/cart.service';
import { offersService } from '@/lib/services/offers.service';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartWishlist();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const totals = cartService.computeTotals(cart, discountPercent);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = await offersService.validateCoupon(couponCode);
    if (res.valid) {
      setDiscountPercent(res.discountPercent);
      setCouponMessage({ text: res.message, success: true });
    } else {
      setCouponMessage({ text: res.message, success: false });
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="border-b border-[#E8E2D9] pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Review Order</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              Shopping Bag
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs uppercase tracking-wider text-[#6B6B6B] hover:text-red-700 transition-colors"
            >
              Empty Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#E8E2D9] rounded p-16 text-center space-y-4 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl text-[#1A1A1A]">Your shopping bag is currently empty</h2>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Every garment in our catalog is loomed in deliberate, numbered batches from natural fibres.
              Explore our current collection to begin.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Items list */}
            <div className="lg:col-span-8 space-y-4">
              {/* Shipping progress notification */}
              <div className="bg-white border border-[#E8E2D9] rounded p-4 text-xs">
                {totals.amountNeededForFreeShipping > 0 ? (
                  <p className="text-[#1A1A1A]">
                    Add garments worth{' '}
                    <span className="font-bold text-[#0047AB]">
                      ₹{totals.amountNeededForFreeShipping.toLocaleString('en-IN')}
                    </span>{' '}
                    to receive complimentary nationwide shipping.
                  </p>
                ) : (
                  <p className="text-emerald-800 font-semibold">
                    ✓ Your order qualifies for complimentary express courier shipping!
                  </p>
                )}
              </div>

              {/* Items card */}
              <div className="bg-white border border-[#E8E2D9] rounded divide-y divide-[#E8E2D9]">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-24 bg-[#FAF7F2] rounded overflow-hidden flex-shrink-0 border border-[#E8E2D9]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif text-base font-medium text-[#1A1A1A] hover:text-[#0047AB]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#6B6B6B] mt-1">
                          Selected Size: <span className="font-semibold text-[#1A1A1A]">{item.size}</span>
                        </p>
                        <p className="text-xs font-semibold text-[#1A1A1A] mt-1">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8E2D9]">
                      <div className="flex items-center border border-[#E8E2D9] rounded bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-2 text-[#1A1A1A] hover:text-[#0047AB]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 text-xs font-bold min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-2 text-[#1A1A1A] hover:text-[#0047AB]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-sm font-bold text-[#1A1A1A]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-[#6B6B6B] hover:text-red-700 p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="text-xs uppercase tracking-wider font-semibold text-[#0047AB] hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Coupon card */}
              <div className="bg-white border border-[#E8E2D9] rounded p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
                  Promotional Coupon
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  Have a campaign code? Try <span className="font-mono font-bold text-[#1A1A1A]">WINTER20</span> or <span className="font-mono font-bold text-[#1A1A1A]">FIRST10</span>
                </p>
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs font-mono uppercase text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-[#0047AB] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponMessage && (
                  <p
                    className={`text-xs font-medium ${
                      couponMessage.success ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Order calculation card */}
              <div className="bg-white border border-[#E8E2D9] rounded p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] border-b border-[#E8E2D9] pb-3">
                  Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal</span>
                    <span className="text-[#1A1A1A] font-medium">
                      ₹{totals.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({discountPercent}%)</span>
                      <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Standard Shipping</span>
                    <span>
                      {totals.shipping === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                      ) : (
                        `₹${totals.shipping.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-[#E8E2D9] pt-3 flex justify-between text-sm font-bold text-[#1A1A1A]">
                    <span>Estimated Total</span>
                    <span className="text-base text-[#0047AB]">
                      ₹{totals.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href={`/checkout${discountPercent > 0 ? `?coupon=${encodeURIComponent(couponCode)}` : ''}`}
                    className="w-full flex items-center justify-center space-x-2 bg-[#0047AB] hover:bg-[#003580] text-white py-3.5 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="pt-2 text-[11px] text-[#6B6B6B] space-y-1">
                  <p>• Secure checkout simulated with demo state.</p>
                  <p>• 14-day hassle-free door-to-door exchanges.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
