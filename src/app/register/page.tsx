'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-[#E8E2D9] rounded p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
              Patron Registration
            </p>
            <h1 className="font-serif text-3xl text-[#1A1A1A] font-normal tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-[#6B6B6B]">
              Join the Clothing Corp. directory for seamless checkout and bespoke care advice.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="radhika@example.com"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0047AB] hover:bg-[#003580] text-white py-3 rounded text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Register Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E8E2D9] text-xs text-[#6B6B6B]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0047AB] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
