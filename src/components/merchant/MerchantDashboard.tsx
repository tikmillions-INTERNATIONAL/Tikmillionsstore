import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderRequest, Product } from '../../types';
import { OrderProcessingView } from './OrderProcessingView';
import { ProductManagementView } from './ProductManagementView';
import { OrderInspectorModal } from './OrderInspectorModal';
import { PrintInvoiceModal } from './PrintInvoiceModal';
import { SalesTrendsChart } from './SalesTrendsChart';
import { CustomerManagementView } from '../admin/CustomerManagementView';
import { AccountManagementView } from '../admin/AccountManagementView';
import { UserDatabaseView } from '../admin/UserDatabaseView';
import { StoreSettingsView } from '../admin/StoreSettingsView';
import {
  Inbox,
  Package,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Store,
  Layers,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Users,
  UserPlus,
  Settings,
  Lock,
  Plus,
  BarChart3,
  Database
} from 'lucide-react';

interface MerchantDashboardProps {
  onOpenNewProductModal: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  onOpenNewProductModal,
  setIsAddModalOpen
}) => {
  const {
    products,
    orders,
    users,
    setCurrentView,
    resetToSampleData,
    currentUser,
    isOwner,
    loginAsOwner,
    storeConfig
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'analytics' | 'products' | 'users-db' | 'accounts' | 'customers' | 'settings'
  >('orders');
  const [showChartInOrdersTab, setShowChartInOrdersTab] = useState(true);
  const [selectedOrderForInspect, setSelectedOrderForInspect] = useState<OrderRequest | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRequest | null>(null);

  // Non-owner gate guard
  if (!isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-red-700 rounded-full flex items-center justify-center mx-auto border border-rose-200">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-red-700">
            Owner & Admin Area
          </span>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-1">
            Access Restricted to Store Admin
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto">
            You are currently browsing as a Customer (<span className="font-semibold text-stone-900">{currentUser.name}</span>). The Admin Panel requires an Admin role account or the primary store owner (<span className="font-mono-num font-semibold text-stone-900">{storeConfig.ownerEmail}</span>).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={loginAsOwner}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer ring-1 ring-red-800"
          >
            <ShieldCheck className="w-4 h-4 text-rose-200" />
            <span>Authenticate as Tikmillions (Owner)</span>
          </button>
          <button
            onClick={() => setCurrentView('storefront')}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Return to Customer Storefront
          </button>
        </div>
      </div>
    );
  }

  // Compute live metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingRequests = orders.filter((o) => o.status === 'pending');
  const processingRequests = orders.filter((o) => o.status === 'processing' || o.status === 'approved');
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgOrderValue =
    orders.length > 0
      ? totalRevenue / Math.max(1, orders.filter((o) => o.status !== 'cancelled').length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Control Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-red-900 bg-rose-50 px-2.5 py-1 rounded-md font-bold border border-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
              Admin Verified: {currentUser.name}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-mono-num text-stone-500">{currentUser.email}</span>
          </div>
          <h1 className="font-serif-display text-3xl font-medium tracking-tight text-stone-900 mt-1">
            {storeConfig.storeName} Admin Panel
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Monitor sales trends, manage catalog inventory, and process incoming order requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors shadow-xs cursor-pointer ring-1 ring-red-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:border-red-300 hover:text-red-900 hover:bg-rose-50/40 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-red-700" />
            <span>Create Account</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset store, products, orders, and users back to factory defaults?')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            title="Reload initial demo products and accounts"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-200 rounded-lg hover:bg-stone-200 transition-colors shadow-xs cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-stone-600" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {/* Metric Cards with Red Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pending Requests */}
        <div
          onClick={() => setActiveTab('orders')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            pendingRequests.length > 0
              ? 'bg-rose-50/50 border-rose-200 hover:border-red-300'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-red-800">
              Pending Order Requests
            </span>
            <Clock className={`w-4 h-4 ${pendingRequests.length > 0 ? 'text-red-600' : 'text-stone-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold text-red-950">
              {pendingRequests.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">awaiting review</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {pendingRequests.length > 0
              ? 'Action required to approve or decline'
              : 'Queue is clear and up to date'}
          </p>
        </div>

        {/* Processing / In Production */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              In Fulfillment
            </span>
            <Inbox className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold text-stone-900">
              {processingRequests.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">orders packing</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Approved & scheduled for dispatch
          </p>
        </div>

        {/* Total Order Volume -> Switches to Analytics with Red Accents */}
        <div
          onClick={() => setActiveTab('analytics')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-br from-red-950 to-stone-900 text-white border-red-900 shadow-md ring-1 ring-red-800'
              : 'bg-white border-stone-200 hover:border-red-200'
          }`}
        >
          <div className={`flex items-center justify-between text-xs mb-2 ${activeTab === 'analytics' ? 'text-rose-200' : 'text-stone-500'}`}>
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              30-Day Sales Analytics
            </span>
            <TrendingUp className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-rose-400' : 'text-red-700'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold">
              ${totalRevenue.toFixed(0)}
            </span>
            <span className={`text-xs font-medium ${activeTab === 'analytics' ? 'text-rose-200' : 'text-stone-500'}`}>
              gross
            </span>
          </div>
          <p className={`text-[11px] mt-2 flex items-center justify-between ${activeTab === 'analytics' ? 'text-rose-200' : 'text-stone-500'}`}>
            <span>Avg: ${avgOrderValue.toFixed(2)}</span>
            <span className="underline font-semibold text-red-700 hover:text-red-900">View Trends →</span>
          </p>
        </div>

        {/* Active Products & Low Stock Alert */}
        <div
          onClick={() => setActiveTab('products')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            lowStockCount > 0
              ? 'bg-stone-50 border-stone-200 hover:border-stone-300'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Catalog Inventory
            </span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold text-stone-900">
              {products.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">products ({totalUnitsInStock} units)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {lowStockCount > 0 ? (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span>{lowStockCount} items have low stock (&le; 5)</span>
              </span>
            ) : (
              'Add, edit, or remove products'
            )}
          </p>
        </div>

        {/* User Database Card */}
        <div
          onClick={() => setActiveTab('users-db')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'users-db'
              ? 'bg-rose-50 border-red-300 ring-1 ring-red-400'
              : 'bg-white border-stone-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-700">
              User Database
            </span>
            <Database className="w-4 h-4 text-red-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold text-stone-900">
              {users.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">registered</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 flex items-center justify-between">
            <span>{users.filter(u => u.role === 'customer').length} customers</span>
            <span className="underline font-semibold text-red-700 hover:text-red-900">Edit Details →</span>
          </p>
        </div>
      </div>

      {/* Main Tab Navigation with Crimson Active Underline */}
      <div className="border-b border-stone-200 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Requests & Processing</span>
            {pendingRequests.length > 0 && (
              <span className="font-mono-num text-[10px] px-1.5 py-0.2 bg-red-700 text-white font-bold rounded-full shadow-xs">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-red-700" />
            <span>Sales Trends & 30-Day Volume</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Products & Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users-db')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users-db'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Database className="w-4 h-4 text-red-700" />
            <span>User Database ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Accounts & Access ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Requisition Clients</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-red-700 text-red-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Collapsible 30-Day Trends Quick View */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Order Requests Fulfillment Flow
            </span>
            <button
              onClick={() => setShowChartInOrdersTab(!showChartInOrdersTab)}
              className="text-red-700 hover:text-red-900 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{showChartInOrdersTab ? 'Hide 30-Day Trends Chart' : 'Show 30-Day Trends Chart'}</span>
            </button>
          </div>

          {showChartInOrdersTab && <SalesTrendsChart />}

          <OrderProcessingView onInspectOrder={(order) => setSelectedOrderForInspect(order)} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <SalesTrendsChart />
        </div>
      )}

      {activeTab === 'products' && (
        <ProductManagementView
          isAddModalOpen={onOpenNewProductModal}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}

      {activeTab === 'users-db' && <UserDatabaseView />}

      {activeTab === 'accounts' && <AccountManagementView />}

      {activeTab === 'customers' && <CustomerManagementView />}

      {activeTab === 'settings' && <StoreSettingsView />}

      {/* Order Inspector Modal */}
      {selectedOrderForInspect && (
        <OrderInspectorModal
          order={selectedOrderForInspect}
          onClose={() => setSelectedOrderForInspect(null)}
          onOpenInvoice={(order) => {
            setSelectedOrderForInvoice(order);
          }}
        />
      )}

      {/* Invoice / Packing Slip Modal */}
      {selectedOrderForInvoice && (
        <PrintInvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};
