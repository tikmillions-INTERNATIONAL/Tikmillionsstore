import React, { useState } from 'react';
import { OrderRequest, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  CheckCircle,
  Truck,
  Package,
  Printer,
  Ban,
  Clock,
  Send,
  DollarSign,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface OrderInspectorModalProps {
  order: OrderRequest | null;
  onClose: () => void;
  onOpenInvoice: (order: OrderRequest) => void;
}

export const OrderInspectorModal: React.FC<OrderInspectorModalProps> = ({
  order,
  onClose,
  onOpenInvoice
}) => {
  const { updateOrderStatus, updateOrder, setTrackingOrderId, setCurrentView } = useStore();

  const [activeTab, setActiveTab] = useState<'processing' | 'timeline' | 'edit'>('processing');
  const [carrier, setCarrier] = useState(order?.trackingCarrier || 'FedEx Express');
  const [trackingNum, setTrackingNum] = useState(order?.trackingNumber || '');
  const [customNote, setCustomNote] = useState('');
  const [isShippingStep, setIsShippingStep] = useState(false);
  const [internalMerchantNote, setInternalMerchantNote] = useState(order?.merchantNotes || '');

  if (!order) return null;

  const handleStatusChange = (newStatus: OrderStatus, noteText?: string) => {
    updateOrderStatus(
      order.id,
      newStatus,
      noteText || customNote || undefined,
      newStatus === 'shipped' ? carrier : undefined,
      newStatus === 'shipped' ? trackingNum : undefined
    );
    setCustomNote('');
    setIsShippingStep(false);
  };

  const handleSaveMerchantNote = () => {
    updateOrder(order.id, { merchantNotes: internalMerchantNote });
  };

  const handleTogglePayment = (status: 'unpaid' | 'invoiced' | 'paid') => {
    updateOrder(order.id, { paymentStatus: status });
  };

  const handleViewCustomerTracking = () => {
    setTrackingOrderId(order.id);
    setCurrentView('order-tracker');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-num text-xl font-bold text-stone-900">
                  {order.id}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded capitalize border ${
                  order.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : order.status === 'shipped'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : order.status === 'processing'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : order.status === 'approved'
                    ? 'bg-stone-200 text-stone-900 border-stone-300'
                    : order.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {order.status}
                </span>
              </div>
              <span className="text-xs text-stone-500 mt-0.5 block">
                Placed on {new Date(order.createdAt).toLocaleString()} · Recipient: {order.customer.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoice(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
              title="Print Packing Slip / Commercial Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Invoice / Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('processing')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'processing'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Order Processing & Workflow
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Audit Log & History ({order.history.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'processing' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Order Items & Customer (col 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Customer Details Box */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Customer Profile & Shipping
                    </span>
                    <button
                      onClick={handleViewCustomerTracking}
                      className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 underline cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Customer Tracker</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-500 block">Name:</span>
                      <span className="font-semibold text-stone-900">{order.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Company:</span>
                      <span className="font-medium text-stone-800">{order.customer.company || '—'}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Email:</span>
                      <a href={`mailto:${order.customer.email}`} className="text-stone-800 underline">
                        {order.customer.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Phone:</span>
                      <span className="font-medium text-stone-800">{order.customer.phone}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500 block">Ship To:</span>
                      <span className="font-medium text-stone-900">
                        {order.customer.street}, {order.customer.city}, {order.customer.state} {order.customer.zip}, {order.customer.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                    Line Items ({order.items.length})
                  </span>
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs bg-white">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-stone-900 block truncate">
                              {item.productName}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                              <span className="font-mono-num text-red-800 font-semibold">{item.sku}</span>
                              {item.selectedOption && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>{item.selectedOption}</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              {item.deliveryTier === 'express_5_7_days' ? (
                                <span className="text-[10px] font-bold text-red-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                  ⚡ 5–7 Days Delivery
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded">
                                  📦 2-Weeks Standard
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono-num font-semibold text-stone-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                {order.notes && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <span className="font-semibold block mb-0.5">Customer Instructions:</span>
                    <p className="italic">{order.notes}</p>
                  </div>
                )}

                {/* Internal Merchant Notes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-700">
                      Internal Merchant / Workshop Notes
                    </label>
                    <button
                      onClick={handleSaveMerchantNote}
                      className="text-[11px] font-semibold text-stone-800 hover:text-stone-950 underline cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={internalMerchantNote}
                    onChange={(e) => setInternalMerchantNote(e.target.value)}
                    placeholder="E.g., verified payment wire, stock bin allocation, packaging instructions..."
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Right Column: Processing Actions & Totals (col 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Workflow Action Deck */}
                <div className="p-5 bg-stone-900 text-white rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                      Fulfillment Action
                    </span>
                    <span className="text-[11px] text-stone-300 font-mono-num">
                      Current: {order.status}
                    </span>
                  </div>

                  {/* Primary context action */}
                  {order.status === 'pending' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed">
                        This request is awaiting maker review. Confirm stock availability and approve to begin preparation.
                      </p>
                      <button
                        onClick={() => handleStatusChange('approved', 'Order request approved by merchant.')}
                        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-white text-stone-900 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Approve Order Request</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange('cancelled', 'Declined due to maker scheduling or inventory constraints.')}
                        className="w-full py-2 px-3 text-xs text-rose-300 hover:text-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Decline / Cancel Request</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'approved' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Approved for fulfillment. Move to studio workshop to start assembly and packaging.
                      </p>
                      <button
                        onClick={() => handleStatusChange('processing', 'Moved into studio workshop preparation.')}
                        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-white text-stone-900 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span>Mark In Preparation / Packing</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'processing' && (
                    <div className="space-y-3">
                      {!isShippingStep ? (
                        <>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            Items are packed and ready for courier pickup. Dispatch with tracking number.
                          </p>
                          <button
                            onClick={() => {
                              setIsShippingStep(true);
                              if (!trackingNum) {
                                setTrackingNum(`TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);
                              }
                            }}
                            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-white text-stone-900 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Truck className="w-4 h-4 text-sky-600" />
                            <span>Dispatch & Enter Shipping Info</span>
                          </button>
                        </>
                      ) : (
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="block text-[11px] text-stone-300 mb-1">
                              Shipping Carrier
                            </label>
                            <select
                              value={carrier}
                              onChange={(e) => setCarrier(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-stone-800 border border-stone-700 rounded-lg text-white"
                            >
                              <option value="FedEx Express">FedEx Express</option>
                              <option value="DHL Express">DHL Express Worldwide</option>
                              <option value="UPS Ground">UPS Ground</option>
                              <option value="USPS Priority Mail">USPS Priority Mail</option>
                              <option value="Local Courier">Studio White-Glove Courier</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-300 mb-1">
                              Tracking Code
                            </label>
                            <input
                              type="text"
                              value={trackingNum}
                              onChange={(e) => setTrackingNum(e.target.value)}
                              placeholder="e.g. FX-9842019"
                              className="w-full px-2.5 py-1.5 text-xs bg-stone-800 border border-stone-700 rounded-lg text-white font-mono-num"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange('shipped')}
                              className="flex-1 py-2 px-3 text-xs font-semibold bg-sky-500 text-stone-950 rounded-lg hover:bg-sky-400 transition-colors cursor-pointer"
                            >
                              Confirm Shipment
                            </button>
                            <button
                              onClick={() => setIsShippingStep(false)}
                              className="py-2 px-3 text-xs text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {order.status === 'shipped' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 leading-relaxed">
                        In transit via {order.trackingCarrier || 'carrier'}. Mark as completed once recipient confirms receipt.
                      </p>
                      <button
                        onClick={() => handleStatusChange('completed', 'Delivered and fulfilled successfully.')}
                        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Completed / Delivered</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Order fulfilled, paid, and archived.</span>
                    </div>
                  )}

                  {/* Manual Status Override Dropdown */}
                  <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                    <label className="block mb-1">Direct Status Override:</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['pending', 'approved', 'processing', 'shipped', 'completed', 'cancelled'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st, `Manual override to ${st}`)}
                          className={`px-2 py-1 rounded text-[10px] capitalize transition-colors cursor-pointer ${
                            order.status === st
                              ? 'bg-stone-700 text-white font-semibold'
                              : 'bg-stone-800/80 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Summary & Settlement Status */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
                      Payment & Settlement
                    </span>
                    <span className="font-mono-num text-[11px] text-stone-500 uppercase">
                      Preference: {order.paymentPreference}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-lg">
                    {(['unpaid', 'invoiced', 'paid'] as const).map((paySt) => (
                      <button
                        key={paySt}
                        onClick={() => handleTogglePayment(paySt)}
                        className={`flex-1 py-1 text-xs font-semibold rounded capitalize transition-colors cursor-pointer ${
                          order.paymentStatus === paySt
                            ? paySt === 'paid'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : paySt === 'invoiced'
                              ? 'bg-amber-500 text-stone-950 shadow-xs'
                              : 'bg-stone-900 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {paySt}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60 text-stone-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-mono-num">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-mono-num">${order.shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span className="font-mono-num">${order.tax.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span className="font-mono-num">-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total Receivable</span>
                      <span className="font-mono-num">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Timeline / Audit Log Tab */
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                Complete Lifecycle History
              </span>
              <div className="relative pl-6 border-l-2 border-stone-200 space-y-6">
                {order.history.map((ev, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-stone-900 ring-4 ring-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold capitalize text-stone-900">
                          {ev.status}
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-[11px] text-stone-500">
                          {new Date(ev.timestamp).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase bg-stone-100 px-1.5 py-0.2 rounded font-mono-num">
                          by {ev.actor || 'merchant'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 mt-1 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        {ev.note || 'Status updated.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
