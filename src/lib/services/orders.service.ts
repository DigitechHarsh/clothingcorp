import { Order, OrderStatus } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const delay = (ms: number = 30) => new Promise((resolve) => setTimeout(resolve, ms));

export const ordersService = {
  async getOrders(userId?: string): Promise<Order[]> {
    await delay();
    storage.ensureSeeded();
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    if (userId) {
      return orders.filter((o) => o.userId === userId);
    }
    return orders;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await delay();
    storage.ensureSeeded();
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>
  ): Promise<Order> {
    await delay();
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `CC-${randomDigits}`,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    await delay();
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    orders[index].status = status;
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },
};
