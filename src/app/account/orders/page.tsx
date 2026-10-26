'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StoreLayout from '@/components/StoreLayout';
import { useAuth } from '@/context/AuthContext';
import { ordersService } from '@/lib/services/orders.service';
import { Order } from '@/types';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      // If demo user is logged in, show their orders, else show all orders for this demo
      const res = await ordersService.getOrders(user?.id);
      setOrders(res);
      setLoading(false);
    }
    loadOrders();
  }, [user]);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="border-b border-[#E8E2D9] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Client Archive</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
              Order History & Tracking
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Trace hand-pressed garments currently in transit or delivered to your doorstep.
            </p>
          </div>
          <Link
            href="/account"
            className="text-xs uppercase tracking-wider font-semibold text-[#0047AB] hover:underline"
          >
            ← Back to Profile
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
            Querying workshop dispatch logs...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#E8E2D9] rounded p-16 text-center space-y-4 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl text-[#1A1A1A]">No orders found</h2>
            <p className="text-xs text-[#6B6B6B]">
              You haven&apos;t placed any wardrobe orders yet. Explore our current season catalog.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#0047AB] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColors: Record<string, string> = {
                Processing: 'bg-amber-100 text-amber-900 border-amber-300',
                Shipped: 'bg-blue-100 text-[#0047AB] border-blue-300',
                Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                Cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
              };

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#E8E2D9] rounded overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b border-[#E8E2D9] flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-[#6B6B6B] block">Order Ref:</span>
                        <span className="font-mono font-bold text-[#1A1A1A]">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#6B6B6B] block">Date Placed:</span>
                        <span className="font-medium text-[#1A1A1A]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6B6B6B] block">Total Amount:</span>
                        <span className="font-bold text-[#0047AB]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded border ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 sm:p-6 divide-y divide-[#E8E2D9]/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-14 h-18 bg-[#FAF7F2] rounded overflow-hidden border border-[#E8E2D9] flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#0047AB]"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-[#6B6B6B] mt-0.5">
                              Size: <span className="font-semibold text-[#1A1A1A]">{item.size}</span> • Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#1A1A1A]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Info */}
                  <div className="p-4 bg-white border-t border-[#E8E2D9] text-[11px] text-[#6B6B6B] flex flex-wrap justify-between items-center gap-2">
                    <p>
                      Shipped to: <span className="font-medium text-[#1A1A1A]">{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                    </p>
                    <p>Payment: {order.paymentMethod}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
