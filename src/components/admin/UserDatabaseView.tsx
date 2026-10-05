import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserProfile, UserRole } from '../../types';
import { OWNER_USER } from '../../data/initialData';
import {
  Database,
  Search,
  UserPlus,
  ShieldCheck,
  User,
  Edit2,
  Trash2,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Phone,
  Mail,
  MapPin,
  Building,
  Key,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Eye,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export const UserDatabaseView: React.FC = () => {
  const {
    users,
    orders,
    updateUser,
    createUser,
    deleteUser,
    currentUser,
    switchActiveUser,
    addToast
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'orders' | 'spend'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [inspectingUserOrders, setInspectingUserOrders] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('customer');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editDiscountTier, setEditDiscountTier] = useState<UserProfile['discountTier']>('Standard');
  const [editStreet, setEditStreet] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editZip, setEditZip] = useState('');
  const [editCountry, setEditCountry] = useState('United States');
  const [editPassword, setEditPassword] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Form states for adding new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [newUserStreet, setNewUserStreet] = useState('');
  const [newUserCity, setNewUserCity] = useState('');
  const [newUserState, setNewUserState] = useState('');
  const [newUserZip, setNewUserZip] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('United States');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserNotes, setNewUserNotes] = useState('');

  // Calculate live user metrics and orders count/total spend
  const usersWithComputedData = useMemo(() => {
    return users.map((u) => {
      const userOrders = orders.filter(
        (o) => o.customer.email.toLowerCase() === u.email.toLowerCase()
      );
      const computedOrdersCount = userOrders.length || u.ordersCount || 0;
      const computedTotalSpend =
        userOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0) ||
        u.totalSpent ||
        0;

      return {
        ...u,
        computedOrdersCount,
        computedTotalSpend,
        orders: userOrders
      };
    });
  }, [users, orders]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return usersWithComputedData
      .filter((u) => {
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          (u.company && u.company.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q)) ||
          (u.notes && u.notes.toLowerCase().includes(q));

        return matchesRole && matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'orders') {
          diff = a.computedOrdersCount - b.computedOrdersCount;
        } else if (sortBy === 'spend') {
          diff = a.computedTotalSpend - b.computedTotalSpend;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [usersWithComputedData, roleFilter, statusFilter, searchQuery, sortBy, sortOrder]);

  // Overall database KPIs
  const totalUsersCount = users.length;
  const customersCount = users.filter((u) => u.role === 'customer').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const totalLTV = usersWithComputedData.reduce((sum, u) => sum + u.computedTotalSpend, 0);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast(`Copied user ID ${id}`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email || '');
    setEditRole(u.role || 'customer');
    setEditStatus(u.status || 'active');
    setEditPhone(u.phone || '');
    setEditCompany(u.company || '');
    setEditDiscountTier(u.discountTier || 'Standard');
    setEditStreet(u.street || '');
    setEditCity(u.city || '');
    setEditState(u.state || '');
    setEditZip(u.zip || '');
    setEditCountry(u.country || 'United States');
    setEditPassword(u.password || '');
    setEditNotes(u.notes || '');
  };

  const handleSaveUserEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim() || !editEmail.trim()) {
      addToast('Full Name and Email address are required fields', 'warning');
      return;
    }

    updateUser(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      role: editRole,
      status: editStatus,
      phone: editPhone.trim() || undefined,
      company: editCompany.trim() || undefined,
      discountTier: editDiscountTier,
      street: editStreet.trim() || undefined,
      city: editCity.trim() || undefined,
      state: editState.trim() || undefined,
      zip: editZip.trim() || undefined,
      country: editCountry.trim() || 'United States',
      password: editPassword.trim() || undefined,
      notes: editNotes.trim() || undefined
    });

    setEditingUser(null);
    addToast(`Successfully updated database record for "${editName}"`, 'success');
  };

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      addToast('Name and Email are required to register a user', 'warning');
      return;
    }

    createUser({
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      phone: newUserPhone.trim() || undefined,
      company: newUserCompany.trim() || undefined,
      password: newUserPassword.trim() || undefined
    });

    // Also update any address/notes details if provided
    const created = users.find((u) => u.email.toLowerCase() === newUserEmail.trim().toLowerCase());
    if (created && (newUserStreet || newUserCity || newUserNotes)) {
      updateUser(created.id, {
        street: newUserStreet.trim() || undefined,
        city: newUserCity.trim() || undefined,
        state: newUserState.trim() || undefined,
        zip: newUserZip.trim() || undefined,
        country: newUserCountry.trim() || 'United States',
        notes: newUserNotes.trim() || undefined
      });
    }

    setIsAddUserModalOpen(false);
    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserCompany('');
    setNewUserStreet('');
    setNewUserCity('');
    setNewUserState('');
    setNewUserZip('');
    setNewUserPassword('');
    setNewUserNotes('');
  };

  const handleToggleStatus = (u: UserProfile) => {
    if (u.email === OWNER_USER.email) {
      addToast('Cannot suspend the primary store owner account', 'warning');
      return;
    }
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    updateUser(u.id, { status: newStatus });
    addToast(`Account for "${u.name}" is now ${newStatus.toUpperCase()}`, 'info');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tikmillions_users_database_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported User Database JSON successfully', 'success');
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Status',
      'Phone',
      'Company',
      'DiscountTier',
      'Street',
      'City',
      'State',
      'Zip',
      'Country',
      'OrdersCount',
      'TotalSpendUSD',
      'CreatedAt',
      'Notes'
    ];

    const rows = usersWithComputedData.map((u) => [
      `"${u.id}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.phone || ''}"`,
      `"${(u.company || '').replace(/"/g, '""')}"`,
      `"${u.discountTier || 'Standard'}"`,
      `"${(u.street || '').replace(/"/g, '""')}"`,
      `"${(u.city || '').replace(/"/g, '""')}"`,
      `"${u.state || ''}"`,
      `"${u.zip || ''}"`,
      `"${u.country || 'United States'}"`,
      u.computedOrdersCount,
      u.computedTotalSpend.toFixed(2),
      `"${u.createdAt}"`,
      `"${(u.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `tikmillions_users_database_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported User Database CSV successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-red-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-red-600" />
              <span>User Database Registry</span>
            </span>
            <span className="text-xs font-semibold text-stone-500 font-mono-num">
              v3.0 Persistent Records
            </span>
          </div>
          <h2 className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 mt-1">
            User Database & Profile Registry
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Inspect all registered user database records, manage roles and permissions, and edit any contact, billing, or security detail.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download database as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Export raw JSON database schema"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ring-1 ring-red-800"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add User to Database</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Users</span>
            <Database className="w-4 h-4 text-red-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-2xl font-bold text-stone-900">{totalUsersCount}</span>
            <span className="text-[11px] text-emerald-700 font-medium">{activeCount} active</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Customers</span>
            <User className="w-4 h-4 text-stone-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-2xl font-bold text-stone-900">{customersCount}</span>
            <span className="text-[11px] text-stone-400">clients registered</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Store Admins</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-2xl font-bold text-stone-900">{adminsCount}</span>
            <span className="text-[11px] text-emerald-700 font-medium">full access</span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-rose-50/70 to-white rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-red-900 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Customer LTV</span>
            <DollarSign className="w-4 h-4 text-red-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-2xl font-bold text-red-950">
              ${totalLTV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Database Search & Filters Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user ID, name, email, city, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-700/10 focus:border-red-700"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg text-xs font-medium">
            {(['all', 'customer', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {r === 'all' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort by:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="date">Date Created</option>
            <option value="name">Full Name</option>
            <option value="orders">Orders Placed</option>
            <option value="spend">Total Spend ($)</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900 text-xs font-mono-num cursor-pointer"
            title="Toggle sort direction"
          >
            {sortOrder === 'asc' ? 'ASC ↑' : 'DESC ↓'}
          </button>
        </div>
      </div>

      {/* Database Records Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-3">Database Key</th>
                <th className="py-3 px-4">User Profile & Contact</th>
                <th className="py-3 px-4">Location / Address</th>
                <th className="py-3 px-4 text-center">Account Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">LTV & Orders</th>
                <th className="py-3 px-4 text-right">Database Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500 text-xs">
                    No user records match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPrimaryOwner = u.email === OWNER_USER.email;
                  const isCurrent = currentUser.id === u.id;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isCurrent ? 'bg-amber-50/30' : 'hover:bg-stone-50/70'
                      }`}
                    >
                      {/* Database Key / ID */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono-num text-[11px] text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-700">{u.id}</span>
                          <button
                            onClick={() => handleCopyId(u.id)}
                            className="p-1 hover:text-stone-900 text-stone-400 rounded cursor-pointer"
                            title="Copy User ID"
                          >
                            {copiedId === u.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* User Profile & Contact */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-50 text-red-900 border border-rose-200'
                            }`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900 block truncate">
                                {u.name}
                              </span>
                              {isPrimaryOwner && (
                                <span className="text-[9px] uppercase font-bold text-red-800 bg-rose-50 border border-rose-200 px-1 rounded">
                                  Owner
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5 truncate">
                              <span className="font-mono-num">{u.email}</span>
                              {u.phone && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono-num">{u.phone}</span>
                                </>
                              )}
                            </div>
                            {u.company && (
                              <span className="text-[10px] text-stone-400 block truncate">
                                {u.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location / Address */}
                      <td className="py-3.5 px-4 text-xs text-stone-600 min-w-[150px]">
                        {u.city ? (
                          <div>
                            <span className="font-medium text-stone-800 block">
                              {u.city}{u.state ? `, ${u.state}` : ''}
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              {u.street || u.country || 'USA'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">No address on file</span>
                        )}
                      </td>

                      {/* Account Role */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Admin Access</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isPrimaryOwner}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer transition-colors ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                          } disabled:opacity-70 disabled:cursor-not-allowed`}
                          title={isPrimaryOwner ? 'Primary owner cannot be suspended' : 'Click to toggle Active / Suspended'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <span>{u.status}</span>
                        </button>
                      </td>

                      {/* LTV & Orders */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono-num font-bold text-stone-900 block text-xs">
                          ${u.computedTotalSpend.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setInspectingUserOrders(u)}
                          className="text-[10px] text-red-700 hover:text-red-900 underline font-medium cursor-pointer"
                        >
                          {u.computedOrdersCount} order{u.computedOrdersCount !== 1 ? 's' : ''}
                        </button>
                      </td>

                      {/* Database Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Details Button */}
                          <button
                            onClick={() => openEditModal(u)}
                            className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-red-50 hover:text-red-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-stone-200"
                            title="Edit any detail (contact, role, address, password, notes)"
                          >
                            <Edit2 className="w-3 h-3 text-red-700" />
                            <span>Edit Details</span>
                          </button>

                          {/* Quick Switch / Impersonate */}
                          <button
                            onClick={() => switchActiveUser(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-stone-900 text-white'
                                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                            }`}
                            title="Switch active session to this user"
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete from DB */}
                          {!isPrimaryOwner && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete record from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL USER RECORD EDITOR MODAL (Edit ANY Detail) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-red-700 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    User Database Editor · ID: {editingUser.id}
                  </span>
                  <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-0.5">
                    Edit User Record: {editingUser.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comprehensive Multi-Section Form */}
            <form onSubmit={handleSaveUserEdits} className="space-y-6">
              {/* Section 1: Identity & Credentials */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-700 block pb-1 border-b border-stone-100">
                  1. Identity & Account Credentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Account Access Role
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      disabled={editingUser.email === OWNER_USER.email}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg disabled:opacity-60 cursor-pointer"
                    >
                      <option value="customer">Customer Access (Requisition Shopper)</option>
                      <option value="admin">Admin Access (Store Management Operator)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Account Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      disabled={editingUser.email === OWNER_USER.email}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg disabled:opacity-60 cursor-pointer"
                    >
                      <option value="active">Active (Full Access Allowed)</option>
                      <option value="suspended">Suspended (Login Blocked)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Passcode / Password Hash
                    </label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank or enter custom passcode"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono-num"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Business & Contact */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-700 block pb-1 border-b border-stone-100">
                  2. Business & Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      placeholder="e.g. Studio Rostova LLC"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Wholesale / Pricing Tier
                    </label>
                    <select
                      value={editDiscountTier}
                      onChange={(e) => setEditDiscountTier(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg cursor-pointer"
                    >
                      <option value="Standard">Standard Retail Pricing</option>
                      <option value="Wholesale Tier 1 (10% off)">Wholesale Tier 1 (10% catalog discount)</option>
                      <option value="VIP Studio (15% off)">VIP Studio Partner (15% catalog discount)</option>
                      <option value="Contract Partner">Contract / Enterprise Partner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Address & Shipping */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-700 block pb-1 border-b border-stone-100">
                  3. Physical Address & Shipping Destination
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={editStreet}
                      onChange={(e) => setEditStreet(e.target.value)}
                      placeholder="e.g. 4240 18th Street Suite 200"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      placeholder="CA"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={editZip}
                      onChange={(e) => setEditZip(e.target.value)}
                      placeholder="94114"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Internal CRM Notes */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-700 block pb-1 border-b border-stone-100">
                  4. Merchant Internal Notes & Relationship Remarks
                </span>
                <div>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add private store remarks, delivery preferences, or credit terms for this user..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono-num">
                  Record Created: {new Date(editingUser.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors shadow-xs cursor-pointer ring-1 ring-red-800"
                  >
                    Save Changes to Database
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER ORDER HISTORY INSPECTOR MODAL */}
      {inspectingUserOrders && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-red-700 flex items-center justify-center border border-rose-200">
                  <ShoppingBag className="w-4 h-4 text-red-700" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-red-700">
                    Order Requisition History
                  </span>
                  <h3 className="font-serif-display text-lg font-bold text-stone-900">
                    {inspectingUserOrders.name} ({inspectingUserOrders.email})
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectingUserOrders(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List user orders */}
            {orders.filter((o) => o.customer.email.toLowerCase() === inspectingUserOrders.email.toLowerCase()).length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-500">
                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>No order requests recorded yet for this customer account.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders
                  .filter((o) => o.customer.email.toLowerCase() === inspectingUserOrders.email.toLowerCase())
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-num font-bold text-stone-900 text-sm">{ord.id}</span>
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-stone-200 text-stone-800">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600 text-[11px]">
                        <span>{new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} item(s)</span>
                        <span className="font-mono-num font-bold text-red-900">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setInspectingUserOrders(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-red-700 block">
                    Database Registration
                  </span>
                  <h3 className="font-serif-display text-xl font-bold text-stone-900">
                    Add New User to Database
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setNewUserRole('customer')}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    newUserRole === 'customer'
                      ? 'border-red-700 bg-rose-50/50 shadow-xs ring-1 ring-red-700'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold text-xs block text-stone-900">Customer Access</span>
                  <span className="text-[10px] text-stone-500">Regular buyer & client</span>
                </div>

                <div
                  onClick={() => setNewUserRole('admin')}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    newUserRole === 'admin'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold text-xs block text-emerald-900">Admin Access</span>
                  <span className="text-[10px] text-stone-500">Store operator & manager</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jonathan Hayes"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="j.hayes@example.com"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono-num"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newUserCompany}
                    onChange={(e) => setNewUserCompany(e.target.value)}
                    placeholder="Studio or Firm"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State / Zip</label>
                  <input
                    type="text"
                    value={newUserState}
                    onChange={(e) => setNewUserState(e.target.value)}
                    placeholder="State or Region"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Initial Password / Passcode</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Optional initial passcode"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg cursor-pointer ring-1 ring-red-800"
                >
                  Create User Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Delete User Database Record?
              </h3>
              <p className="text-xs text-stone-600">
                Are you sure you want to permanently delete <span className="font-semibold text-stone-900">"{userToDelete.name}"</span> ({userToDelete.email}) from the database?
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
