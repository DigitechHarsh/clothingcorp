'use client';

import React, { useState } from 'react';
import StoreLayout from '@/components/StoreLayout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
            Atelier Directory
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Connect with our Workshop
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Whether inquiring about bespoke sizing, fabric provenance, or arranging an appointment at our Mumbai showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Flagship Atelier</p>
                <p className="font-serif text-lg text-[#1A1A1A] font-medium mt-1">Clothing Corp. Ballard Estate</p>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  42 Maker Row, Ballard Estate<br />
                  Fort, Mumbai, Maharashtra 400001<br />
                  Republic of India
                </p>
              </div>

              <div className="border-t border-[#E8E2D9] pt-4">
                <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Visiting Hours</p>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Monday to Saturday: 10:30 – 19:30 IST<br />
                  Sunday: Closed for loom maintenance
                </p>
              </div>

              <div className="border-t border-[#E8E2D9] pt-4 space-y-2 text-xs">
                <div>
                  <span className="text-[#6B6B6B] block">Direct Electronic Mail:</span>
                  <a href="mailto:contact@clothingcorp.in" className="font-medium text-[#0047AB] hover:underline">
                    contact@clothingcorp.in
                  </a>
                </div>
                <div>
                  <span className="text-[#6B6B6B] block">Atelier Concierge:</span>
                  <span className="font-medium text-[#1A1A1A]">+91 22 2261 4800</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <p className="font-serif text-2xl text-[#1A1A1A]">Dispatch Received</p>
                  <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
                    Thank you, {name}. Your inquiry has been routed to our atelier staff. A team member will respond within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-4 bg-[#0047AB] text-white px-5 py-2 text-xs uppercase tracking-widest font-semibold rounded"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-serif text-xl text-[#1A1A1A] font-medium border-b border-[#E8E2D9] pb-3">
                    Inquiry Dispatch
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                    >
                      <option>Product & Sizing Inquiry</option>
                      <option>Order & Dispatch Support</option>
                      <option>Atelier Appointment Booking</option>
                      <option>Fabric & Sustainability Provenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe your garment question or inquiry details..."
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
