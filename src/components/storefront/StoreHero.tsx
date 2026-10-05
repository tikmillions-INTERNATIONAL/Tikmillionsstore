import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StoreHeroProps {
  onExploreClick: () => void;
  onOpenCustomRequest: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onExploreClick, onOpenCustomRequest }) => {
  const { storeConfig } = useStore();

  return (
    <section className="relative bg-gradient-to-b from-rose-50/40 via-stone-100/60 to-stone-50 border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-red-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 font-bold">
                {storeConfig.storeName}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-500 font-medium">Curated Studio Goods</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-red-700 font-semibold">Direct From Maker</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.12] text-balance">
              Premium crafted stoneware, studio tools & lifestyle goods.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              Welcome to the official {storeConfig.storeName}. Browse our latest limited-run batches or submit custom order requests directly to the store owner with flexible settlement terms.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 transition-colors cursor-pointer flex items-center gap-2 rounded-lg shadow-sm ring-1 ring-red-800"
              >
                <span>Browse Products</span>
                <ArrowDown className="w-4 h-4 text-rose-200" />
              </button>
              <button
                onClick={onOpenCustomRequest}
                className="px-5 py-3 text-sm font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:border-red-300 hover:text-red-900 hover:bg-rose-50/30 transition-colors cursor-pointer"
              >
                <span>Submit Order Request</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 border-t border-stone-200/80">
              <div>
                <span className="font-semibold text-stone-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  Direct From {storeConfig.ownerName}
                </span>
                <span className="block text-stone-500 mt-0.5">Owner-verified quality control</span>
              </div>
              <div className="w-px h-6 bg-stone-300" />
              <div>
                <span className="font-semibold text-stone-900">2–4 Day Dispatch</span>
                <span className="block text-stone-500 mt-0.5">Real-time tracking for every client</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-200 ring-1 ring-stone-900/5">
              <img
                src="/src/assets/images/store_hero_curated_1791156113926.jpg"
                alt={`${storeConfig.storeName} showroom`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-stone-900/70 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                  <span>{storeConfig.storeName} · Autumn Batch</span>
                </span>
                <span className="font-mono-num text-rose-200">Curated 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
