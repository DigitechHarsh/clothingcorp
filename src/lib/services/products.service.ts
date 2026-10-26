import { Product, Category, ProductFilters, ProductSortOption } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 30) => new Promise((resolve) => setTimeout(resolve, ms));

export const productsService = {
  async getProducts(
    filters?: ProductFilters,
    sort: ProductSortOption = 'newest',
    page: number = 1,
    limit: number = 12
  ): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    await delay();
    storage.ensureSeeded();
    let all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        all = all.filter((p) => p.category.toLowerCase() === cat);
      }
      if (filters.size) {
        all = all.filter((p) =>
          p.sizes.some((s) => s.size === filters.size && s.stock > 0)
        );
      }
      if (typeof filters.minPrice === 'number') {
        all = all.filter((p) => p.price >= filters.minPrice!);
      }
      if (typeof filters.maxPrice === 'number') {
        all = all.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        all = all.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
        );
      }
      if (filters.featuredOnly) {
        all = all.filter((p) => p.featured);
      }
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        all.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        all.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        all.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        all.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    const total = all.length;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const found = all.find((p) => p.slug === slug);
    return found || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return all.find((p) => p.id === id) || null;
  },

  async getFeaturedProducts(limit: number = 5): Promise<Product[]> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const featured = all.filter((p) => p.featured);
    return (featured.length > 0 ? featured : all).slice(0, limit);
  },

  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const sorted = [...all].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, limit);
  },

  async getBestSellers(limit: number = 4): Promise<Product[]> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const sellers = all.filter((p) => p.bestSeller);
    return (sellers.length > 0 ? sellers : all).slice(0, limit);
  },

  async getRelatedProducts(
    currentProductId: string,
    category: string,
    limit: number = 4
  ): Promise<Product[]> {
    await delay();
    storage.ensureSeeded();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const sameCat = all.filter(
      (p) => p.id !== currentProductId && p.category.toLowerCase() === category.toLowerCase()
    );
    if (sameCat.length >= limit) {
      return sameCat.slice(0, limit);
    }
    const otherCat = all.filter(
      (p) => p.id !== currentProductId && p.category.toLowerCase() !== category.toLowerCase()
    );
    return [...sameCat, ...otherCat].slice(0, limit);
  },

  async getCategories(): Promise<Category[]> {
    await delay();
    storage.ensureSeeded();
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    return categories.map((cat) => ({
      ...cat,
      itemCount: products.filter(
        (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
      ).length,
    }));
  },

  async createProduct(
    data: Omit<Product, 'id' | 'createdAt'>
  ): Promise<Product> {
    await delay();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newProduct);
    storage.set(STORAGE_KEYS.PRODUCTS, all);
    return newProduct;
  },

  async updateProduct(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    await delay();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    storage.set(STORAGE_KEYS.PRODUCTS, all);
    return all[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    await delay();
    const all = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const filtered = all.filter((p) => p.id !== id);
    if (filtered.length === all.length) return false;
    storage.set(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    await delay();
    const all = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    all.push(newCat);
    storage.set(STORAGE_KEYS.CATEGORIES, all);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    await delay();
    const all = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    storage.set(STORAGE_KEYS.CATEGORIES, all);
    return all[idx];
  },

  async deleteCategory(id: string): Promise<boolean> {
    await delay();
    const all = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const filtered = all.filter((c) => c.id !== id);
    if (filtered.length === all.length) return false;
    storage.set(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },
};
