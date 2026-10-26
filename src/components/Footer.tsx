'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { newsletterService } from '@/lib/services/newsletter.service';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; success?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await newsletterService.subscribe(email);
      setStatus(res);
      if (res.success) setEmail('');
    } catch {
      setStatus({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E2D9] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E8E2D9]">
          {/* Brand Blurb */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-xl tracking-tight text-[#1A1A1A] font-semibold">
              CLOTHING CORP.
            </h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-sm">
              Mindfully constructed everyday apparel and tailoring. We partner directly with historic mills
              in Okayama, Portugal, and Chanderi to craft garments of exceptional permanence from 100% natural fibres.
            </p>
            <div className="pt-2 text-xs text-[#6B6B6B] space-y-1">
              <p>Atelier & Showroom: 42 Maker Row, Ballard Estate, Mumbai 400001</p>
              <p>Inquiries: contact@clothingcorp.in • Mon–Sat, 10:00–19:00 IST</p>
            </div>
          </div>

          {/* Wardrobe / Shop links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-bold mb-4">
              Collection
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#6B6B6B]">
              <li>
                <Link href="/products?category=shirts" className="hover:text-[#0047AB] transition-colors">
                  Shirts & Knits
                </Link>
              </li>
              <li>
                <Link href="/products?category=hoodies" className="hover:text-[#0047AB] transition-colors">
                  Heavyweight Sweats
                </Link>
              </li>
              <li>
                <Link href="/products?category=jackets" className="hover:text-[#0047AB] transition-colors">
                  Tailoring & Outerwear
                </Link>
              </li>
              <li>
                <Link href="/products?category=trousers" className="hover:text-[#0047AB] transition-colors">
                  Selvedge & Trousers
                </Link>
              </li>
              <li>
                <Link href="/products?category=traditional" className="hover:text-[#0047AB] transition-colors">
                  Artisanal Handlooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-bold mb-4">
              The Brand
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#6B6B6B]">
              <li>
                <Link href="/about" className="hover:text-[#0047AB] transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0047AB] transition-colors">
                  Atelier & Contact
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#0047AB] transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#0047AB] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#0047AB] transition-colors text-[#0047AB]">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#1A1A1A] font-bold">
              The Journal
            </h4>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Bi-weekly dispatches on fabric provenance, dye baths, and early access to single-batch runs.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white text-xs font-semibold uppercase tracking-widest py-2 rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status && (
              <p
                className={`text-[11px] ${
                  status.success ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] space-y-4 sm:space-y-0">
          <p>© 2026 Clothing Corp. Demonstration Build. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Client Data in localStorage</span>
            <span>Zero Synthetic Fibres</span>
            <span>Ethical Mills</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
