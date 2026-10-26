'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import { useAuth } from '@/context/AuthContext';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { cartService } from '@/lib/services/cart.service';
import { ordersService } from '@/lib/services/orders.service';
import { offersService } from '@/lib/services/offers.service';
import { Address } from '@/types';
import { CheckCircle2 } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get('coupon') || '';

  const { user } = useAuth();
  const { cart, clearCart } = useCartWishlist();

  // Address form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code (Instant)');

  // Coupon
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setStreet(addr.street);
        setCity(addr.city);
        setState(addr.state);
        setZip(addr.zip);
        setPhone(addr.phone || '');
      }
    }
  }, [user]);

  useEffect(() => {
    if (initialCoupon) {
      offersService.validateCoupon(initialCoupon).then((res) => {
        if (res.valid) {
          setDiscountPercent(res.discountPercent);
          setCouponMessage(res.message);
        }
      });
    }
  }, [initialCoupon]);

  const totals = cartService.computeTotals(cart, discountPercent);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await offersService.validateCoupon(couponCode);
    if (res.valid) {
      setDiscountPercent(res.discountPercent);
      setCouponMessage(res.message);
    } else {
      setDiscountPercent(0);
      setCouponMessage(res.message);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const shippingAddress: Address = {
      fullName,
      street,
      city,
      state,
      zip,
      country: 'India',
      phone,
    };

    try {
      const order = await ordersService.createOrder({
        userId: user?.id,
        customerName: fullName,
        customerEmail: email,
        shippingAddress,
        items: [...cart],
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        total: totals.total,
        couponCode: discountPercent > 0 ? couponCode : undefined,
        status: 'Processing',
        paymentMethod,
      });

      await clearCart();
      setPlacedOrderId(order.orderNumber);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-800 font-bold">
            Order Confirmed & Logged
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Thank you, {fullName.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Your single-batch order <span className="font-mono font-bold text-[#1A1A1A]">#{placedOrderId}</span> has been dispatched to our Ballard Estate workshop for hand-pressing and packaging.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded p-6 text-left text-xs space-y-2">
          <p className="font-bold uppercase tracking-wider text-[#1A1A1A]">Dispatch Summary:</p>
          <p className="text-[#6B6B6B]">Delivery Address: {street}, {city}, {state} {zip}</p>
          <p className="text-[#6B6B6B]">Confirmation email dispatched to: {email}</p>
          <p className="text-[#6B6B6B]">Payment Method: {paymentMethod}</p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/account/orders"
            className="bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
          >
            Track in My Orders
          </Link>
          <Link
            href="/products"
            className="border border-[#E8E2D9] bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
          >
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-2xl text-[#1A1A1A]">No items to checkout</h1>
        <p className="text-xs text-[#6B6B6B]">
          Please add garments to your bag before proceeding to dispatch.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#0047AB] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-[#E8E2D9] pb-6 mb-8">
        <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Secure Dispatch</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
          Checkout & Atelier Dispatch
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Customer details & shipping */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-medium border-b border-[#E8E2D9] pb-3">
              1. Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="e.g. Arjun Mehta"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="arjun.m@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="Flat 4B, Heritage Enclave, 12th Main Rd"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="Bengaluru"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="Karnataka"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="560038"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Phone (for Delivery updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  placeholder="+91 98450 67890"
                />
              </div>
            </div>
          </div>

          {/* Payment Method selection (Demo simulation) */}
          <div className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-medium border-b border-[#E8E2D9] pb-3">
              2. Payment Method (Demo Simulation)
            </h2>

            <div className="space-y-3">
              {[
                { id: 'upi', label: 'UPI / QR Code (Instant approval)', desc: 'Pay with Google Pay, PhonePe, Paytm or any UPI client' },
                { id: 'card', label: 'Credit or Debit Card', desc: 'Visa, Mastercard, RuPay, and American Express' },
                { id: 'netbanking', label: 'Direct Net Banking', desc: 'HDFC, ICICI, SBI, Axis, Kotak' },
                { id: 'cod', label: 'Pay on Delivery (Cash / UPI)', desc: 'Inspect at delivery; complimentary zero handling fee' },
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start p-3.5 border rounded cursor-pointer transition-all ${
                    paymentMethod.includes(pm.label.split(' ')[0])
                      ? 'border-[#0047AB] bg-[#FAF7F2]'
                      : 'border-[#E8E2D9] bg-white hover:border-[#1A1A1A]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod.includes(pm.label.split(' ')[0])}
                    onChange={() => setPaymentMethod(pm.label)}
                    className="mt-0.5 mr-3 text-[#0047AB] focus:ring-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                      {pm.label}
                    </p>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Checkout Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E2D9] rounded p-6 space-y-5">
            <h2 className="font-serif text-xl text-[#1A1A1A] font-medium border-b border-[#E8E2D9] pb-3">
              Order Summary ({cart.length})
            </h2>

            {/* Items review */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-[#E8E2D9]/60">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="pt-3 first:pt-0 flex items-center space-x-3">
                  <div className="relative w-14 h-18 bg-[#FAF7F2] rounded overflow-hidden flex-shrink-0 border border-[#E8E2D9]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-xs font-semibold text-[#1A1A1A] line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#6B6B6B]">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon field */}
            <div className="border-t border-[#E8E2D9] pt-4 space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]">
                Campaign Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WINTER20"
                  className="flex-1 bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-1.5 text-xs uppercase font-mono text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#1A1A1A] hover:bg-[#0047AB] text-white px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className="text-xs text-emerald-800 font-medium">{couponMessage}</p>
              )}
            </div>

            {/* Price lines */}
            <div className="border-t border-[#E8E2D9] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Garments Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Pan-India Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                  ) : (
                    `₹${totals.shipping.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#E8E2D9] pt-3 flex justify-between text-base font-bold text-[#1A1A1A]">
                <span>Final Payable</span>
                <span className="text-lg text-[#0047AB]">
                  ₹{totals.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0047AB] hover:bg-[#003580] text-white py-3.5 px-6 rounded text-xs uppercase tracking-widest font-bold transition-colors shadow-xs disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Confirming Atelier Dispatch...' : 'Place Order & Confirm Dispatch'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="py-24 text-center text-xs">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </StoreLayout>
  );
}
