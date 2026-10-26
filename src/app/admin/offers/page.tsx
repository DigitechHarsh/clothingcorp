'use client';

import React, { useEffect, useState } from 'react';
import { offersService } from '@/lib/services/offers.service';
import { Offer } from '@/types';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const loadOffers = async () => {
    setLoading(true);
    const data = await offersService.getOffers();
    setOffers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Offer>) => {
    await offersService.updateOffer(id, updates);
    setSaveMsg('Offer details updated successfully.');
    setTimeout(() => setSaveMsg(null), 3000);
    await loadOffers();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E2D9] pb-6">
        <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Storefront Messaging</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
          Promotional Banners & Top Marquee
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Control the top continuous marquee ticker, coupon codes, and the seasonal offer banner below the storefront header.
        </p>
      </div>

      {saveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded">
          {saveMsg}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
          Loading campaign records...
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white border rounded p-6 sm:p-8 space-y-6 ${
                offer.active ? 'border-[#0047AB] shadow-xs' : 'border-[#E8E2D9]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-base text-[#1A1A1A]">{offer.code}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        offer.active ? 'bg-[#FFC83D] text-[#1A1A1A]' : 'bg-[#FAF7F2] text-[#6B6B6B]'
                      }`}
                    >
                      {offer.active ? 'Active on Storefront' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    {offer.discountPercent}% Promotional Discount
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdate(offer.id, { active: !offer.active })}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-colors ${
                    offer.active
                      ? 'bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100'
                      : 'bg-[#0047AB] text-white hover:bg-[#003580]'
                  }`}
                >
                  {offer.active ? 'Deactivate Campaign' : 'Make Active Offer'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* 1. Top Marquee Bar text */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    Top Marquee Bar Text (Scrolling Ticker):
                  </label>
                  <input
                    type="text"
                    defaultValue={offer.marqueeText}
                    onBlur={(e) => handleUpdate(offer.id, { marqueeText: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                  <p className="text-[11px] text-[#6B6B6B]">
                    Displays in the cobalt strip at the very top of all storefront pages.
                  </p>
                </div>

                {/* 2. Offer Banner text */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    Sub-Header Offer Banner Strip Text:
                  </label>
                  <input
                    type="text"
                    defaultValue={offer.text}
                    onBlur={(e) => handleUpdate(offer.id, { text: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                {/* 3. Coupon code */}
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    Coupon Code:
                  </label>
                  <input
                    type="text"
                    defaultValue={offer.code}
                    onBlur={(e) => handleUpdate(offer.id, { code: e.target.value.toUpperCase() })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 font-mono uppercase text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                {/* 4. Discount % */}
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    Discount Percentage (%):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    defaultValue={offer.discountPercent}
                    onBlur={(e) => handleUpdate(offer.id, { discountPercent: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                {/* 5. Button Label */}
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    CTA Button Label:
                  </label>
                  <input
                    type="text"
                    defaultValue={offer.buttonText}
                    onBlur={(e) => handleUpdate(offer.id, { buttonText: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
                  />
                </div>

                {/* 6. Button Link */}
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider font-bold text-[#1A1A1A]">
                    CTA Button Destination Link:
                  </label>
                  <input
                    type="text"
                    defaultValue={offer.buttonLink}
                    onBlur={(e) => handleUpdate(offer.id, { buttonLink: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
