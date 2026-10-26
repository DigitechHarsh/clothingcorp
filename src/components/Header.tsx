'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCartWishlist } from '@/context/CartWishlistContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, wishlistCount, openCart } = useCartWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8E2D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Mobile hamburger button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A1A1A] hover:text-[#0047AB] focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Left/Brand: Text Wordmark */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link
                href="/"
                className="font-serif text-2xl sm:text-2xl tracking-tight text-[#1A1A1A] hover:text-[#0047AB] transition-colors font-medium whitespace-nowrap"
              >
                CLOTHING CORP.
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-widest uppercase transition-colors relative py-1 ${
                      isActive
                        ? 'text-[#0047AB] font-semibold'
                        : 'text-[#1A1A1A] hover:text-[#0047AB]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0047AB]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#1A1A1A] hover:text-[#0047AB] transition-colors focus:outline-none"
                aria-label="Search items"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link with Badge */}
              <Link
                href="/wishlist"
                className="p-2 text-[#1A1A1A] hover:text-[#0047AB] transition-colors relative focus:outline-none"
                aria-label="View wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-[#FFC83D] text-[#1A1A1A] rounded-full px-1 border border-[#1A1A1A]/10">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger with Badge */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 text-[#1A1A1A] hover:text-[#0047AB] transition-colors relative focus:outline-none"
                aria-label="Open shopping bag"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-[#0047AB] text-white rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Account Dropdown */}
              <div className="relative" ref={accountMenuRef}>
                {user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      className="flex items-center space-x-1.5 p-1.5 text-xs tracking-wider uppercase text-[#1A1A1A] hover:text-[#0047AB] focus:outline-none border border-[#E8E2D9] rounded bg-white px-2 py-1"
                      aria-label="Account options"
                    >
                      <UserIcon size={16} />
                      <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown size={14} />
                    </button>

                    {accountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8E2D9] rounded shadow-md py-1.5 z-50 text-sm">
                        <div className="px-4 py-2 border-b border-[#E8E2D9] bg-[#FAF7F2]/60">
                          <p className="text-xs text-[#6B6B6B]">Signed in as</p>
                          <p className="font-semibold text-xs text-[#1A1A1A] truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-[#FFC83D] text-[#1A1A1A] rounded">
                              Admin Access
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0047AB] hover:bg-[#FAF7F2] transition-colors border-b border-[#E8E2D9]"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Profile & Address
                        </Link>

                        <div className="border-t border-[#E8E2D9] my-1" />
                        <button
                          type="button"
                          onClick={async () => {
                            setAccountMenuOpen(false);
                            await logout();
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-red-700 hover:bg-[#FAF7F2] transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 p-2 text-[#1A1A1A] hover:text-[#0047AB] transition-colors focus:outline-none"
                    aria-label="Login or Register"
                  >
                    <UserIcon size={20} />
                    <span className="hidden sm:inline text-xs uppercase tracking-wider font-medium ml-1">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible search bar */}
        {searchOpen && (
          <div className="border-t border-[#E8E2D9] bg-[#FAF7F2] px-4 py-3 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by keyword (e.g. Oxford, Linen, Trousers, Indigo)..."
                className="flex-1 bg-white border border-[#E8E2D9] rounded px-4 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#0047AB] hover:bg-[#003580] text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A]"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E2D9] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-sm uppercase tracking-widest rounded ${
                    isActive
                      ? 'bg-[#0047AB] text-white font-medium'
                      : 'text-[#1A1A1A] hover:bg-[#E8E2D9]/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-sm uppercase tracking-widest rounded text-[#0047AB] font-bold bg-[#FFC83D]/20 border border-[#FFC83D]/40 mt-2"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
