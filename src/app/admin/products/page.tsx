'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { productsService } from '@/lib/services/products.service';
import { Product, Category, ProductSize } from '@/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const SIZES: Array<ProductSize['size']> = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(3499);
  const [compareAtPrice, setCompareAtPrice] = useState(4299);
  const [category, setCategory] = useState('shirts');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({
    S: 10,
    M: 15,
    L: 12,
    XL: 8,
    XXL: 4,
    '3XL': 0,
    '4XL': 0,
  });
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [fabric, setFabric] = useState('');
  const [care, setCare] = useState('');
  const [shippingInfo, setShippingInfo] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      productsService.getProducts(undefined, 'newest', 1, 100),
      productsService.getCategories(),
    ]);
    setProducts(prods.products);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSubtitle('');
    setDescription('');
    setPrice(3499);
    setCompareAtPrice(4299);
    setCategory(categories[0]?.slug || 'shirts');
    setImage1('/images/products/oxford-shirt-blue-1.jpg');
    setImage2('/images/products/oxford-shirt-blue-2.jpg');
    setImage3('/images/products/oxford-shirt-blue-3.jpg');
    setImage4('/images/products/oxford-shirt-blue-4.jpg');
    setSizeStocks({ S: 10, M: 15, L: 12, XL: 8, XXL: 4, '3XL': 0, '4XL': 0 });
    setFeatured(false);
    setIsNew(true);
    setBestSeller(false);
    setFabric('100% natural organic cotton');
    setCare('Cold gentle wash, hang dry in shade.');
    setShippingInfo('Ships within 24 hours via express courier.');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setSubtitle(p.subtitle);
    setDescription(p.description);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || 0);
    setCategory(p.category);
    setImage1(p.images[0] || '');
    setImage2(p.images[1] || '');
    setImage3(p.images[2] || '');
    setImage4(p.images[3] || '');

    const stocks: Record<string, number> = {};
    SIZES.forEach((s) => {
      const found = p.sizes.find((item) => item.size === s);
      stocks[s] = found ? found.stock : 0;
    });
    setSizeStocks(stocks);

    setFeatured(p.featured);
    setIsNew(p.isNew);
    setBestSeller(p.bestSeller);
    setFabric(p.fabric);
    setCare(p.care);
    setShippingInfo(p.shippingInfo);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to retire this product from the atelier?')) {
      await productsService.deleteProduct(id);
      await loadData();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.slug === category);
    const categoryName = catObj ? catObj.name : 'Apparel';

    const sizesArray: ProductSize[] = SIZES.map((s) => ({
      size: s,
      stock: Number(sizeStocks[s]) || 0,
    }));

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name,
      slug: finalSlug,
      subtitle,
      description,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice) || undefined,
      category,
      categoryName,
      images: [image1, image2, image3, image4] as [string, string, string, string],
      sizes: sizesArray,
      featured,
      isNew,
      bestSeller,
      fabric,
      care,
      shippingInfo,
    };

    if (editingProduct) {
      await productsService.updateProduct(editingProduct.id, payload);
    } else {
      await productsService.createProduct(payload);
    }

    setModalOpen(false);
    await loadData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Catalogue Maintenance</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Garment Inventory & Production
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Maintain product specifications, individual size stocks, and visual assets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-[#0047AB] hover:bg-[#003580] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Garment</span>
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white border border-[#E8E2D9] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E2D9] text-[#6B6B6B] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Garment</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Stock / Sizes</th>
                <th className="py-3 px-4 font-semibold">Flags</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {products.map((p) => {
                const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-16 bg-[#FAF7F2] rounded overflow-hidden border border-[#E8E2D9] flex-shrink-0">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-[#1A1A1A]">{p.name}</p>
                          <p className="font-mono text-[10px] text-[#6B6B6B]">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#1A1A1A]">
                      {p.categoryName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <p className={`font-bold ${totalStock <= 5 ? 'text-amber-800' : 'text-emerald-700'}`}>
                        {totalStock} in stock
                      </p>
                      <p className="text-[10px] text-[#6B6B6B] mt-0.5">
                        {p.sizes.filter((s) => s.stock > 0).map((s) => s.size).join(', ') || 'Out of stock'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && (
                          <span className="px-1.5 py-0.5 bg-[#FFC83D] text-[#1A1A1A] text-[9px] font-bold uppercase rounded">
                            Featured
                          </span>
                        )}
                        {p.bestSeller && (
                          <span className="px-1.5 py-0.5 bg-[#0047AB] text-white text-[9px] font-bold uppercase rounded">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 border border-[#E8E2D9] hover:border-[#0047AB] hover:text-[#0047AB] rounded text-[#1A1A1A]"
                          aria-label="Edit product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 border border-[#E8E2D9] hover:border-red-700 hover:text-red-700 rounded text-[#1A1A1A]"
                          aria-label="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded-lg max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
                  {editingProduct ? 'Update Garment' : 'New Workshop Piece'}
                </p>
                <h2 className="font-serif text-2xl text-[#1A1A1A] font-medium mt-0.5">
                  {editingProduct ? editingProduct.name : 'Create Garment Record'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#6B6B6B] hover:text-[#1A1A1A]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                    placeholder="e.g. classic-oxford-cotton-shirt"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Subtitle Specification
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Chalk Blue • 100% Combed Cotton"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Compare-At Price (₹ Strikethrough)
                  </label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              {/* 4 Unique Image Paths */}
              <div className="border-t border-[#E8E2D9] pt-4 space-y-3">
                <p className="uppercase tracking-wider font-bold text-[#1A1A1A]">
                  Visual Gallery (4 Unique Required Views)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#6B6B6B] block mb-1">Image 1 (Front View):</label>
                    <input
                      type="text"
                      required
                      value={image1}
                      onChange={(e) => setImage1(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] block mb-1">Image 2 (Back View):</label>
                    <input
                      type="text"
                      required
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] block mb-1">Image 3 (Detail / Macro):</label>
                    <input
                      type="text"
                      required
                      value={image3}
                      onChange={(e) => setImage3(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B6B6B] block mb-1">Image 4 (Styled Editorial):</label>
                    <input
                      type="text"
                      required
                      value={image4}
                      onChange={(e) => setImage4(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Per-Size Stock */}
              <div className="border-t border-[#E8E2D9] pt-4 space-y-2">
                <p className="uppercase tracking-wider font-bold text-[#1A1A1A]">
                  Inventory by Size
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {SIZES.map((sz) => (
                    <div key={sz}>
                      <label className="block text-center font-bold text-[11px] text-[#1A1A1A] mb-1">
                        {sz}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sizeStocks[sz] || 0}
                        onChange={(e) =>
                          setSizeStocks({ ...sizeStocks, [sz]: Number(e.target.value) })
                        }
                        className="w-full text-center bg-[#FAF7F2] border border-[#E8E2D9] rounded py-1 text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div className="border-t border-[#E8E2D9] pt-4 flex flex-wrap gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="text-[#0047AB]"
                  />
                  <span className="font-semibold text-[#1A1A1A]">Featured on Home (5-grid)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="text-[#0047AB]"
                  />
                  <span className="font-semibold text-[#1A1A1A]">Mark as New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                    className="text-[#0047AB]"
                  />
                  <span className="font-semibold text-[#1A1A1A]">Mark as Best Seller</span>
                </label>
              </div>

              {/* Fabric & Care */}
              <div className="border-t border-[#E8E2D9] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Fabric Composition *
                  </label>
                  <input
                    type="text"
                    required
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                    Care Instructions *
                  </label>
                  <input
                    type="text"
                    required
                    value={care}
                    onChange={(e) => setCare(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D9] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D9] text-[#1A1A1A] rounded uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0047AB] hover:bg-[#003580] text-white rounded uppercase tracking-wider font-semibold"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
