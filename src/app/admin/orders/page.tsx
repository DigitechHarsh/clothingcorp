'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ordersService } from '@/lib/services/orders.service';
import { Order, OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await ordersService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await ordersService.updateOrderStatus(orderId, newStatus);
    await loadOrders();
  };

  const filtered =
    filterStatus === 'All'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const statusColors: Record<OrderStatus, string> = {
    Processing: 'bg-amber-100 text-amber-900 border-amber-300',
    Shipped: 'bg-blue-100 text-[#0047AB] border-blue-300',
    Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">Fulfillment Logistics</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Customer Orders & Dispatch Status
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Update courier fulfillment stages, inspect destinations, and monitor customer orders.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E2D9] pb-4">
        {['All', ...STATUSES].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold transition-colors ${
              filterStatus === st
                ? 'bg-[#0047AB] text-white'
                : 'bg-white border border-[#E8E2D9] text-[#1A1A1A] hover:bg-[#FAF7F2]'
            }`}
          >
            {st}{' '}
            <span className="text-[10px] opacity-75">
              ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
          Retrieving fulfillment queue...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E8E2D9] rounded p-12 text-center text-xs text-[#6B6B6B]">
          No orders found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-[#E8E2D9] rounded overflow-hidden transition-all"
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#1A1A1A]">
                      <span className="font-semibold">{order.customerName}</span> ({order.customerEmail})
                    </p>
                    <p className="text-[11px] text-[#6B6B6B]">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} • {order.items.length} items • Payment: {order.paymentMethod}
                    </p>
                  </div>

                  {/* Right: Status selector & Total */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#6B6B6B]">Total Amount</p>
                      <p className="text-base font-bold text-[#0047AB]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label htmlFor={`status-${order.id}`} className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
                        Status:
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-[#FAF7F2] border border-[#E8E2D9] rounded px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#0047AB]"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="px-3 py-1.5 border border-[#E8E2D9] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#FAF7F2]"
                    >
                      {isExpanded ? 'Hide Details' : 'View Items'}
                    </button>
                  </div>
                </div>

                {/* Expanded items & destination view */}
                {isExpanded && (
                  <div className="p-5 bg-[#FAF7F2] border-t border-[#E8E2D9] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Items */}
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
                        Garments in Package:
                      </p>
                      <div className="space-y-2 divide-y divide-[#E8E2D9]/60">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="pt-2 first:pt-0 flex items-center space-x-3">
                            <div className="relative w-12 h-16 bg-white rounded overflow-hidden border border-[#E8E2D9] flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                              <p className="text-[11px] text-[#6B6B6B]">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                              <p className="text-xs font-medium text-[#1A1A1A]">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Destination Address & Summary */}
                    <div className="space-y-3 bg-white p-4 rounded border border-[#E8E2D9]">
                      <p className="font-bold uppercase tracking-wider text-[#1A1A1A]">
                        Delivery Destination:
                      </p>
                      <div className="text-[#6B6B6B] space-y-0.5">
                        <p className="font-semibold text-[#1A1A1A]">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        <p>{order.shippingAddress.country}</p>
                        {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                      </div>

                      <div className="border-t border-[#E8E2D9] pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                            <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-[#1A1A1A] pt-1 border-t border-[#E8E2D9]">
                          <span>Total Paid:</span>
                          <span className="text-[#0047AB]">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
