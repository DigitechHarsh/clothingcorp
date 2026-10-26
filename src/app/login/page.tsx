'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setError(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setLoading(true);
    const res = await login(userEmail);
    setLoading(false);
    if (res.success) {
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-[#E8E2D9] rounded p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
              Account Authentication
            </p>
            <h1 className="font-serif text-3xl text-[#1A1A1A] font-normal tracking-tight">
              Sign In to Clothing Corp.
            </h1>
            <p className="text-xs text-[#6B6B6B]">
              Access your order history, delivery addresses, and saved pieces.
            </p>
          </div>

          {/* Quick Demo Logins for reviewers */}
          <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded space-y-2">
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]">
              Quick Demo Access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('demo@clothingcorp.com')}
                className="py-1.5 px-2 bg-white border border-[#E8E2D9] hover:border-[#0047AB] rounded text-[11px] font-semibold text-[#1A1A1A] hover:text-[#0047AB] text-center"
              >
                Customer: Arjun
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@clothingcorp.com')}
                className="py-1.5 px-2 bg-[#0047AB] hover:bg-[#003580] text-white rounded text-[11px] font-semibold text-center"
              >
                Admin Director
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                  Password
                </label>
                <span className="text-[10px] text-[#6B6B6B]">(Demo: any password)</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0047AB] hover:bg-[#003580] text-white py-3 rounded text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E8E2D9] text-xs text-[#6B6B6B]">
            New to Clothing Corp.?{' '}
            <Link href="/register" className="text-[#0047AB] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
