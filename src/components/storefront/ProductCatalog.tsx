import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Search, Plus, Eye, Check } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  selectedCategory,
  onSelectCategory
}) => {
  const { products, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = ['All', 'Kitchen & Table', 'Objects & Studio', 'Textiles & Living'];

  const filteredProducts = products.filter((product) => {
    if (product.status === 'archived') return false;

    const matchesCat =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesQuery;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Catalog Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Available Inventory
          </span>
          <h2 className="font-serif-display text-3xl font-medium tracking-tight text-stone-900 mt-1">
            Studio Collection
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Select items to assemble your custom order request or inquire about bulk studio provisions.
          </p>
        </div>

        {/* Search and Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition-all"
            />
          </div>

          {/* Clean Segmented Category Buttons with Crimson Active State */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-700 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-base font-medium text-stone-800">No products found</p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-red-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;
            const isJustAdded = addedAnimationId === product.id;

            return (
              <article
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white border border-stone-200 hover:border-red-200/90 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                {/* Product Image Area */}
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle Stock state tag */}
                  <div className="absolute top-3 left-3 text-[11px] font-medium tracking-wide">
                    {isOutOfStock ? (
                      <span className="text-stone-600 bg-stone-100/90 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-300">
                        Made to Order
                      </span>
                    ) : isLowStock ? (
                      <span className="text-rose-900 bg-rose-50/95 backdrop-blur-xs px-2 py-0.5 rounded border border-rose-200 font-semibold">
                        {product.stock} units left
                      </span>
                    ) : (
                      <span className="text-stone-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-stone-200">
                        In Stock ({product.stock})
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`p-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1 transition-colors cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-700 text-white hover:bg-red-800'
                      }`}
                      title="Quick add 1 unit to order request"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[11px] pr-1">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-[11px] pr-1">Add to Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Meta & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed metadata with typographic separator */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span className="uppercase tracking-wider font-semibold text-[11px] text-red-800">
                        {product.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{product.sku}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.leadTimeDays}d lead</span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900 group-hover:text-red-800 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono-num text-base font-bold text-stone-900">
                          ${(product.standardDeliveryPrice ?? product.price).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                          Standard
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-0.5">
                        <span className="text-red-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold font-mono-num border border-rose-200">
                          5–7d: ${(product.expressDeliveryPrice ?? Math.round(product.price * 1.25)).toFixed(2)}
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-500 font-mono-num">2w: ${(product.standardDeliveryPrice ?? product.price).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-red-600" />
                      <span>Details & Specs</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
