'use client';

import React, { Suspense } from 'react';
import MarqueeBar from '@/components/MarqueeBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <MarqueeBar />
      <Suspense fallback={<div className="h-20 bg-[#FAF7F2] border-b border-[#E8E2D9]" />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
