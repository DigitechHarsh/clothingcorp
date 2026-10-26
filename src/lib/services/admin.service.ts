import { Order, Product } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  processingOrders: number;
  totalProducts: number;
  lowStockCount: number;
  salesByMonth: { month: string; revenue: number; orders: number }[];
  salesByCategory: { name: string; value: number }[];
  recentOrders: Order[];
}

export const adminService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay();
    storage.ensureSeeded();

    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    // Revenue calculations (excluding cancelled orders)
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const processingOrders = orders.filter((o) => o.status === 'Processing').length;

    // Low stock items (total stock across sizes <= 5)
    const lowStockCount = products.filter((p) => {
      const sumStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
      return sumStock <= 5;
    }).length;

    // Monthly breakdown (last 6 months demo data)
    const salesByMonth = [
      { month: 'May', revenue: 42000, orders: 8 },
      { month: 'Jun', revenue: 58500, orders: 12 },
      { month: 'Jul', revenue: 74200, orders: 15 },
      { month: 'Aug', revenue: 89000, orders: 19 },
      { month: 'Sep', revenue: 112400, orders: 24 },
      { month: 'Oct', revenue: Math.max(85000, Math.round(totalRevenue)), orders: Math.max(18, totalOrders) },
    ];

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.categoryName || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + item.price * item.quantity;
      });
    });

    const salesByCategory = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // If categories are empty, supply balanced fallback for initial demo chart
    if (salesByCategory.length === 0) {
      salesByCategory.push(
        { name: 'Shirts & Knits', value: 45000 },
        { name: 'Outerwear', value: 68000 },
        { name: 'Hoodies & Sweats', value: 34000 },
        { name: 'Trousers & Denim', value: 29000 }
      );
    }

    return {
      totalRevenue,
      totalOrders,
      processingOrders,
      totalProducts: products.length,
      lowStockCount,
      salesByMonth,
      salesByCategory,
      recentOrders: orders.slice(0, 8),
    };
  },

  async resetDemoData(): Promise<void> {
    await delay();
    storage.resetDemoData();
  },
};
