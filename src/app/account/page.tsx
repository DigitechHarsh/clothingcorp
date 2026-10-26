'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StoreLayout from '@/components/StoreLayout';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';

export default function AccountPage() {
  const { user, updateUser, saveAddress, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // New address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  if (!user) {
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="font-serif text-2xl text-[#1A1A1A]">Sign in Required</h1>
          <p className="text-xs text-[#6B6B6B]">Please sign in to view your profile and saved addresses.</p>
          <Link
            href="/login"
            className="inline-block bg-[#0047AB] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded"
          >
            Sign In
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name });
    setProfileMsg('Profile updated successfully.');
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !zip) return;

    const newAddr: Address = {
      fullName: user.name,
      street,
      city,
      state,
      zip,
      country: 'India',
      phone,
    };

    await saveAddress(newAddr);
    setShowAddressForm(false);
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setPhone('');
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="border-b border-[#E8E2D9] pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Patron Dashboard</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              My Profile & Addresses
            </h1>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/account/orders"
              className="text-xs uppercase tracking-wider font-semibold px-4 py-2 bg-white border border-[#E8E2D9] text-[#1A1A1A] rounded hover:border-[#0047AB]"
            >
              Order History →
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-xs uppercase tracking-wider font-semibold px-3 py-2 text-red-700 hover:bg-red-50 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Profile Info */}
          <div className="bg-white border border-[#E8E2D9] rounded p-6 space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#1A1A1A] border-b border-[#E8E2D9] pb-3">
              Personal Information
            </h2>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-[#FAF7F2]/60 border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#6B6B6B] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Role
                </label>
                <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFC83D] text-[#1A1A1A] rounded">
                  {user.role}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white py-2 rounded text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Save Profile
              </button>
              {profileMsg && <p className="text-xs text-emerald-700 font-medium">{profileMsg}</p>}
            </form>
          </div>

          {/* Right: Saved Addresses */}
          <div className="md:col-span-2 bg-white border border-[#E8E2D9] rounded p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
              <h2 className="font-serif text-lg font-medium text-[#1A1A1A]">
                Saved Shipping Destinations
              </h2>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs uppercase tracking-wider font-semibold text-[#0047AB] hover:underline"
              >
                {showAddressForm ? 'Cancel' : '+ Add Destination'}
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-4 bg-[#FAF7F2] border border-[#E8E2D9] rounded space-y-3">
                <p className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">New Address</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Street Address & Apt / Villa"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="PIN / Zip Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D9] rounded px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#0047AB] text-white px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Save Address
                </button>
              </form>
            )}

            {/* List of saved addresses */}
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 border border-[#E8E2D9] rounded bg-[#FAF7F2] text-xs space-y-1">
                    <p className="font-bold text-[#1A1A1A]">{addr.fullName}</p>
                    <p className="text-[#6B6B6B]">{addr.street}</p>
                    <p className="text-[#6B6B6B]">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-[#6B6B6B]">{addr.country}</p>
                    {addr.phone && <p className="text-[#1A1A1A] font-medium pt-1">Tel: {addr.phone}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B6B6B]">No saved addresses yet.</p>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
