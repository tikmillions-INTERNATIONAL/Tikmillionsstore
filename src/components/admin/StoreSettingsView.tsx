import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreConfig } from '../../types';
import { Save, RotateCcw, ShieldCheck } from 'lucide-react';

export const StoreSettingsView: React.FC = () => {
  const { storeConfig, updateStoreConfig, resetToSampleData } = useStore();

  const [storeName, setStoreName] = useState(storeConfig.storeName);
  const [ownerName, setOwnerName] = useState(storeConfig.ownerName);
  const [ownerEmail, setOwnerEmail] = useState(storeConfig.ownerEmail);
  const [supportPhone, setSupportPhone] = useState(storeConfig.supportPhone);
  const [currency, setCurrency] = useState(storeConfig.currency);
  const [address, setAddress] = useState(storeConfig.address);
  const [announcement, setAnnouncement] = useState(storeConfig.announcement || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      storeName,
      ownerName,
      ownerEmail,
      supportPhone,
      currency,
      address,
      announcement
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="font-serif-display text-xl font-semibold text-stone-900">
          Store Configuration & Brand Settings
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Update your store identity, owner contact parameters, and customer-facing policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Owner Name
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Owner Email (Admin Account)
            </label>
            <input
              type="email"
              required
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Customer Support Phone
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Currency
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Distribution & Workshop Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Storefront Announcement Header
            </label>
            <textarea
              rows={2}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all store settings, products, and orders back to defaults?')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
