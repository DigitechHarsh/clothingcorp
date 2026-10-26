'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StoreLayout from '@/components/StoreLayout';
import OfferBanner from '@/components/home/OfferBanner';
import ProductCard from '@/components/ProductCard';
import { productsService } from '@/lib/services/products.service';
import { Product, Category, Testimonial } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function loadData() {
      const [feat, news, best, cats] = await Promise.all([
        productsService.getFeaturedProducts(5),
        productsService.getNewArrivals(4),
        productsService.getBestSellers(4),
        productsService.getCategories(),
      ]);
      setFeaturedProducts(feat);
      setNewArrivals(news);
      setBestSellers(best);
      setCategories(cats);
      setTestimonials(storage.get<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []));
    }
    loadData();

    const handleReset = () => loadData();
    window.addEventListener('clothingcorp_data_reset', handleReset);
    return () => window.removeEventListener('clothingcorp_data_reset', handleReset);
  }, []);

  return (
    <StoreLayout>
      {/* 3. Offer Banner */}
      <OfferBanner />

      {/* 4. Hero Banner */}
      <section className="border-b border-[#E8E2D9] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 bg-white border border-[#E8E2D9] rounded text-[11px] uppercase tracking-widest text-[#0047AB] font-bold">
                Batch 04 • Autumn & Winter Delivery
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] leading-[1.1] font-normal tracking-tight">
                Clothing built for permanence, cut from <span className="italic font-serif">pure unadulterated fibres</span>.
              </h1>
              <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed max-w-xl">
                We develop single-vendor wardrobe staples without synthetic compromise: 520 GSM loopback fleece,
                two-ply Portuguese Oxford cloth, and shuttle-loomed Japanese selvedge.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/products"
                  className="bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-xs"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/about"
                  className="bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] border border-[#E8E2D9] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors"
                >
                  Our Philosophy
                </Link>
              </div>
              <div className="pt-6 border-t border-[#E8E2D9] grid grid-cols-3 gap-6 text-xs text-[#6B6B6B]">
                <div>
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider">100% Traceable</p>
                  <p className="mt-0.5">Mill-direct provenance</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Zero Polyester</p>
                  <p className="mt-0.5">Natural botanical fibres</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider">Single-Vendor</p>
                  <p className="mt-0.5">Uniform atelier standards</p>
                </div>
              </div>
            </div>

            {/* Right Column: Large Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] w-full rounded overflow-hidden border border-[#E8E2D9] bg-white shadow-sm">
                <Image
                  src="/images/banners/hero-banner.jpg"
                  alt="Clothing Corp. Autumn/Winter structured overshirt editorial"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded border border-[#E8E2D9] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold">Featured Garment</p>
                    <p className="font-serif text-sm text-[#1A1A1A] font-medium">Bespoke Workshop Overshirt</p>
                  </div>
                  <Link
                    href="/products"
                    className="text-xs uppercase tracking-wider font-bold text-[#0047AB] hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Products Section: 5 per row on desktop */}
      <section className="py-16 border-b border-[#E8E2D9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Curated Selection</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
                Featured Wardrobe Staples
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#0047AB] transition-colors"
            >
              View All Featured ({featuredProducts.length}) →
            </Link>
          </div>

          {/* Responsive grid: 2 on mobile, 3 on tablet, 5 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Shop By Category */}
      <section className="py-16 border-b border-[#E8E2D9] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Directories</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-2">
              Structured silhouettes, dense loopbacks, and heirloom handlooms grouped by craft.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative block aspect-[3/4] rounded overflow-hidden border border-[#E8E2D9] bg-white"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-serif text-base font-medium">{cat.name}</h3>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    {cat.itemCount || 0} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Split Banner */}
      <section className="border-b border-[#E8E2D9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF7F2] border border-[#E8E2D9] rounded p-6 sm:p-10">
            <div className="lg:col-span-5 relative aspect-[4/3] rounded overflow-hidden border border-[#E8E2D9]">
              <Image
                src="/images/banners/split-banner-promo.jpg"
                alt="Woven textiles and tailoring studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="lg:col-span-7 space-y-4 lg:pl-6">
              <span className="inline-block bg-[#FFC83D] text-[#1A1A1A] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded">
                The Workshop Journal
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
                Why we reject polyester, elastane, and disposable trends.
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Synthetic fibres shed microplastics with every rinse and decay into foul odours within a season.
                Every garment at Clothing Corp. is woven solely from plant-based staples, cruelty-free silks,
                and virgin animal wools that breathe naturally and age with dignity.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                >
                  Read the Fabric Standard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 border-b border-[#E8E2D9] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Latest Deliveries</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#0047AB] transition-colors"
            >
              Browse All New Releases →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 border-b border-[#E8E2D9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Enduring Provenance</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#0047AB] transition-colors"
            >
              View Full Archive →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials: Clean, editorial, text-only without slop avatar icons */}
      <section className="py-16 border-b border-[#E8E2D9] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Client Reflections</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              Words from our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#E8E2D9] rounded p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex space-x-1 mb-4 text-[#FFC83D]">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <blockquote className="font-serif text-base text-[#1A1A1A] leading-relaxed italic">
                    “{t.quote}”
                  </blockquote>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8E2D9]">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">{t.author}</p>
                  <p className="text-[11px] text-[#6B6B6B]">{t.role} • {t.city}</p>
                  <p className="text-[11px] text-[#0047AB] font-medium mt-1">Purchased: {t.productName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
