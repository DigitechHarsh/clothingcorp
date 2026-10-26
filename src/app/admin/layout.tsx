'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AdminNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Categories', href: '/admin/categories' },
    { label: 'Offers & Marquee', href: '/admin/offers' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-[#E8E2D9] flex flex-col justify-between shrink-0">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-[#E8E2D9]">
          <Link href="/" className="font-serif text-xl tracking-tight text-[#1A1A1A] font-semibold block">
            CLOTHING CORP.
          </Link>
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFC83D] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider rounded">
            Atelier Staff Portal
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3.5 py-2.5 rounded text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#0047AB] text-white font-semibold'
                    : 'text-[#1A1A1A] hover:bg-[#FAF7F2] font-medium'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to storefront */}
      <div className="p-4 border-t border-[#E8E2D9] space-y-2 bg-[#FAF7F2]">
        <p className="text-[11px] text-[#6B6B6B]">
          Signed in: <span className="font-semibold text-[#1A1A1A]">{user?.email || 'admin@clothingcorp.com'}</span>
        </p>
        <Link
          href="/"
          className="block w-full text-center py-2 border border-[#E8E2D9] bg-white text-xs uppercase tracking-wider font-semibold text-[#0047AB] hover:bg-[#FAF7F2] rounded transition-colors"
        >
          ← Return to Storefront
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col lg:flex-row text-[#1A1A1A]">
      <Suspense fallback={<aside className="w-full lg:w-64 bg-white border-r border-[#E8E2D9]" />}>
        <AdminNav />
      </Suspense>
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
