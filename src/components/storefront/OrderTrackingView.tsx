import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderRequest, OrderStatus } from '../../types';
import { Search, CheckCircle2, Clock, Truck, Package, XCircle, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, setCurrentView } = useStore();
  const [searchInput, setSearchInput] = useState(trackingOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);

  useEffect(() => {
    if (trackingOrderId) {
      setSearchInput(trackingOrderId);
      const found = orders.find((o) => o.id.toUpperCase() === trackingOrderId.toUpperCase());
      setSelectedOrder(found || null);
    } else if (orders.length > 0) {
      setSelectedOrder(orders[0]);
      setSearchInput(orders[0].id);
    }
  }, [trackingOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchInput.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === cleanId);
    setSelectedOrder(found || null);
    setTrackingOrderId(cleanId);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'reviewing':
      case 'approved': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'completed': return 5;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = selectedOrder ? getStatusStepIndex(selectedOrder.status) : 1;

  const steps = [
    { label: 'Received', desc: 'Request submitted' },
    { label: 'Approved', desc: 'Maker review complete' },
    { label: 'Processing', desc: 'In studio fulfillment' },
    { label: 'Dispatched', desc: 'Shipped with tracking' },
    { label: 'Delivered', desc: 'Order completed' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-red-700 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>
          <h1 className="font-serif-display text-3xl font-medium tracking-tight text-stone-900">
            Order Request Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status, fulfillment notes, and shipping carrier telemetry for your orders.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. TIK-9841"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Track
          </button>
        </form>
      </div>

      {/* Quick Select Recent Orders */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-500 shrink-0 font-medium">Recent Requests:</span>
        {orders.slice(0, 5).map((ord) => (
          <button
            key={ord.id}
            onClick={() => {
              setSelectedOrder(ord);
              setSearchInput(ord.id);
              setTrackingOrderId(ord.id);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-num transition-colors whitespace-nowrap cursor-pointer ${
              selectedOrder?.id === ord.id
                ? 'bg-red-700 text-white font-bold shadow-xs'
                : 'bg-stone-200/80 text-stone-700 hover:bg-rose-100 hover:text-red-900'
            }`}
          >
            {ord.id} ({ord.customer.name.split(' ')[0]})
          </button>
        ))}
      </div>

      {!selectedOrder ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-base font-semibold text-stone-800">Order Request Not Found</p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Please check the Order ID you typed. Example available order IDs: {orders.slice(0, 3).map(o => o.id).join(', ')}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Status Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-mono-num font-bold text-red-950 text-lg">
                    {selectedOrder.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Placed {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  Recipient: <span className="font-semibold text-stone-900">{selectedOrder.customer.name}</span>
                  {selectedOrder.customer.company && ` (${selectedOrder.customer.company})`}
                </div>
              </div>

              {/* Status Pill Badge & Merchant Link */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize border ${
                  selectedOrder.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : selectedOrder.status === 'shipped'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : selectedOrder.status === 'processing'
                    ? 'bg-rose-50 text-red-900 border-rose-200 font-bold'
                    : selectedOrder.status === 'approved'
                    ? 'bg-stone-100 text-stone-800 border-stone-300'
                    : selectedOrder.status === 'cancelled'
                    ? 'bg-stone-100 text-stone-600 border-stone-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                }`}>
                  Status: {selectedOrder.status}
                </span>

                <button
                  onClick={() => setCurrentView('merchant')}
                  className="text-xs font-semibold text-red-700 hover:text-red-900 underline cursor-pointer"
                  title="Switch to store management console"
                >
                  Manage as Owner →
                </button>
              </div>
            </div>

            {/* Step Progress Bar (if not cancelled) with Crimson Fill */}
            {selectedOrder.status === 'cancelled' ? (
              <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-xs text-stone-700">
                <XCircle className="w-5 h-5 text-stone-500 shrink-0" />
                <div>
                  <span className="font-semibold">This order request was cancelled.</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {selectedOrder.history[selectedOrder.history.length - 1]?.note || 'Cancelled by store administrator.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="grid grid-cols-5 gap-2 relative">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-red-700 -z-0 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100))}%`
                    }}
                  />

                  {steps.map((st, idx) => {
                    const stepNumber = idx + 1;
                    const isDone = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                      <div key={st.label} className="relative z-10 flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-red-700 text-white'
                              : isCurrent
                              ? 'bg-red-700 text-white ring-4 ring-rose-200'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                        </div>
                        <span className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-red-900 font-bold' : 'text-stone-600'}`}>
                          {st.label}
                        </span>
                        <span className="text-[10px] text-stone-400 hidden sm:block">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Carrier & Tracking details if shipped */}
            {selectedOrder.trackingNumber && (
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-950">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-red-700 shrink-0" />
                  <div>
                    <span className="font-semibold block">
                      Dispatched via {selectedOrder.trackingCarrier || 'Express Carrier'}
                    </span>
                    <span className="text-[11px] text-red-800">
                      Tracking Reference:{' '}
                      <span className="font-mono-num font-bold">{selectedOrder.trackingNumber}</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-red-800 bg-white/90 px-3 py-1.5 rounded-lg border border-rose-200 font-medium">
                  Verified Dispatch Carrier
                </div>
              </div>
            )}

            {/* Details Split: Items & Audit History */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-stone-100">
              {/* Items List (col 7) */}
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-800 block">
                  Requested Items ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3.5">
                      <img
                        src={it.imageUrl}
                        alt={it.productName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {it.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="font-mono-num">{it.sku}</span>
                          {it.selectedOption && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{it.selectedOption}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>Qty: {it.quantity}</span>
                          <span aria-hidden="true">·</span>
                          {it.deliveryTier === 'express_5_7_days' ? (
                            <span className="text-[10px] font-semibold text-red-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                              ⚡ 5–7 Days Delivery
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded">
                              📦 Standard 2-Weeks
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono-num text-xs font-bold text-stone-900">
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="bg-rose-50/30 rounded-xl p-4 space-y-1.5 text-xs text-stone-600 border border-rose-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono-num font-medium text-stone-900">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-mono-num font-medium text-stone-900">${selectedOrder.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-mono-num font-medium text-stone-900">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>Discount</span>
                      <span className="font-mono-num font-medium">-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-red-950 pt-2 border-t border-rose-200">
                    <span>Total Amount</span>
                    <span className="font-mono-num">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600">
                    <span className="font-semibold text-stone-800 block mb-0.5">Customer Instructions:</span>
                    <p className="italic">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* History / Audit Timeline (col 5) */}
              <div className="md:col-span-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-800 block">
                  Processing Audit Trail
                </span>
                <div className="space-y-4 relative pl-4 border-l-2 border-rose-200">
                  {selectedOrder.history.map((ev, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-700 ring-4 ring-white" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold capitalize text-red-950">
                            {ev.status}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                          {ev.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
                  <span className="font-semibold text-stone-800 block">Delivery Address</span>
                  <p>{selectedOrder.customer.street}</p>
                  <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zip}</p>
                  <p>{selectedOrder.customer.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
