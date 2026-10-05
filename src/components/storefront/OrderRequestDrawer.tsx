import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderRequest, DeliveryTier } from '../../types';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Zap,
  Tag,
  Percent,
  RotateCcw,
  Check,
  CreditCard,
  Building,
  MapPin,
  Lock
} from 'lucide-react';

interface OrderRequestDrawerProps {
  onOrderSubmitted: (order: OrderRequest) => void;
}

export const OrderRequestDrawer: React.FC<OrderRequestDrawerProps> = ({ onOrderSubmitted }) => {
  const {
    cart,
    updateCartQuantity,
    updateCartDeliveryTier,
    removeFromCart,
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    submitOrderRequest,
    storeConfig,
    currentUser,
    addToast
  } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent?: number;
    fixedDiscount?: number;
    freeShipping?: boolean;
  } | null>(null);

  // Checkout form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [notes, setNotes] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'invoice' | 'wire' | 'card' | 'cod'>('invoice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill checkout fields from logged-in user profile
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setCompany(currentUser.company || '');
      setStreet(currentUser.street || '');
      setCity(currentUser.city || '');
      setState(currentUser.state || '');
      setZip(currentUser.zip || '');
      setCountry(currentUser.country || 'United States');
    }
  }, [currentUser]);

  if (!isCartDrawerOpen) return null;

  const getItemUnitPrice = (item: typeof cart[0]) => {
    if (item.deliveryTier === 'express_5_7_days') {
      return item.product.expressDeliveryPrice ?? Math.round(item.product.price * 1.25);
    }
    return item.product.standardDeliveryPrice ?? item.product.price;
  };

  const subtotal = cart.reduce((sum, item) => sum + getItemUnitPrice(item) * item.quantity, 0);

  // Promo discount calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100 * 100) / 100;
    } else if (appliedPromo.fixedDiscount) {
      discountAmount = Math.min(subtotal, appliedPromo.fixedDiscount);
    }
  }

  // Shipping calculation
  let shippingFee = subtotal > 300 || subtotal === 0 || appliedPromo?.freeShipping ? 0 : 20;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = Math.max(0, taxableAmount + shippingFee + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'TIK10') {
      setAppliedPromo({ code, discountPercent: 10 });
      addToast('Promo TIK10 applied! 10% discount subtracted', 'success');
      setPromoCodeInput('');
    } else if (code === 'TIK20') {
      setAppliedPromo({ code, discountPercent: 20 });
      addToast('Promo TIK20 applied! 20% discount subtracted', 'success');
      setPromoCodeInput('');
    } else if (code === 'TIKFREE' || code === 'FREESHIP') {
      setAppliedPromo({ code, freeShipping: true });
      addToast('Free Shipping code applied!', 'success');
      setPromoCodeInput('');
    } else if (code === 'TIK25' || code === 'WELCOME') {
      setAppliedPromo({ code, fixedDiscount: 25 });
      addToast('$25 Welcome Discount applied!', 'success');
      setPromoCodeInput('');
    } else {
      addToast('Invalid promo code. Try "TIK10" or "TIKFREE"', 'warning');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('Promo code removed', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || !zip) {
      addToast('Please complete all contact and shipping destination fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      price: getItemUnitPrice(item),
      quantity: item.quantity,
      selectedOption: item.selectedOption,
      deliveryTier: item.deliveryTier || 'standard_2_weeks',
      imageUrl: item.product.imageUrl
    }));

    setTimeout(() => {
      const order = submitOrderRequest({
        customer: {
          name,
          email,
          phone,
          company: company || undefined,
          street,
          city,
          state,
          zip,
          country
        },
        items,
        notes: notes || undefined,
        paymentPreference,
        shippingFee,
        discount: discountAmount
      });

      setIsSubmitting(false);
      setIsCartDrawerOpen(false);
      setStep('cart');
      setAppliedPromo(null);
      onOrderSubmitted(order);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-red-700 flex items-center justify-center border border-rose-200 shrink-0">
              <ShoppingCart className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-red-700">
                  {storeConfig.storeName}
                </span>
                <span className="font-mono-num text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-900 font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>
              <h2 className="font-serif-display text-xl font-bold text-stone-900 mt-0.5">
                {step === 'cart' ? 'Shopping Cart' : 'Checkout & Delivery'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator Bar */}
        {cart.length > 0 && step === 'cart' && (
          <div className="bg-rose-50/70 border-b border-rose-100 px-6 py-2.5 text-xs">
            {subtotal >= 300 || appliedPromo?.freeShipping ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You've unlocked <strong>Free Standard Delivery</strong> on this order!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-stone-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-red-700" />
                    <span>Add <strong>${(300 - subtotal).toFixed(2)}</strong> more for Free Standard Delivery</span>
                  </span>
                  <span className="font-mono-num font-bold text-red-900">
                    {Math.round((subtotal / 300) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-700 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 300) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Drawer Main Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-red-300 flex items-center justify-center mx-auto border border-rose-100">
                <ShoppingCart className="w-8 h-8 text-rose-300" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900">Your Shopping Cart is Empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Discover handcrafted goods, kitchenware, and textiles from the Tikmillions Store catalog.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-4 px-6 py-2.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors cursor-pointer shadow-xs ring-1 ring-red-800"
              >
                Start Shopping
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-6">
              {/* Cart Control Header */}
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                <span className="font-semibold text-stone-800">
                  Review Cart Items ({cart.length})
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Clear all items from your shopping cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-stone-400 hover:text-red-700 text-xs font-medium cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-stone-100">
                {cart.map((item, idx) => {
                  const unitPrice = getItemUnitPrice(item);
                  const isExpress = item.deliveryTier === 'express_5_7_days';
                  const stdPrice = item.product.standardDeliveryPrice ?? item.product.price;
                  const expPrice = item.product.expressDeliveryPrice ?? Math.round(item.product.price * 1.25);

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedOption || idx}-${item.deliveryTier || 'std'}`}
                      className="py-4 space-y-3"
                    >
                      <div className="flex gap-4 items-start">
                        {/* Thumbnail */}
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />

                        {/* Title, SKU, and Remove */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-semibold text-stone-900 truncate">
                                {item.product.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                                <span className="font-mono-num text-red-800 font-semibold">
                                  {item.product.sku}
                                </span>
                                {item.selectedOption && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>{item.selectedOption}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedOption, item.deliveryTier)}
                              className="text-stone-400 hover:text-red-700 p-1.5 rounded-md hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                              title="Remove item from cart"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Inline Delivery Speed Selector */}
                          <div className="mt-2.5">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartDeliveryTier(
                                    item.product.id,
                                    'standard_2_weeks',
                                    item.selectedOption,
                                    item.deliveryTier
                                  )
                                }
                                className={`px-2.5 py-1 rounded-lg border text-left transition-all cursor-pointer font-medium ${
                                  !isExpress
                                    ? 'border-red-700 bg-rose-50 text-red-950 font-bold ring-1 ring-red-700'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                                }`}
                              >
                                📦 2-Wks (${stdPrice.toFixed(0)})
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateCartDeliveryTier(
                                    item.product.id,
                                    'express_5_7_days',
                                    item.selectedOption,
                                    item.deliveryTier
                                  )
                                }
                                className={`px-2.5 py-1 rounded-lg border text-left transition-all cursor-pointer font-medium ${
                                  isExpress
                                    ? 'border-red-700 bg-rose-50 text-red-950 font-bold ring-1 ring-red-700'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                                }`}
                              >
                                ⚡ 5–7d (${expPrice.toFixed(0)})
                              </button>
                            </div>
                          </div>

                          {/* Quantity Stepper & Price Calculation */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedOption,
                                    item.deliveryTier
                                  )
                                }
                                className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-rose-50/50 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono-num text-xs font-bold px-3 text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.product.id,
                                    item.quantity + 1,
                                    item.selectedOption,
                                    item.deliveryTier
                                  )
                                }
                                className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-rose-50/50 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-mono-num text-sm font-bold text-red-950 block">
                                ${(unitPrice * item.quantity).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono-num">
                                ${unitPrice.toFixed(2)} ea
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Input Field */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Promo / Coupon Code
                </span>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-mono-num">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{appliedPromo.code}</span>
                      <span className="font-normal text-[11px] text-emerald-700">
                        ({appliedPromo.discountPercent ? `${appliedPromo.discountPercent}% Off` : appliedPromo.freeShipping ? 'Free Delivery' : `$${appliedPromo.fixedDiscount} Off`})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-stone-400 hover:text-rose-600 font-semibold cursor-pointer text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Try TIK10, TIKFREE, WELCOME..."
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Order Notes Field */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Order Instructions & Requisition Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special courier requests, delivery deadlines, custom studio packaging..."
                  className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                />
              </div>
            </div>
          ) : (
            /* Step 2: Checkout Delivery Address & Contact */
            <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-stone-500 pb-2 border-b border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-red-700 hover:underline cursor-pointer font-semibold flex items-center gap-1"
                >
                  ← Back to Cart Items
                </button>
                <span className="text-red-700 font-bold">Checkout: Step 2 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Rivera"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Solstice Specialty Coffee LLC"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="482 Brannan Street, Suite 300"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="94107"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>
              </div>

              {/* Settlement Preference */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Settlement & Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'invoice', label: 'Commercial Invoice (Net 30)', desc: 'Pay upon delivery' },
                    { id: 'wire', label: 'Direct Bank Wire / ACH', desc: 'Pre-production transfer' },
                    { id: 'card', label: 'Credit Card on Review', desc: 'Secure merchant portal' },
                    { id: 'cod', label: 'Cash / Check on Delivery', desc: 'Courier settlement' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-colors ${
                        paymentPreference === opt.id
                          ? 'border-red-700 bg-rose-50/50'
                          : 'border-stone-200 hover:border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentPreference"
                          checked={paymentPreference === opt.id}
                          onChange={() => setPaymentPreference(opt.id as any)}
                          className="text-red-700 focus:ring-red-700"
                        />
                        <span className="font-semibold text-stone-900 text-[11px] leading-tight">
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 pl-5">
                        {opt.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Cart Drawer Footer & Totals */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono-num font-medium text-stone-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo Discount ({appliedPromo?.code})</span>
                  </span>
                  <span className="font-mono-num">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-mono-num font-medium text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">Free Delivery</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono-num font-medium text-stone-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono-num text-base font-bold text-red-950">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs text-white bg-red-700 hover:bg-red-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ring-1 ring-red-800"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                form="order-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs text-white bg-red-700 hover:bg-red-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm ring-1 ring-red-800"
              >
                {isSubmitting ? (
                  <span>Submitting Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-rose-200" />
                    <span>Place Order · ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Tikmillions Guaranteed Quality · Dedicated Studio Fulfillment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
