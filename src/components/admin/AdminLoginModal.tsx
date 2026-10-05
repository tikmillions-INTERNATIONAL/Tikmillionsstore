import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, X, ArrowRight, UserCheck } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    users,
    switchActiveUser,
    loginAsOwner,
    setCurrentView,
    storeConfig
  } = useStore();

  const adminUsers = users.filter((u) => u.role === 'admin');
  const [selectedAdminEmail, setSelectedAdminEmail] = useState(adminUsers[0]?.email || storeConfig.ownerEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const foundAdmin = users.find(
      (u) => u.email.toLowerCase() === selectedAdminEmail.toLowerCase() && u.role === 'admin'
    );

    if (foundAdmin) {
      switchActiveUser(foundAdmin);
      setIsAdminLoginModalOpen(false);
      setCurrentView('merchant');
    } else {
      setError('This email does not have Admin access privileges.');
    }
  };

  const handleQuickLoginAs = (userEmail: string) => {
    const foundAdmin = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (foundAdmin) {
      switchActiveUser(foundAdmin);
      setIsAdminLoginModalOpen(false);
      setCurrentView('merchant');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Security Gateway
              </span>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Admin Panel Access
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-800">Store:</span>
            <span className="font-bold text-stone-900">{storeConfig.storeName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-800">Authorized Admins:</span>
            <span className="font-mono-num font-semibold text-emerald-800">{adminUsers.length} accounts configured</span>
          </div>
        </div>

        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Admin Account
            </label>
            <select
              value={selectedAdminEmail}
              onChange={(e) => {
                setSelectedAdminEmail(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono-num cursor-pointer"
            >
              {adminUsers.map((adm) => (
                <option key={adm.id} value={adm.email}>
                  {adm.name} — {adm.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Admin Password / Passcode
              </label>
              <span className="text-[11px] text-stone-400">Demo enabled</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode or click below..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Log In to Admin Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick One-Click Admin Sign-Ins */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <p className="text-[11px] text-stone-500 text-center">
            One-click sign-in as registered admin:
          </p>
          <div className="space-y-1.5">
            {adminUsers.map((adm) => (
              <button
                key={adm.id}
                type="button"
                onClick={() => handleQuickLoginAs(adm.email)}
                className="w-full py-1.5 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-between cursor-pointer border border-stone-200 text-left"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{adm.name}</span>
                </div>
                <span className="font-mono-num text-[11px] text-stone-500">{adm.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
