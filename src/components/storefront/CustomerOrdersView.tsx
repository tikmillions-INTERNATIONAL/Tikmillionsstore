import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderRequest } from '../../types';
import { ShoppingBag, ArrowLeft, ArrowRight, Clock, Truck, CheckCircle2 } from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { orders, currentUser, setCurrentView, setTrackingOrderId } = useStore();

  // Find orders for current user or show all customer orders if general view
  const myOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === currentUser.email.toLowerCase() ||
      currentUser.role === 'admin'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>
          <h1 className="font-serif-display text-3xl font-medium tracking-tight text-stone-900">
            My Order Requests
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tracking and requisition history for {currentUser.name} ({currentUser.email}).
          </p>
        </div>

        <button
          onClick={() => setCurrentView('order-tracker')}
          className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors self-start sm:self-auto"
        >
          Track by Specific ID →
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800">No Order Requests Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't submitted any order requests yet under {currentUser.email}. Select items from the catalog to submit your first requisition.
          </p>
          <button
            onClick={() => setCurrentView('storefront')}
            className="mt-3 px-5 py-2.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer ring-1 ring-red-800"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-stone-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-stone-900 text-base">
                      {order.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize border ${
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
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} · Settlement: {order.paymentPreference} ({order.paymentStatus})
                  </span>
                </div>

                <button
                  onClick={() => {
                    setTrackingOrderId(order.id);
                    setCurrentView('order-tracker');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Track Full Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items Summary */}
              <div className="flex flex-wrap items-center gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs bg-stone-50/80 p-2 rounded-xl border border-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 block truncate max-w-[160px]">
                        {item.productName}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-0.5">
                        <span>Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</span>
                        <span aria-hidden="true">·</span>
                        {item.deliveryTier === 'express_5_7_days' ? (
                          <span className="text-[10px] font-bold text-red-700 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">
                            ⚡ 5–7d
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-600 bg-stone-100 border border-stone-200 px-1 py-0.2 rounded">
                            📦 2w
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total & Shipping */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div>
                  Ship to: <span className="font-medium text-stone-900">{order.customer.city}, {order.customer.country}</span>
                  {order.trackingNumber && (
                    <span className="ml-3 text-sky-800 font-medium">
                      Tracking: <span className="font-mono-num font-bold">{order.trackingNumber}</span> ({order.trackingCarrier})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-stone-500 mr-2">Total Amount:</span>
                  <span className="font-mono-num font-bold text-stone-950 text-sm">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
