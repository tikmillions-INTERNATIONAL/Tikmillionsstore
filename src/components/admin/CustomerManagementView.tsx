import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

interface CustomerSummary {
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderId: string;
}

export const CustomerManagementView: React.FC = () => {
  const { orders, setTrackingOrderId, setCurrentView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders
  const customersMap: Record<string, CustomerSummary> = {};

  orders.forEach((ord) => {
    const key = ord.customer.email.toLowerCase().trim();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: ord.customer.name,
        email: ord.customer.email,
        phone: ord.customer.phone,
        company: ord.customer.company,
        city: ord.customer.city,
        country: ord.customer.country,
        totalOrders: 1,
        totalSpent: ord.status !== 'cancelled' ? ord.total : 0,
        lastOrderDate: ord.createdAt,
        lastOrderId: ord.id
      };
    } else {
      customersMap[key].totalOrders += 1;
      if (ord.status !== 'cancelled') {
        customersMap[key].totalSpent += ord.total;
      }
      if (new Date(ord.createdAt) > new Date(customersMap[key].lastOrderDate)) {
        customersMap[key].lastOrderDate = ord.createdAt;
        customersMap[key].lastOrderId = ord.id;
      }
    }
  });

  const customerList = Object.values(customersMap).filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-xl font-semibold text-stone-900">
            Registered Customers & Requisition Clients
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Profiles, lifetime order spend, and direct contact details for Tikmillions Store buyers.
          </p>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerList.map((client, idx) => (
          <div
            key={idx}
            className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-4 hover:border-stone-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-stone-900 text-sm block">
                  {client.name}
                </span>
                {client.company && (
                  <span className="text-[11px] font-medium text-stone-500 block">
                    {client.company}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                Verified Buyer
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <a href={`mailto:${client.email}`} className="text-stone-800 hover:underline truncate">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-800 font-mono-num">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-700">{client.city}, {client.country}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-xs">
              <div className="p-2 bg-stone-50 rounded-lg">
                <span className="text-[10px] uppercase text-stone-500 block">Orders</span>
                <span className="font-mono-num font-bold text-stone-900">{client.totalOrders} requests</span>
              </div>
              <div className="p-2 bg-stone-50 rounded-lg">
                <span className="text-[10px] uppercase text-stone-500 block">Total Volume</span>
                <span className="font-mono-num font-bold text-stone-900">${client.totalSpent.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
              <span>Last Order: <span className="font-mono-num font-semibold text-stone-800">{client.lastOrderId}</span></span>
              <button
                onClick={() => {
                  setTrackingOrderId(client.lastOrderId);
                  setCurrentView('order-tracker');
                }}
                className="text-stone-900 font-semibold hover:underline cursor-pointer"
              >
                Track Request →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
