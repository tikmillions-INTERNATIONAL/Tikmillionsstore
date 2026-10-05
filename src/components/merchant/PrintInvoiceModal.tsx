import React from 'react';
import { OrderRequest } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Printer } from 'lucide-react';

interface PrintInvoiceModalProps {
  order: OrderRequest | null;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, onClose }) => {
  const { storeConfig } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-stone-700 uppercase tracking-wider">
              Document Preview · Packing Slip & Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="space-y-8 text-stone-900">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-serif-display text-2xl font-bold tracking-tight text-stone-950">
                {storeConfig.storeName}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Owner: {storeConfig.ownerName} ({storeConfig.ownerEmail})
              </p>
              <p className="text-xs text-stone-500">
                {storeConfig.address}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                Fulfillment Slip
              </span>
              <span className="font-mono-num text-xl font-bold text-stone-900">
                {order.id}
              </span>
              <span className="block text-xs text-stone-500 mt-0.5">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Columns */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Deliver To:
              </span>
              <p className="font-bold text-stone-900">{order.customer.name}</p>
              {order.customer.company && <p className="text-stone-700">{order.customer.company}</p>}
              <p className="text-stone-600">{order.customer.street}</p>
              <p className="text-stone-600">{order.customer.city}, {order.customer.state} {order.customer.zip}</p>
              <p className="text-stone-600">{order.customer.country}</p>
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wider text-stone-500 block mb-1 text-[11px]">
                Order Details:
              </span>
              <p><span className="text-stone-500">Status:</span> <span className="font-semibold capitalize">{order.status}</span></p>
              <p><span className="text-stone-500">Payment:</span> <span className="capitalize">{order.paymentPreference} ({order.paymentStatus})</span></p>
              {order.trackingNumber && (
                <p><span className="text-stone-500">Carrier:</span> {order.trackingCarrier} ({order.trackingNumber})</p>
              )}
              <p><span className="text-stone-500">Contact:</span> {order.customer.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-200 text-stone-500 uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 font-mono-num">SKU</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, i) => (
                  <tr key={i} className="py-2.5">
                    <td className="py-2.5">
                      <span className="font-semibold text-stone-900 block">{item.productName}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        {item.selectedOption && <span>{item.selectedOption} · </span>}
                        <span className="font-medium text-red-800">{item.deliveryTier === 'express_5_7_days' ? '5–7 Days Express' : 'Standard 2-Weeks'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-mono-num text-stone-600">{item.sku}</td>
                    <td className="py-2.5 font-mono-num text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2.5 font-mono-num text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 font-mono-num text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-3 border-t border-stone-200">
            <div className="w-64 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono-num text-stone-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono-num text-stone-900">${order.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-mono-num text-stone-900">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono-num">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono-num">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-dashed border-stone-300 text-center text-[11px] text-stone-500">
            Thank you for purchasing from {storeConfig.storeName}. Inquiries: {storeConfig.ownerEmail}.
          </div>
        </div>
      </div>
    </div>
  );
};
