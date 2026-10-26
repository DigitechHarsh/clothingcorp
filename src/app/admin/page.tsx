'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, DashboardMetrics } from '@/lib/services/admin.service';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      const data = await adminService.getDashboardMetrics();
      setMetrics(data);
      setLoading(false);
    }
    loadMetrics();

    const handleReset = () => loadMetrics();
    window.addEventListener('clothingcorp_data_reset', handleReset);
    return () => window.removeEventListener('clothingcorp_data_reset', handleReset);
  }, []);

  if (loading || !metrics) {
    return (
      <div className="py-24 text-center text-xs uppercase tracking-widest text-[#6B6B6B]">
        Aggregating workshop telemetry...
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Processing: 'bg-amber-100 text-amber-900 border-amber-300',
    Shipped: 'bg-blue-100 text-[#0047AB] border-blue-300',
    Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
            Executive Portal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight mt-1">
            Operations & Financial Overview
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/products"
            className="bg-[#0047AB] hover:bg-[#003580] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-colors"
          >
            Manage Garments
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white border border-[#E8E2D9] hover:border-[#1A1A1A] text-[#1A1A1A] px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-colors"
          >
            Fulfill Orders
          </Link>
        </div>
      </div>

      {/* 5 Stats Cards (Clean, flat, NO icons beside headings or numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#E8E2D9] rounded p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
            Gross Revenue
          </p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">
            +18.4% vs last period
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
            Total Orders
          </p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
            {metrics.totalOrders}
          </p>
          <p className="text-[10px] text-[#6B6B6B] mt-1">
            Simulated checkout logs
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
            Pending Dispatch
          </p>
          <p className="text-2xl font-serif font-bold text-[#0047AB] mt-2">
            {metrics.processingOrders}
          </p>
          <p className="text-[10px] text-amber-700 font-medium mt-1">
            Requires atelier packaging
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
            Active Garments
          </p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
            {metrics.totalProducts}
          </p>
          <p className="text-[10px] text-[#6B6B6B] mt-1">
            Across 5 categories
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#6B6B6B] font-semibold">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-2">
            {metrics.lowStockCount}
          </p>
          <p className="text-[10px] text-[#6B6B6B] mt-1">
            Stock ≤ 5 across sizes
          </p>
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Monthly Revenue Trend */}
        <div className="lg:col-span-8 bg-white border border-[#E8E2D9] rounded p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
                Revenue Trajectory
              </p>
              <h2 className="font-serif text-xl text-[#1A1A1A] font-medium mt-0.5">
                Monthly Turnover (₹)
              </h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded text-[#6B6B6B]">
              Fiscal 2026
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.salesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cobaltGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0047AB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0047AB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" />
                <XAxis dataKey="month" stroke="#6B6B6B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#6B6B6B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E2D9',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0047AB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cobaltGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Category Performance */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D9] rounded p-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
              Product Mix
            </p>
            <h2 className="font-serif text-xl text-[#1A1A1A] font-medium mt-0.5">
              Sales by Category
            </h2>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.salesByCategory} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E2D9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} stroke="#1A1A1A" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E2D9',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#0047AB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#E8E2D9] rounded overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D9] flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0047AB] font-bold">
              Dispatch Register
            </p>
            <h2 className="font-serif text-xl text-[#1A1A1A] font-medium mt-0.5">
              Recent Atelier Orders
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-[#0047AB] hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E2D9] text-[#6B6B6B] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {metrics.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1A1A1A]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#1A1A1A]">{order.customerName}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{order.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#1A1A1A]">
                    {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                  </td>
                  <td className="py-3.5 px-4 text-[#6B6B6B]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
