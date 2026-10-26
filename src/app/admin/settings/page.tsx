'use client';

import React, { useState } from 'react';
import { adminService } from '@/lib/services/admin.service';

export default function AdminSettingsPage() {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetDemoData = async () => {
    await adminService.resetDemoData();
    setShowConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#E8E2D9] pb-6">
        <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">System Configuration</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
          Store & Diagnostics Settings
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Manage brand identifiers, default currencies, shipping parameters, and demonstration dataset control.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-semibold animate-in fade-in">
          ✓ All demonstration localStorage data (products, categories, users, orders, offers) has been reset to baseline defaults.
        </div>
      )}

      {/* Brand Profile Card */}
      <div className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8 space-y-4 text-xs">
        <h2 className="font-serif text-xl text-[#1A1A1A] font-medium border-b border-[#E8E2D9] pb-3">
          Atelier Brand Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
              Store Brand Wordmark
            </label>
            <input
              type="text"
              readOnly
              value="CLOTHING CORP."
              className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 font-serif font-bold text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
              Base Currency
            </label>
            <input
              type="text"
              readOnly
              value="INR (₹) - Indian Rupee"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
              Complimentary Shipping Threshold
            </label>
            <input
              type="text"
              readOnly
              value="₹2,500.00"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
              Storage Backend (Demo Architecture)
            </label>
            <input
              type="text"
              readOnly
              value="Browser localStorage via /lib/services abstraction"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 font-mono text-[11px] text-[#6B6B6B]"
            />
          </div>
        </div>
      </div>

      {/* System Diagnostics & Hidden Reset Data */}
      <div className="bg-white border border-rose-200 rounded p-6 sm:p-8 space-y-4 text-xs">
        <div className="border-b border-[#E8E2D9] pb-3">
          <p className="text-[10px] uppercase tracking-widest text-rose-700 font-bold">
            Maintenance & Evaluation Diagnostic
          </p>
          <h2 className="font-serif text-xl text-[#1A1A1A] font-medium mt-0.5">
            Reset Demo Data
          </h2>
        </div>

        <p className="text-[#6B6B6B] leading-relaxed">
          This option re-initializes all localStorage collections with the default single-batch catalog,
          restores sample orders, resets the active winter coupon code, and clears temporary bags and wishlists.
        </p>

        {!showConfirm ? (
          <div>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 px-5 py-2.5 rounded uppercase tracking-wider font-semibold transition-colors"
            >
              Reset All Demo Data to Factory Defaults
            </button>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded space-y-3 max-w-md">
            <p className="font-bold text-rose-900">
              Are you sure? This will overwrite modified products and test orders.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleResetDemoData}
                className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded uppercase tracking-wider font-semibold"
              >
                Yes, Reset Everything
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="bg-white border border-[#E8E2D9] px-4 py-2 rounded uppercase tracking-wider font-semibold text-[#1A1A1A]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
