/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navigation } from './components/Navigation';
import { NotificationToasts } from './components/NotificationToasts';
import { StoreHero } from './components/storefront/StoreHero';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { OrderRequestDrawer } from './components/storefront/OrderRequestDrawer';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { CustomerOrdersView } from './components/storefront/CustomerOrdersView';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Product, OrderRequest } from './types';
import { ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView, setIsCartDrawerOpen, storeConfig, isOwner } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRequest | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (currentView !== 'storefront') {
      setCurrentView('storefront');
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-red-600 selection:text-white">
      {/* Top Bar (AliExpress 3-Tier Marketplace Header) */}
      <Navigation
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewProductModal={() => setIsAddProductModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'storefront' && (
          <>
            {/* Curated Campaign Hero */}
            <StoreHero
              onExploreClick={scrollToCatalog}
              onOpenCustomRequest={() => setIsCartDrawerOpen(true)}
            />

            {/* Catalog Grid & Quick Order Adding */}
            <ProductCatalog
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
            />

            {/* Studio Values / Trust section */}
            <section className="bg-stone-100/70 border-t border-stone-200 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex items-start gap-3.5">
                    <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">Direct From {storeConfig.ownerName}</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Hand-inspected small-batch goods. Quality assured directly by the store owner before dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <HeartHandshake className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">Custom Order Requests</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Submit customized order requests with preferred settlement terms. Verified within 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Truck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">Tracked Express Dispatch</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Live milestone tracking and courier references provided for every domestic & international requisition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'merchant' && (
          <MerchantDashboard
            onOpenNewProductModal={isAddProductModalOpen}
            setIsAddModalOpen={setIsAddProductModalOpen}
          />
        )}

        {currentView === 'my-orders' && <CustomerOrdersView />}

        {currentView === 'order-tracker' && <OrderTrackingView />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <OrderRequestDrawer
        onOrderSubmitted={(order) => setConfirmedOrder(order)}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      <AdminLoginModal />

      <NotificationToasts />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-semibold text-stone-800 text-sm">
              {storeConfig.storeName}
            </span>
            <span>· Owner: {storeConfig.ownerName} ({storeConfig.ownerEmail})</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('storefront')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Storefront
            </button>
            <button
              onClick={() => setCurrentView('my-orders')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              My Orders
            </button>
            <button
              onClick={() => setCurrentView('order-tracker')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Track Request
            </button>
            <button
              onClick={() => setCurrentView('merchant')}
              className="hover:text-stone-900 transition-colors font-semibold text-stone-800 cursor-pointer"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
