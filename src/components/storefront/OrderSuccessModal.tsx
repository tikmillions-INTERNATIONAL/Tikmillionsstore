import React from 'react';
import { OrderRequest } from '../../types';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, ArrowRight, LayoutDashboard, Copy, Check } from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderRequest | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { setCurrentView, setTrackingOrderId } = useStore();
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrack = () => {
    setTrackingOrderId(order.id);
    setCurrentView('order-tracker');
    onClose();
  };

  const handleSwitchToMerchant = () => {
    setCurrentView('merchant');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
            Order Request Registered
          </span>
          <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
            Thank you, {order.customer.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Your order request has been logged into our queue. Our studio team reviews inventory and dispatch schedules before final confirmation.
          </p>
        </div>

        {/* Order Identifier Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block font-medium">
              Order Reference Number
            </span>
            <span className="font-mono-num text-lg font-bold text-stone-900">
              {order.id}
            </span>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Details */}
        <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
          <div className="flex justify-between">
            <span className="text-stone-500">Items Ordered:</span>
            <span className="font-medium text-stone-900">{order.items.length} items ({order.items.reduce((s, i) => s + i.quantity, 0)} units)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Total Amount:</span>
            <span className="font-mono-num font-bold text-stone-900">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Initial Status:</span>
            <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
              Pending Review
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Destination:</span>
            <span className="font-medium text-stone-900 text-right truncate max-w-[220px]">
              {order.customer.city}, {order.customer.country}
            </span>
          </div>
        </div>

        {/* Dual Actions: Customer Track or Merchant Process */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleTrack}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Track Order Status & Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSwitchToMerchant}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-stone-600" />
            <span>Switch to Merchant Console to Process This Order</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs font-medium text-stone-500 hover:text-stone-900 py-1 transition-colors cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
