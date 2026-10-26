'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { offersService } from '@/lib/services/offers.service';
import { Offer } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export default function OfferBanner() {
  const [offer, setOffer] = useState<Offer | null>(null);

  const fetchOffer = async () => {
    const active = await offersService.getActiveOffer();
    setOffer(active);
  };

  useEffect(() => {
    fetchOffer();

    const handleStorage = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.type === `storage:${STORAGE_KEYS.OFFERS}`) {
        fetchOffer();
      }
    };
    const handleReset = () => fetchOffer();

    window.addEventListener(`storage:${STORAGE_KEYS.OFFERS}`, handleStorage);
    window.addEventListener('clothingcorp_data_reset', handleReset);

    return () => {
      window.removeEventListener(`storage:${STORAGE_KEYS.OFFERS}`, handleStorage);
      window.removeEventListener('clothingcorp_data_reset', handleReset);
    };
  }, []);

  if (!offer || !offer.active) return null;

  return (
    <div className="bg-[#FAF7F2] border-b border-[#E8E2D9] py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs">
        <span className="inline-block bg-[#FFC83D] text-[#1A1A1A] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
          Seasonal Offer
        </span>
        <span className="text-[#1A1A1A] font-medium text-center">
          {offer.text}
        </span>
        <Link
          href={offer.buttonLink || '/products'}
          className="text-[#0047AB] font-bold uppercase tracking-wider hover:text-[#003580] underline underline-offset-4"
        >
          {offer.buttonText || 'Shop Now'} →
        </Link>
      </div>
    </div>
  );
}
