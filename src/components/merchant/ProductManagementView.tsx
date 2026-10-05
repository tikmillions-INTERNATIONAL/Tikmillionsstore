import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { PRESET_IMAGES } from '../../data/initialData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Package,
  Layers,
  CheckSquare,
  Square,
  Truck,
  Clock
} from 'lucide-react';

interface ProductManagementViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    removeMultipleProducts,
    adjustStock
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<Product['category']>('Kitchen & Table');
  const [price, setPrice] = useState<number>(65);
  const [standardDeliveryPrice, setStandardDeliveryPrice] = useState<number>(65);
  const [expressDeliveryPrice, setExpressDeliveryPrice] = useState<number>(85);
  const [costPrice, setCostPrice] = useState<number>(25);
  const [stock, setStock] = useState<number>(15);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);
  const [description, setDescription] = useState('');
  const [detailsText, setDetailsText] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [optionsName, setOptionsName] = useState('');
  const [optionsChoices, setOptionsChoices] = useState('');

  const openAddModal = () => {
    setName('');
    setSku(`TIK-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Kitchen & Table');
    setPrice(65);
    setStandardDeliveryPrice(65);
    setExpressDeliveryPrice(85);
    setCostPrice(25);
    setStock(15);
    setLeadTimeDays(3);
    setDescription('');
    setDetailsText('Material: Studio stoneware & brass\nCraft: Hand-finished in workshop\nFood & heat safe');
    setImageUrl(PRESET_IMAGES[0].url);
    setOptionsName('Finish');
    setOptionsChoices('Natural, Smoked, Matte Black');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setPrice(p.price);
    setStandardDeliveryPrice(p.standardDeliveryPrice ?? p.price);
    setExpressDeliveryPrice(p.expressDeliveryPrice ?? Math.round(p.price * 1.25));
    setCostPrice(p.costPrice || 0);
    setStock(p.stock);
    setLeadTimeDays(p.leadTimeDays);
    setDescription(p.description);
    setDetailsText(p.details.join('\n'));
    setImageUrl(p.imageUrl);
    setOptionsName(p.options?.name || '');
    setOptionsChoices(p.options ? p.options.choices.join(', ') : '');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const details = detailsText
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const options =
      optionsName && optionsChoices
        ? {
            name: optionsName,
            choices: optionsChoices
              .split(',')
              .map((c) => c.trim())
              .filter((c) => c.length > 0)
          }
        : undefined;

    const parsedPrice = Number(price);
    const parsedStandard = Number(standardDeliveryPrice || price);
    const parsedExpress = Number(expressDeliveryPrice || Math.round(price * 1.25));

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        category,
        price: parsedPrice,
        standardDeliveryPrice: parsedStandard,
        expressDeliveryPrice: parsedExpress,
        costPrice: Number(costPrice),
        stock: Number(stock),
        leadTimeDays: Number(leadTimeDays),
        description,
        details,
        imageUrl,
        options
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name,
        sku,
        category,
        price: parsedPrice,
        standardDeliveryPrice: parsedStandard,
        expressDeliveryPrice: parsedExpress,
        costPrice: Number(costPrice),
        stock: Number(stock),
        minOrderQuantity: 1,
        leadTimeDays: Number(leadTimeDays),
        description,
        details,
        imageUrl,
        status: 'active',
        options
      });
      setIsAddModalOpen(false);
    }
  };

  const confirmSingleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const confirmBulkDelete = () => {
    removeMultipleProducts(selectedProductIds);
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = !onlyLowStock || p.stock <= 5;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);

    return matchesCat && matchesStock && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Kitchen & Table">Kitchen & Table</option>
            <option value="Objects & Studio">Objects & Studio</option>
            <option value="Textiles & Living">Textiles & Living</option>
          </select>

          {/* Low stock filter toggle */}
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              onlyLowStock
                ? 'bg-amber-500 text-stone-950 border-amber-500 font-semibold'
                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock (&le; 5)</span>
          </button>

          {/* Bulk delete action button when items are checked */}
          {selectedProductIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Remove Selected ({selectedProductIds.length})</span>
            </button>
          )}
        </div>

        {/* Primary Add Product Button */}
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto ring-1 ring-red-800"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    title={selectedProductIds.length === filteredProducts.length ? 'Deselect all' : 'Select all'}
                  >
                    {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-stone-900" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Product & Category</th>
                <th className="py-3 px-4 font-mono-num">SKU</th>
                <th className="py-3 px-4 text-right">Pricing & Delivery Tiers</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">Catalog Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= 5;
                const isOut = p.stock <= 0;
                const isSelected = selectedProductIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-50/40' : 'hover:bg-stone-50/60'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleSelectOne(p.id)}
                        className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-stone-900" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                        )}
                      </button>
                    </td>

                    {/* Product & Category */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {p.category} · {p.leadTimeDays}d lead
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono-num text-stone-600 whitespace-nowrap">
                      {p.sku}
                    </td>

                    {/* Price & Delivery Rates */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end">
                        <span className="font-mono-num font-bold text-stone-900">
                          ${p.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span title="Standard 2-Weeks delivery price" className="text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded font-mono-num border border-stone-200">
                            2w: ${(p.standardDeliveryPrice ?? p.price).toFixed(2)}
                          </span>
                          <span title="Express 5-7 Days delivery price" className="text-red-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold font-mono-num border border-rose-200">
                            5-7d: ${(p.expressDeliveryPrice ?? Math.round(p.price * 1.25)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Stock & Quick Adjuster */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          type="button"
                          onClick={() => adjustStock(p.id, p.stock - 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-l cursor-pointer text-xs"
                          title="Reduce stock by 1"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono-num text-xs font-semibold px-2.5 ${
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-700'
                              : 'text-stone-900'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustStock(p.id, p.stock + 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-r cursor-pointer text-xs"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateProduct(p.id, {
                            status: p.status === 'active' ? 'draft' : 'active'
                          })
                        }
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                        title="Click to toggle active status"
                      >
                        {p.status}
                      </button>
                    </td>

                    {/* Actions: Edit & Remove */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-600 hover:text-stone-950 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Edit product specs and pricing"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove product from store"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Product Removal Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Remove Product from Store?
              </h3>
              <p className="text-xs text-stone-600">
                Are you sure you want to remove <span className="font-semibold text-stone-900">"{productToDelete.name}"</span>?
                This will delist it from the live customer catalog and clear it from active order request sheets.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 text-xs">
              <img
                src={productToDelete.imageUrl}
                alt={productToDelete.name}
                className="w-10 h-10 rounded-lg object-cover bg-stone-100"
              />
              <div className="min-w-0">
                <span className="font-semibold text-stone-900 block truncate">{productToDelete.name}</span>
                <span className="text-[11px] text-stone-500 font-mono-num">{productToDelete.sku} · ${productToDelete.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSingleDelete}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Yes, Remove Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Product Removal Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Remove {selectedProductIds.length} Selected Products?
              </h3>
              <p className="text-xs text-stone-600">
                This will permanently delete all {selectedProductIds.length} selected items from your store catalog.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Remove {selectedProductIds.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Catalog Manager
                </span>
                <h3 className="font-serif-display text-xl font-semibold text-stone-900 mt-0.5">
                  {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Stoneware Helical Pour-Over Dripper"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    SKU Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="TIK-KIT-07"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  >
                    <option value="Kitchen & Table">Kitchen & Table</option>
                    <option value="Objects & Studio">Objects & Studio</option>
                    <option value="Textiles & Living">Textiles & Living</option>
                    <option value="Hardware & Tools">Hardware & Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Retail Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Production Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
                  />
                </div>

                {/* Delivery Pricing Options: 5-7 days delivery price & standard 2 weeks delivery price */}
                <div className="sm:col-span-2 p-4 bg-gradient-to-br from-rose-50/70 via-white to-stone-50 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-red-700" />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-950">
                        Delivery Pricing Options
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-red-800 bg-white px-2 py-0.5 rounded border border-rose-200">
                      Standard vs. Express
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    Set specific pricing for customers choosing standard 2-weeks dispatch versus 5–7 days expedited courier delivery.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center justify-between">
                        <span>Standard 2-Weeks Delivery Price ($ USD) *</span>
                        <span className="text-[10px] text-stone-500 font-normal">Regular lead time</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={standardDeliveryPrice}
                          onChange={(e) => setStandardDeliveryPrice(parseFloat(e.target.value) || 0)}
                          placeholder="e.g. 68.00"
                          className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num font-semibold text-stone-900"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Base standard delivery option across regular transit time (approx. 14 days).
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center justify-between">
                        <span>5–7 Days Delivery Price ($ USD) *</span>
                        <span className="text-[10px] text-red-700 font-semibold">Priority express</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={expressDeliveryPrice}
                          onChange={(e) => setExpressDeliveryPrice(parseFloat(e.target.value) || 0)}
                          placeholder="e.g. 85.00"
                          className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num font-semibold text-stone-900"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Accelerated priority courier delivery (delivered within 5–7 days).
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Starting Inventory Units *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description highlighting craft and functionality..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Specification Bullets (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    placeholder="Material: Hand-finished ceramic&#10;Dimensions: 120mm x 90mm&#10;Care: Hand wash"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>

                {/* Variants / Choices */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Option Name (e.g. Finish, Color)
                  </label>
                  <input
                    type="text"
                    value={optionsName}
                    onChange={(e) => setOptionsName(e.target.value)}
                    placeholder="Finish"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Choices (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={optionsChoices}
                    onChange={(e) => setOptionsChoices(e.target.value)}
                    placeholder="Chalk White, Sand, Obsidian"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                {/* Image Selection Presets */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Product Photography Asset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setImageUrl(img.url)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          imageUrl === img.url
                            ? 'border-stone-900 ring-2 ring-stone-900/20'
                            : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 backdrop-blur-xs text-[9px] text-white p-1 truncate text-center">
                          {img.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Or custom image URL:
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/src/assets/images/..."
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
