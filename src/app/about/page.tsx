'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StoreLayout from '@/components/StoreLayout';

export default function AboutPage() {
  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
        {/* Intro Banner */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
            Atelier Manifesto
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] font-normal leading-tight tracking-tight">
            We reject the transient cycles of fashion to pursue the permanence of honest textile engineering.
          </h1>
          <p className="text-base text-[#6B6B6B] leading-relaxed pt-2">
            Founded as an independent workshop, Clothing Corp. operates as a single-vendor house.
            We own every pattern, oversee each dye lot, and source all fibres directly from agricultural origins.
          </p>
        </div>

        {/* Section 1: Craftsmanship & Atelier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded overflow-hidden border border-[#E8E2D9] bg-white">
            <Image
              src="/images/about/about-craftsmanship.jpg"
              alt="Artisan pattern-making and cutting bench at Clothing Corp. atelier"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:col-span-6 space-y-4 lg:pl-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
              01. The Single-Vendor Principle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
              One standard of craft across the entire wardrobe.
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Most modern retailers act as aggregators, assembling garments from hundreds of anonymous third-party
              factories with conflicting sizing and erratic quality. Clothing Corp. is deliberate: every garment is
              mastered on our bespoke internal blocks. If a medium fits you in our Pima crewneck, that identical shoulder
              stance holds true in our Belgian linen blazer and selvedge denim.
            </p>
          </div>
        </div>

        {/* Section 2: Materials & Botany */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4 lg:pr-6 order-2 lg:order-1">
            <span className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
              02. Raw Botanical Fibres
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
              Zero polyester. Zero microplastic runoff.
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              We loathe petroleum-derived microplastics masquerading as performance wear. Our collection is built entirely
              on heavyweight French terry fleece, ring-spun Okayama selvedge denim, two-ply long-staple Portuguese cotton,
              and cruelty-free handloom mulberry silk. These natural fabrics absorb skin moisture, thermoregulate effortlessly,
              and gain depth of character with age.
            </p>
          </div>
          <div className="lg:col-span-6 relative aspect-[4/3] rounded overflow-hidden border border-[#E8E2D9] bg-white order-1 lg:order-2">
            <Image
              src="/images/about/about-materials.jpg"
              alt="Raw natural organic cotton and yarn spools"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Values grid */}
        <div className="border-t border-[#E8E2D9] pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#E8E2D9] p-6 rounded space-y-2">
            <p className="font-serif text-lg text-[#1A1A1A] font-medium">Single-Batch Numbering</p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              We never produce surplus inventory. Garments are cut in small, numbered runs to guarantee zero textile waste.
            </p>
          </div>
          <div className="bg-white border border-[#E8E2D9] p-6 rounded space-y-2">
            <p className="font-serif text-lg text-[#1A1A1A] font-medium">Traceable Provenance</p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Every garment label names the mill of origin, fibre yield season, and the master tailor who oversaw final finishing.
            </p>
          </div>
          <div className="bg-white border border-[#E8E2D9] p-6 rounded space-y-2">
            <p className="font-serif text-lg text-[#1A1A1A] font-medium">Lifetime Repair Guarantee</p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Button replacement, seam darning, and chain-stitch alterations are complimentary for the life of every garment.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            href="/products"
            className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
}
