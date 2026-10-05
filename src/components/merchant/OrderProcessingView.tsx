import React, { useState } from 'react';
import { OrderRequest, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Eye,
  ChevronRight,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

interface OrderProcessingViewProps {
  onInspectOrder: (order: OrderRequest) => void;
}

export const OrderProcessingView: React.FC<OrderProcessingViewProps> = ({ onInspectOrder }) => {
  const { orders, updateOrderStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc'>('date-desc');

  const statusTabs = [
    { id: 'all', label: 'All Requests', count: orders.length },
    {
      id: 'pending',
      label: 'Pending Review',
      count: orders.filter((o) => o.status === 'pending').length,
      alert: orders.filter((o) => o.status === 'pending').length > 0
    },
    { id: 'approved', label: 'Approved', count: orders.filter((o) => o.status === 'approved').length },
    { id: 'processing', label: 'In Production', count: orders.filter((o) => o.status === 'processing').length },
    { id: 'shipped', label: 'Dispatched', count: orders.filter((o) => o.status === 'shipped').length },
    { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length }
  ];

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q) ||
        (order.customer.company && order.customer.company.toLowerCase().includes(q)) ||
        order.items.some((it) => it.productName.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'total-desc') return b.total - a.total;
      return 0;
    });

  const handleQuickApprove = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    updateOrderStatus(orderId, 'approved', 'Quick-approved from order requests queue.');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-stone-100 rounded-xl max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono-num text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.alert
                    ? 'bg-amber-500 text-stone-950'
                    : statusFilter === tab.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, client, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Highest Total</option>
          </select>
        </div>
      </div>

      {/* Orders Table & Cards */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-base font-semibold text-stone-800">No order requests in this view</p>
          <p className="text-xs text-stone-500 mt-1">
            {statusFilter !== 'all'
              ? `No requests currently marked as "${statusFilter}".`
              : 'No orders match your search criteria.'}
          </p>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              View All Requests
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & Destination</th>
                  <th className="py-3 px-4">Requested Items</th>
                  <th className="py-3 px-4 text-right">Total & Settlement</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onInspectOrder(order)}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                    >
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono-num font-bold text-stone-900 group-hover:text-stone-700 block">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <span className="font-semibold text-stone-900 block truncate">
                          {order.customer.name}
                        </span>
                        <div className="text-[11px] text-stone-500 truncate">
                          {order.customer.company ? (
                            <span>{order.customer.company} · </span>
                          ) : null}
                          <span>{order.customer.city}, {order.customer.country}</span>
                        </div>
                      </td>

                      {/* Items previews */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 shrink-0">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.imageUrl}
                                alt={item.productName}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover ring-2 ring-white bg-stone-100 border border-stone-200"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                          <div className="min-w-0">
                            <span className="text-stone-700 font-medium truncate block max-w-[200px]">
                              {order.items[0]?.productName}
                              {order.items.length > 1 && (
                                <span className="text-stone-400 text-[11px]">
                                  {' '}+{order.items.length - 1} more ({totalUnits} pcs)
                                </span>
                              )}
                            </span>
                            <div className="mt-0.5">
                              {order.items.some((i) => i.deliveryTier === 'express_5_7_days') ? (
                                <span className="text-[10px] font-bold text-red-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded inline-block">
                                  ⚡ 5–7d Express
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded inline-block">
                                  📦 2-Weeks Standard
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono-num font-bold text-stone-900 block">
                          ${order.total.toFixed(2)}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-semibold ${
                            order.paymentStatus === 'paid'
                              ? 'text-emerald-700'
                              : order.paymentStatus === 'invoiced'
                              ? 'text-amber-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {order.paymentPreference} · {order.paymentStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold capitalize border ${
                            order.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'shipped'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : order.status === 'processing'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : order.status === 'approved'
                              ? 'bg-stone-100 text-stone-800 border-stone-300'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={(e) => handleQuickApprove(e, order.id)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors shadow-xs cursor-pointer"
                              title="Quick-approve this order request"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectOrder(order);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Inspect & Process Order"
                          >
                            <ChevronRight className="w-4 h-4" />
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
      )}
    </div>
  );
};
