import React, { useState } from 'react';
import { Product, DeliveryTier } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Check, ShieldCheck, Clock, PackageCheck, Minus, Plus, Truck, Zap, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>(
    product?.options ? product.options.choices[0] : ''
  );
  const [deliveryTier, setDeliveryTier] = useState<DeliveryTier>('standard_2_weeks');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const standardPrice = product.standardDeliveryPrice ?? product.price;
  const expressPrice = product.expressDeliveryPrice ?? Math.round(product.price * 1.25);
  const activeUnitPrice = deliveryTier === 'express_5_7_days' ? expressPrice : standardPrice;

  const handleAdd = () => {
    addToCart(product, quantity, selectedOption || undefined, deliveryTier);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer border border-stone-200"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Gallery / Media Column (Left) */}
          <div className="md:col-span-6 bg-stone-100 flex flex-col justify-center relative min-h-[300px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover max-h-[460px] md:max-h-none"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-4 bg-rose-50/50 border-t border-rose-100 flex items-center justify-between text-xs text-stone-600">
              <span className="font-mono-num font-semibold text-red-900">SKU: {product.sku}</span>
              <span className="text-stone-500">Tikmillions Batch QC Inspected</span>
            </div>
          </div>

          {/* Contiguous Purchase & Specification Module (Right) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="uppercase tracking-wider font-bold text-red-800">
                  {product.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{product.stock > 0 ? `${product.stock} available in studio` : 'Made to order'}</span>
              </div>

              <h2 className="font-serif-display text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="font-mono-num text-2xl font-bold text-red-900">
                  ${activeUnitPrice.toFixed(2)}
                </span>
                <span className="text-xs text-stone-600">
                  USD / unit ({deliveryTier === 'express_5_7_days' ? '5–7 Days Courier' : 'Standard 2-Weeks'})
                </span>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                {product.description}
              </p>

              {/* Delivery Speed / Pricing Option Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center justify-between">
                  <span>Select Delivery Speed & Rate</span>
                  <span className="text-[10px] text-red-700 font-semibold font-mono-num">
                    {deliveryTier === 'express_5_7_days' ? '5–7 Days' : 'Standard 2 Weeks'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryTier('standard_2_weeks')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      deliveryTier === 'standard_2_weeks'
                        ? 'border-red-700 bg-rose-50/60 shadow-xs ring-1 ring-red-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-stone-900 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-stone-600" />
                        <span>Standard</span>
                      </span>
                      <span className="font-mono-num font-bold text-stone-900">${standardPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">2 Weeks standard dispatch</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryTier('express_5_7_days')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      deliveryTier === 'express_5_7_days'
                        ? 'border-red-700 bg-rose-50/60 shadow-xs ring-1 ring-red-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-red-950 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-red-600" />
                        <span>5–7 Days</span>
                      </span>
                      <span className="font-mono-num font-bold text-red-900">${expressPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Express courier delivery</p>
                  </button>
                </div>
              </div>

              {/* Variant Selector if available */}
              {product.options && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    {product.options.name}: <span className="font-normal text-stone-900">{selectedOption}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.options.choices.map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setSelectedOption(choice)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedOption === choice
                            ? 'border-red-700 bg-red-700 text-white shadow-xs'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-red-300 hover:text-red-900'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add Button */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">Order Quantity</span>
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 hover:text-red-700 hover:bg-rose-50/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono-num text-xs font-bold px-4 text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-stone-600 hover:text-red-700 hover:bg-rose-50/50 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isSuccess}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-700 text-white hover:bg-red-800 ring-1 ring-red-800'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart · ${(activeUnitPrice * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Specs & Craftsmanship */}
              <div className="pt-4 space-y-2 border-t border-stone-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Material & Craft Specifications
                </span>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex items-center gap-4 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  <span>Est. Lead Time: {product.leadTimeDays} days</span>
                </span>
                <span className="flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>Tikmillions Studio Packaging</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
