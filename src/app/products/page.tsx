'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StoreLayout from '@/components/StoreLayout';
import ProductCard from '@/components/ProductCard';
import { productsService } from '@/lib/services/products.service';
import { Product, Category, ProductSortOption } from '@/types';
import { X, SlidersHorizontal } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'] as const;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state extracted from URL search params
  const paramCategory = searchParams.get('category') || '';
  const paramSize = searchParams.get('size') || '';
  const paramMin = searchParams.get('min') ? Number(searchParams.get('min')) : 1000;
  const paramMax = searchParams.get('max') ? Number(searchParams.get('max')) : 15000;
  const paramSort = (searchParams.get('sort') as ProductSortOption) || 'newest';
  const paramSearch = searchParams.get('search') || '';
  const paramFeatured = searchParams.get('featured') === 'true';

  // Local state for interactive sliders/inputs before URL sync
  const [minPrice, setMinPrice] = useState(paramMin);
  const [maxPrice, setMaxPrice] = useState(paramMax);

  useEffect(() => {
    setMinPrice(paramMin);
    setMaxPrice(paramMax);
  }, [paramMin, paramMax]);

  const updateFilters = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '' || (k === 'min' && v === 1000) || (k === 'max' && v === 15000)) {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push('/products');
    });
  };

  // Load products based on current parameters
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [cats, result] = await Promise.all([
          productsService.getCategories(),
          productsService.getProducts(
            {
              category: paramCategory || undefined,
              size: paramSize || undefined,
              minPrice: paramMin,
              maxPrice: paramMax,
              search: paramSearch || undefined,
              featuredOnly: paramFeatured || undefined,
            },
            paramSort,
            1,
            50
          ),
        ]);
        setCategories(cats);
        setProducts(result.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [paramCategory, paramSize, paramMin, paramMax, paramSort, paramSearch, paramFeatured]);

  const activeFiltersCount =
    (paramCategory ? 1 : 0) +
    (paramSize ? 1 : 0) +
    (searchParams.has('min') || searchParams.has('max') ? 1 : 0) +
    (paramSearch ? 1 : 0) +
    (paramFeatured ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Heading */}
      <div className="mb-8 border-b border-[#E8E2D9] pb-6">
        <p className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">
          Wardrobe Archive
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight">
              {paramCategory
                ? categories.find((c) => c.slug === paramCategory)?.name || 'Filtered Collection'
                : paramSearch
                ? `Results for "${paramSearch}"`
                : 'All Apparel & Tailoring'}
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Showing {products.length} {products.length === 1 ? 'garment' : 'garments'} crafted from natural raw materials.
            </p>
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-[#E8E2D9] bg-white rounded text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]"
            >
              <SlidersHorizontal size={14} />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-[#6B6B6B] whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={paramSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-white border border-[#E8E2D9] rounded px-3 py-2 text-xs uppercase tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
              >
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar - Desktop */}
        <aside className="hidden lg:block space-y-8">
          <div className="bg-white border border-[#E8E2D9] rounded p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-[#0047AB] hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center text-xs text-[#1A1A1A] hover:text-[#0047AB] cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={paramCategory === ''}
                    onChange={() => updateFilters({ category: null })}
                    className="mr-2.5 text-[#0047AB] focus:ring-0"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between text-xs text-[#1A1A1A] hover:text-[#0047AB] cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={paramCategory === cat.slug}
                        onChange={() => updateFilters({ category: cat.slug })}
                        className="mr-2.5 text-[#0047AB] focus:ring-0"
                      />
                      <span>{cat.name}</span>
                    </div>
                    {cat.itemCount !== undefined && (
                      <span className="text-[11px] text-[#6B6B6B]">({cat.itemCount})</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter Chips */}
            <div className="border-t border-[#E8E2D9] pt-5">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] mb-3">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((size) => {
                  const isSelected = paramSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateFilters({ size: isSelected ? null : size })}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors font-medium ${
                        isSelected
                          ? 'bg-[#0047AB] text-white border-[#0047AB]'
                          : 'bg-[#FAF7F2] text-[#1A1A1A] border-[#E8E2D9] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-[#E8E2D9] pt-5 space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">
                Price Range (₹)
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="number"
                  min="500"
                  max="20000"
                  step="500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  onBlur={() => updateFilters({ min: minPrice })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                />
                <span className="text-[#6B6B6B]">—</span>
                <input
                  type="number"
                  min="500"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onBlur={() => updateFilters({ max: maxPrice })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                />
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val);
                }}
                onMouseUp={() => updateFilters({ max: maxPrice })}
                onTouchEnd={() => updateFilters({ max: maxPrice })}
                className="w-full accent-[#0047AB] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B6B6B]">
                <span>₹1,000</span>
                <span>Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-[#FAF7F2] h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A]">
                  Filter Collection
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#1A1A1A]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category radio */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold mb-2">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-xs">
                    <input
                      type="radio"
                      name="mobile_category"
                      checked={paramCategory === ''}
                      onChange={() => updateFilters({ category: null })}
                      className="mr-2"
                    />
                    <span>All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="mobile_category"
                        checked={paramCategory === cat.slug}
                        onChange={() => updateFilters({ category: cat.slug })}
                        className="mr-2"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="border-t border-[#E8E2D9] pt-4">
                <h3 className="text-xs uppercase tracking-wider font-bold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateFilters({ size: paramSize === size ? null : size })}
                      className={`text-xs px-3 py-1 border rounded ${
                        paramSize === size
                          ? 'bg-[#0047AB] text-white'
                          : 'bg-white text-[#1A1A1A]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#0047AB] text-white py-2 text-xs uppercase tracking-wider font-bold rounded"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full border border-[#E8E2D9] text-[#1A1A1A] py-2 text-xs uppercase tracking-wider font-bold rounded"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right: Product Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
              Refining garments...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#E8E2D9] rounded p-12 text-center space-y-4">
              <p className="font-serif text-2xl text-[#1A1A1A]">No garments match your filters</p>
              <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
                Try broadening your criteria or resetting your price and size selections.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-block bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="py-20 text-center text-xs tracking-widest">Loading archive...</div>}>
        <ProductsContent />
      </Suspense>
    </StoreLayout>
  );
}
