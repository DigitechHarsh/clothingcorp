'use client';

import React, { useEffect, useState } from 'react';
import { offersService } from '@/lib/services/offers.service';
import { Offer } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export default function MarqueeBar() {
  const [offer, setOffer] = useState<Offer | null>(null);

  const loadOffer = async () => {
    try {
      const active = await offersService.getActiveOffer();
      setOffer(active);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOffer();

    const handleStorage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.type === `storage:${STORAGE_KEYS.OFFERS}`) {
        loadOffer();
      }
    };
    const handleReset = () => loadOffer();

    window.addEventListener(`storage:${STORAGE_KEYS.OFFERS}`, handleStorage);
    window.addEventListener('clothingcorp_data_reset', handleReset);

    return () => {
      window.removeEventListener(`storage:${STORAGE_KEYS.OFFERS}`, handleStorage);
      window.removeEventListener('clothingcorp_data_reset', handleReset);
    };
  }, []);

  const marqueeText =
    offer?.marqueeText ||
    'Complimentary shipping on orders over ₹2,500 • Crafted with natural fibres • 14-day seamless exchange window';

  return (
    <div
      className="bg-[#0047AB] text-white py-2 text-xs uppercase tracking-widest overflow-hidden select-none border-b border-[#003580] z-50 relative"
      aria-label="Announcement banner"
    >
      <div className="flex w-max animate-marquee hover:cursor-pointer">
        <span className="mx-6 font-medium tracking-wider">{marqueeText}</span>
        <span className="mx-6 text-[#FFC83D]">•</span>
        <span className="mx-6 font-medium tracking-wider">{marqueeText}</span>
        <span className="mx-6 text-[#FFC83D]">•</span>
        <span className="mx-6 font-medium tracking-wider">{marqueeText}</span>
        <span className="mx-6 text-[#FFC83D]">•</span>
        <span className="mx-6 font-medium tracking-wider">{marqueeText}</span>
        <span className="mx-6 text-[#FFC83D]">•</span>
      </div>
    </div>
  );
}
