'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import ProductCard from '@/components/ProductCard';
import { productsService } from '@/lib/services/products.service';
import { Product, ProductSize } from '@/types';
import { useCartWishlist } from '@/context/CartWishlistContext';
import { Heart, ChevronDown, Plus, Minus } from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addToCart, isInWishlist, toggleWishlist } = useCartWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'care' | 'shipping' | null>('fabric');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      const item = await productsService.getProductBySlug(slug);
      if (!item) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(item);
      setActiveImageIndex(0);
      setSelectedSize(null);
      setQuantity(1);
      setErrorMsg(null);

      // Load related products
      const rel = await productsService.getRelatedProducts(item.id, item.category, 4);
      setRelated(rel);
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
        Fetching garment specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#1A1A1A]">Garment Not Found</h1>
        <p className="text-sm text-[#6B6B6B]">
          The product you requested does not exist or may have been retired from the workshop catalogue.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const currentSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setErrorMsg('Please choose your size before adding to your bag.');
      return;
    }
    setErrorMsg(null);

    await addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0],
      size: selectedSize as ProductSize['size'],
      quantity,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#6B6B6B] mb-8">
        <Link href="/" className="hover:text-[#0047AB]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#0047AB]">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-[#0047AB]">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product main presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Pane: Gallery with Vertical Thumbnails & Large Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (vertical on desktop) */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] flex-shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-18 h-24 md:w-20 md:h-26 rounded overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                  activeImageIndex === idx
                    ? 'border-[#0047AB] shadow-xs'
                    : 'border-[#E8E2D9] opacity-75 hover:opacity-100'
                }`}
                aria-label={`View garment image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail view ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Main Stage Image */}
          <div className="relative aspect-[3/4] w-full bg-white rounded overflow-hidden border border-[#E8E2D9]">
            <Image
              src={product.images[activeImageIndex]}
              alt={`${product.name} view ${activeImageIndex + 1}`}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right Pane: Garment Details, Pricing, Size Selector, CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
              {product.categoryName}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-1 italic">
              {product.subtitle}
            </p>

            {/* Price display */}
            <div className="flex items-center space-x-3 mt-4">
              <span className="text-2xl font-semibold text-[#1A1A1A]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-[#6B6B6B] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Inclusive of all duties and GST</p>
          </div>

          <p className="text-sm text-[#1A1A1A] leading-relaxed border-t border-[#E8E2D9] pt-4">
            {product.description}
          </p>

          {/* Sizes Selection with Out-of-Stock handling */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="uppercase tracking-wider font-bold text-[#1A1A1A]">
                Select Size: <span className="font-semibold text-[#0047AB]">{selectedSize || 'None Selected'}</span>
              </span>
              {selectedSize && (
                <span className={`text-[11px] font-medium ${currentSizeStock <= 3 ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {currentSizeStock <= 3 ? `Only ${currentSizeStock} remaining` : 'In stock'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {product.sizes.map((s) => {
                const inStock = s.stock > 0;
                const isSelected = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={!inStock}
                    onClick={() => {
                      setSelectedSize(s.size);
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-semibold rounded border transition-all ${
                      isSelected
                        ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-xs'
                        : inStock
                        ? 'bg-white text-[#1A1A1A] border-[#E8E2D9] hover:border-[#1A1A1A]'
                        : 'bg-[#FAF7F2] text-[#6B6B6B]/40 border-[#E8E2D9] line-through cursor-not-allowed'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-700 font-medium pt-1 animate-pulse">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-[#E8E2D9] rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-[#1A1A1A] hover:text-[#0047AB]"
                  aria-label="Decrease count"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-xs font-bold text-[#1A1A1A] min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  className="p-3 text-[#1A1A1A] hover:text-[#0047AB]"
                  aria-label="Increase count"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#0047AB] hover:bg-[#003580] text-white py-3.5 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
              >
                Add to Bag
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="p-3.5 border border-[#E8E2D9] rounded bg-white hover:border-[#1A1A1A] transition-colors"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? 'fill-red-600 text-red-600' : 'text-[#1A1A1A]'}
                />
              </button>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-[#E8E2D9] divide-y divide-[#E8E2D9] pt-4">
            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full py-3.5 flex justify-between items-center text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#0047AB]"
              >
                <span>Fabric & Composition</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openAccordion === 'fabric' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'fabric' && (
                <div className="pb-4 text-xs text-[#6B6B6B] leading-relaxed">
                  <p>{product.fabric}</p>
                  <p className="mt-2 text-[#1A1A1A] font-medium">100% natural composition. No elastane, nylon blending or synthetic polyester threads.</p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                className="w-full py-3.5 flex justify-between items-center text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#0047AB]"
              >
                <span>Garment Care & Longevity</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-xs text-[#6B6B6B] leading-relaxed">
                  <p>{product.care}</p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="w-full py-3.5 flex justify-between items-center text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#0047AB]"
              >
                <span>Shipping & Returns</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="pb-4 text-xs text-[#6B6B6B] leading-relaxed">
                  <p>{product.shippingInfo}</p>
                  <p className="mt-1">Complimentary exchanges within 14 days of delivery in original unwashed condition.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#E8E2D9]">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
                Curated Pairings
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#0047AB]"
            >
              Browse All Apparel →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="py-24 text-center text-xs">Loading piece...</div>}>
        <ProductDetailContent />
      </Suspense>
    </StoreLayout>
  );
}
