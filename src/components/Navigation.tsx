import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, ShoppingBag, LayoutDashboard, Store, ShieldCheck, User, LogIn, ChevronDown, Check } from 'lucide-react';

interface NavigationProps {
  onCategorySelect?: (cat: string) => void;
  selectedCategory?: string;
  onOpenNewProductModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onCategorySelect,
  selectedCategory,
  onOpenNewProductModal
}) => {
  const {
    currentView,
    setCurrentView,
    cart,
    orders,
    setIsCartDrawerOpen,
    currentUser,
    isOwner,
    switchRole,
    setIsAdminLoginModalOpen,
    storeConfig
  } = useStore();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleAdminClick = () => {
    if (isOwner) {
      setCurrentView('merchant');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar in rich wine/burgundy */}
      {storeConfig.announcement && currentView === 'storefront' && (
        <div className="bg-red-950 text-rose-100 text-[11px] py-1.5 px-4 text-center font-medium tracking-wide border-b border-red-900/40">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 mr-2 animate-pulse" />
          {storeConfig.announcement}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single element */}
        <button
          onClick={() => setCurrentView('storefront')}
          className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-red-700 transition-colors flex items-center gap-1.5">
            <span>{storeConfig.storeName}</span>
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block shrink-0" />
          </span>
        </button>

        {/* Zone 2: 4–6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          {currentView === 'storefront' ? (
            <>
              <button
                onClick={() => {
                  setCurrentView('storefront');
                  onCategorySelect?.('All');
                }}
                className={`hover:text-red-700 transition-colors cursor-pointer py-1 ${
                  selectedCategory === 'All' ? 'text-red-700 font-bold border-b-2 border-red-700' : ''
                }`}
              >
                All Goods
              </button>
              <button
                onClick={() => {
                  setCurrentView('storefront');
                  onCategorySelect?.('Kitchen & Table');
                }}
                className={`hover:text-red-700 transition-colors cursor-pointer py-1 ${
                  selectedCategory === 'Kitchen & Table' ? 'text-red-700 font-bold border-b-2 border-red-700' : ''
                }`}
              >
                Kitchen
              </button>
              <button
                onClick={() => {
                  setCurrentView('storefront');
                  onCategorySelect?.('Objects & Studio');
                }}
                className={`hover:text-red-700 transition-colors cursor-pointer py-1 ${
                  selectedCategory === 'Objects & Studio' ? 'text-red-700 font-bold border-b-2 border-red-700' : ''
                }`}
              >
                Studio
              </button>
              <button
                onClick={() => {
                  setCurrentView('storefront');
                  onCategorySelect?.('Textiles & Living');
                }}
                className={`hover:text-red-700 transition-colors cursor-pointer py-1 ${
                  selectedCategory === 'Textiles & Living' ? 'text-red-700 font-bold border-b-2 border-red-700' : ''
                }`}
              >
                Textiles
              </button>
              <button
                onClick={() => setCurrentView('my-orders')}
                className="hover:text-red-700 transition-colors cursor-pointer py-1"
              >
                My Orders
              </button>
              <button
                onClick={() => setCurrentView('order-tracker')}
                className="hover:text-red-700 transition-colors cursor-pointer py-1"
              >
                Track Request
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentView('storefront')}
                className="flex items-center gap-1.5 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-stone-500" />
                <span>Storefront</span>
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => setCurrentView('merchant')}
                className={`flex items-center gap-1.5 hover:text-red-700 transition-colors cursor-pointer ${
                  currentView === 'merchant' ? 'text-red-700 font-bold' : ''
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-red-700" />
                <span>Admin Operations</span>
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => setCurrentView('order-tracker')}
                className="hover:text-red-700 transition-colors cursor-pointer"
              >
                Order Lookup
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1–2 primary actions + Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Role Badge & Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isOwner
                  ? 'bg-rose-50 text-red-950 border-rose-200 hover:bg-rose-100'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
              title="Click to switch between Customer and Store Owner view"
            >
              {isOwner ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                  <span className="hidden sm:inline">Owner:</span>
                  <span className="font-bold text-red-900">Tikmillions</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Role:</span>
                  <span>Customer</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isRoleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs"
                onClick={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-stone-100 text-[10px] uppercase font-bold text-stone-400">
                  Switch Active Role
                </div>
                <button
                  onClick={() => switchRole('admin')}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-rose-50/60 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-700" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Tikmillions (Owner)</span>
                      <span className="text-[10px] text-stone-500 font-mono-num">tikmillions@gmail.com</span>
                    </div>
                  </div>
                  {isOwner && <Check className="w-3.5 h-3.5 text-red-700" />}
                </button>

                <button
                  onClick={() => switchRole('customer')}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-500" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Customer User</span>
                      <span className="text-[10px] text-stone-500">Standard shopper view</span>
                    </div>
                  </div>
                  {!isOwner && <Check className="w-3.5 h-3.5 text-stone-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg hover:border-red-600 hover:bg-rose-50/40 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            aria-label={`View shopping cart with ${totalCartCount} items`}
          >
            <ShoppingCart className="w-4 h-4 text-red-700" />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="font-mono-num ml-0.5 px-1.5 py-0.2 bg-red-700 text-white font-bold rounded-full text-[11px] shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Admin Panel Trigger */}
          {currentView === 'storefront' || currentView === 'order-tracker' || currentView === 'my-orders' ? (
            <button
              onClick={handleAdminClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs ${
                isOwner
                  ? 'bg-red-700 text-white hover:bg-red-800 ring-1 ring-red-800'
                  : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
              }`}
            >
              {isOwner ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                  {pendingOrdersCount > 0 && (
                    <span className="font-mono-num ml-1 px-1.5 py-0.2 bg-amber-400 text-stone-950 font-bold rounded text-[10px]">
                      {pendingOrdersCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Owner Login</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-stone-500" />
              <span>Storefront</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
