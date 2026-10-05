import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, OrderRequest, CartItem, OrderStatus, UserProfile, UserRole, StoreConfig, DeliveryTier } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, OWNER_USER, INITIAL_USERS, DEFAULT_STORE_CONFIG } from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  products: Product[];
  orders: OrderRequest[];
  cart: CartItem[];
  users: UserProfile[];
  currentView: 'storefront' | 'merchant' | 'order-tracker' | 'my-orders';
  setCurrentView: (view: 'storefront' | 'merchant' | 'order-tracker' | 'my-orders') => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  // User & Role Management
  currentUser: UserProfile;
  isOwner: boolean;
  switchRole: (role: UserRole) => void;
  switchActiveUser: (user: UserProfile) => void;
  loginAsOwner: () => void;
  loginAsCustomer: (name: string, email: string) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;

  // Account Management in Admin Panel
  createUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    company?: string;
    password?: string;
  }) => UserProfile;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;

  // Store Brand Configuration
  storeConfig: StoreConfig;
  updateStoreConfig: (updates: Partial<StoreConfig>) => void;

  // Product Actions (Add / Remove / Edit)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  removeMultipleProducts: (ids: string[]) => void;
  adjustStock: (id: string, newStock: number) => void;

  // Order Actions
  submitOrderRequest: (orderData: {
    customer: OrderRequest['customer'];
    items: OrderRequest['items'];
    notes?: string;
    paymentPreference: OrderRequest['paymentPreference'];
    shippingFee: number;
    discount?: number;
  }) => OrderRequest;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingCarrier?: string,
    trackingNumber?: string
  ) => void;
  updateOrder: (orderId: string, updates: Partial<OrderRequest>) => void;
  deleteOrder: (orderId: string) => void;

  // Cart Actions
  addToCart: (
    product: Product,
    quantity?: number,
    selectedOption?: string,
    deliveryTier?: DeliveryTier
  ) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    selectedOption?: string,
    deliveryTier?: DeliveryTier
  ) => void;
  updateCartDeliveryTier: (
    productId: string,
    newTier: DeliveryTier,
    selectedOption?: string,
    currentTier?: DeliveryTier
  ) => void;
  removeFromCart: (
    productId: string,
    selectedOption?: string,
    deliveryTier?: DeliveryTier
  ) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Reset
  resetToSampleData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'tikmillions_store_products_v3',
  ORDERS: 'tikmillions_store_orders_v3',
  CART: 'tikmillions_store_cart_v3',
  USER: 'tikmillions_store_user_v3',
  USERS: 'tikmillions_store_all_users_v3',
  CONFIG: 'tikmillions_store_config_v3'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : OWNER_USER;
    } catch {
      return OWNER_USER;
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<OrderRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentView, setCurrentView] = useState<'storefront' | 'merchant' | 'order-tracker' | 'my-orders'>('storefront');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(storeConfig));
    } catch (e) {
      console.error(e);
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Roles & Auth
  const isOwner = currentUser.role === 'admin';

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      loginAsOwner();
    } else {
      const firstCustomer = users.find((u) => u.role === 'customer') || INITIAL_USERS[2];
      switchActiveUser(firstCustomer);
    }
  };

  const switchActiveUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'customer' && currentView === 'merchant') {
      setCurrentView('storefront');
    }
    addToast(`Switched active user to ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  const loginAsOwner = () => {
    const ownerAccount = users.find((u) => u.email === OWNER_USER.email) || OWNER_USER;
    setCurrentUser(ownerAccount);
    addToast('Authenticated as Tikmillions Store Owner & Admin', 'success');
  };

  const loginAsCustomer = (name: string, email: string) => {
    // Check if user already exists
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      switchActiveUser(existing);
      return;
    }

    const newUser: UserProfile = {
      id: `usr-cust-${Date.now().toString(36)}`,
      name: name || 'Customer User',
      email: email || 'customer@example.com',
      role: 'customer',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    if (currentView === 'merchant') {
      setCurrentView('storefront');
    }
    addToast(`Signed in as customer: ${newUser.name}`, 'info');
  };

  // Admin Account Creation directly from panel
  const createUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    company?: string;
    password?: string;
  }): UserProfile => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setUsers((prev) => [newUser, ...prev]);
    addToast(
      `Created new ${userData.role === 'admin' ? 'Admin' : 'Customer'} account for "${userData.name}"`,
      'success'
    );
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          if (currentUser.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    addToast('User account updated successfully', 'success');
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target?.email === OWNER_USER.email) {
      addToast('Cannot delete primary store owner account', 'warning');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser.id === id) {
      setCurrentUser(OWNER_USER);
    }
    addToast(`Removed account "${target?.name || 'User'}"`, 'info');
  };

  const updateStoreConfig = (updates: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({ ...prev, ...updates }));
    addToast('Store settings updated', 'success');
  };

  // Products CRUD: Add and Remove Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Added "${newProduct.name}" to catalog`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Product details updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const found = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    addToast(`Removed "${found?.name || 'Product'}" from store`, 'info');
  };

  const removeMultipleProducts = (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setCart((prev) => prev.filter((item) => !ids.includes(item.product.id)));
    addToast(`Removed ${ids.length} products from store`, 'info');
  };

  const adjustStock = (id: string, newStock: number) => {
    const val = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: val } : p))
    );
    addToast(`Inventory stock adjusted to ${val}`, 'info');
  };

  // Order Request Submissions & Processing
  const submitOrderRequest = (data: {
    customer: OrderRequest['customer'];
    items: OrderRequest['items'];
    notes?: string;
    paymentPreference: OrderRequest['paymentPreference'];
    shippingFee: number;
    discount?: number;
  }): OrderRequest => {
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = data.discount || 0;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal - discount + data.shippingFee + tax);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `TIK-${randomSuffix}`;

    const newOrder: OrderRequest = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: data.customer,
      items: data.items,
      status: 'pending',
      notes: data.notes || '',
      merchantNotes: '',
      paymentPreference: data.paymentPreference,
      paymentStatus: 'unpaid',
      subtotal,
      shippingFee: data.shippingFee,
      tax,
      discount,
      total,
      history: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: `Order request submitted by ${data.customer.name} via Tikmillions Storefront.`,
          actor: 'customer'
        }
      ]
    };

    // Auto-register customer account if email doesn't exist
    const custExists = users.some(
      (u) => u.email.toLowerCase() === data.customer.email.toLowerCase()
    );
    if (!custExists) {
      const autoUser: UserProfile = {
        id: `usr-cust-${Date.now().toString(36)}`,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        company: data.customer.company,
        role: 'customer',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      setUsers((prev) => [...prev, autoUser]);
    }

    // Deduct available stock
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = data.items.find((item) => item.productId === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity)
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addToast(`Order request #${orderId} submitted to Tikmillions Store!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingCarrier?: string,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const timelineEvent = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note:
            note ||
            (newStatus === 'approved'
              ? 'Order request approved by Tikmillions Store Owner.'
              : newStatus === 'processing'
              ? 'Moved into Tikmillions packing & preparation queue.'
              : newStatus === 'shipped'
              ? `Dispatched via ${trackingCarrier || 'courier'} (${trackingNumber || 'Tracking ID assigned'}).`
              : newStatus === 'completed'
              ? 'Order fulfilled and confirmed delivered.'
              : newStatus === 'cancelled'
              ? 'Order request declined or cancelled by store owner.'
              : 'Status updated.'),
          actor: 'owner' as const
        };

        const updates: Partial<OrderRequest> = {
          status: newStatus,
          updatedAt: new Date().toISOString(),
          history: [...order.history, timelineEvent]
        };

        if (trackingCarrier) updates.trackingCarrier = trackingCarrier;
        if (trackingNumber) updates.trackingNumber = trackingNumber;
        if (newStatus === 'shipped' && order.paymentStatus === 'unpaid' && order.paymentPreference === 'card') {
          updates.paymentStatus = 'paid';
        }

        return { ...order, ...updates };
      })
    );

    addToast(`Order #${orderId} updated to ${newStatus}`, 'success');
  };

  const updateOrder = (orderId: string, updates: Partial<OrderRequest>) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      })
    );
    addToast(`Order #${orderId} updated`, 'info');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    addToast(`Order #${orderId} removed from records`, 'info');
  };

  // Cart Management
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedOption?: string,
    deliveryTier: DeliveryTier = 'standard_2_weeks'
  ) => {
    const chosenOption = selectedOption || (product.options ? product.options.choices[0] : undefined);
    const chosenTier = deliveryTier || 'standard_2_weeks';

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedOption === chosenOption &&
          (item.deliveryTier || 'standard_2_weeks') === chosenTier
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          { product, quantity, selectedOption: chosenOption, deliveryTier: chosenTier }
        ];
      }
    });

    const speedLabel = chosenTier === 'express_5_7_days' ? '5–7 Days Express' : 'Standard 2-Weeks';
    addToast(`Added ${quantity}x "${product.name}" (${speedLabel}) to request`, 'success');
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    selectedOption?: string,
    deliveryTier?: DeliveryTier
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedOption, deliveryTier);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedOption === selectedOption &&
          (item.deliveryTier || 'standard_2_weeks') === (deliveryTier || 'standard_2_weeks')
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const updateCartDeliveryTier = (
    productId: string,
    newTier: DeliveryTier,
    selectedOption?: string,
    currentTier: DeliveryTier = 'standard_2_weeks'
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedOption === selectedOption &&
          (item.deliveryTier || 'standard_2_weeks') === currentTier
        ) {
          return { ...item, deliveryTier: newTier };
        }
        return item;
      })
    );
    const speedLabel = newTier === 'express_5_7_days' ? '5–7 Days Courier' : 'Standard 2-Weeks';
    addToast(`Delivery speed updated to ${speedLabel}`, 'info');
  };

  const removeFromCart = (
    productId: string,
    selectedOption?: string,
    deliveryTier?: DeliveryTier
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedOption === selectedOption &&
            (item.deliveryTier || 'standard_2_weeks') === (deliveryTier || 'standard_2_weeks')
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setUsers(INITIAL_USERS);
    setCart([]);
    setCurrentUser(OWNER_USER);
    setStoreConfig(DEFAULT_STORE_CONFIG);
    addToast('Tikmillions Store reset to factory sample data', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        users,
        currentView,
        setCurrentView,
        trackingOrderId,
        setTrackingOrderId,
        currentUser,
        isOwner,
        switchRole,
        switchActiveUser,
        loginAsOwner,
        loginAsCustomer,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        createUser,
        updateUser,
        deleteUser,
        storeConfig,
        updateStoreConfig,
        addProduct,
        updateProduct,
        deleteProduct,
        removeMultipleProducts,
        adjustStock,
        submitOrderRequest,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        addToCart,
        updateCartQuantity,
        updateCartDeliveryTier,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toasts,
        addToast,
        removeToast,
        resetToSampleData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
