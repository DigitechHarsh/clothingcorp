'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { productsService } from '@/lib/services/products.service';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    const data = await productsService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('/images/categories/cat-shirts.jpg');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await productsService.deleteCategory(id);
      await loadCategories();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      await productsService.updateCategory(editingCategory.id, {
        name,
        slug: finalSlug,
        description,
        image,
      });
    } else {
      await productsService.createCategory({
        name,
        slug: finalSlug,
        description,
        image,
      });
    }

    setModalOpen(false);
    await loadCategories();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Taxonomy & Navigation</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Wardrobe Categories
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Organize customer navigation tiles, product classification, and filter sidebars.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-[#0047AB] hover:bg-[#003580] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E8E2D9] rounded overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-[#FAF7F2] border-b border-[#E8E2D9]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold uppercase text-[#1A1A1A]">
                    {cat.itemCount || 0} Garments
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">
                      {cat.name}
                    </h3>
                    <span className="font-mono text-[11px] text-[#6B6B6B] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D9]">
                      /{cat.slug}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 bg-white border border-[#E8E2D9] hover:border-[#0047AB] hover:text-[#0047AB] rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-1.5 bg-white border border-[#E8E2D9] hover:border-red-700 hover:text-red-700 rounded text-xs uppercase tracking-wider font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
              <h2 className="font-serif text-xl font-medium text-[#1A1A1A]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#6B6B6B]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
                  placeholder="e.g. knitwear"
                />
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
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D9] rounded px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E2D9] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0047AB] text-white rounded uppercase tracking-wider font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
