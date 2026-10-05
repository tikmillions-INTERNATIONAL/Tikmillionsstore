import { Product, OrderRequest, UserProfile, StoreConfig } from '../types';

export const OWNER_USER: UserProfile = {
  id: 'usr-owner-01',
  name: 'Tikmillions (Owner)',
  email: 'tikmillions@gmail.com',
  role: 'admin',
  phone: '+1 (555) 789-2026',
  company: 'Tikmillions Store HQ',
  street: '742 Evergreen Terrace Suite 400',
  city: 'San Francisco',
  state: 'CA',
  zip: '94107',
  country: 'United States',
  notes: 'Primary store founder, administrator, and fulfillment lead.',
  discountTier: 'Contract Partner',
  totalSpent: 0,
  ordersCount: 0,
  createdAt: '2026-09-01T08:00:00Z',
  status: 'active'
};

export const INITIAL_USERS: UserProfile[] = [
  OWNER_USER,
  {
    id: 'usr-admin-02',
    name: 'Sarah Chen (Store Ops)',
    email: 'sarah.ops@tikmillions.store',
    role: 'admin',
    phone: '+1 (555) 302-9912',
    company: 'Tikmillions Logistics',
    street: '550 Montgomery St Suite 800',
    city: 'San Francisco',
    state: 'CA',
    zip: '94111',
    country: 'United States',
    notes: 'Warehouse operations manager. Handles packing slip generation & freight carrier scheduling.',
    discountTier: 'Standard',
    totalSpent: 0,
    ordersCount: 0,
    createdAt: '2026-09-10T11:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-cust-01',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    role: 'customer',
    phone: '+1 (415) 302-8819',
    company: 'Studio Rostova',
    street: '4240 18th Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94114',
    country: 'United States',
    notes: 'High-frequency architectural ceramic buyer. Prefers expedited 5-7 days courier delivery.',
    discountTier: 'Wholesale Tier 1 (10% off)',
    totalSpent: 875.50,
    ordersCount: 4,
    createdAt: '2026-09-12T14:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-cust-02',
    name: 'Julian Rivera',
    email: 'j.rivera@solsticecoffee.com',
    role: 'customer',
    phone: '+1 (415) 892-4412',
    company: 'Solstice Specialty Coffee',
    street: '1890 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    notes: 'Wholesale client ordering drip sets and modular organizers for 3 retail locations.',
    discountTier: 'VIP Studio (15% off)',
    totalSpent: 1420.00,
    ordersCount: 6,
    createdAt: '2026-09-18T09:15:00Z',
    status: 'active'
  },
  {
    id: 'usr-cust-03',
    name: 'Claire Dupont',
    email: 'claire@atelierdupont.design',
    role: 'customer',
    phone: '+1 (212) 555-0193',
    company: 'Atelier Dupont Interiors',
    street: '72 Franklin Street',
    city: 'New York',
    state: 'NY',
    zip: '10013',
    country: 'United States',
    notes: 'Interior styling studio in Manhattan. Regular customer for Belgian linen and cast iron cookware.',
    discountTier: 'Standard',
    totalSpent: 620.00,
    ordersCount: 2,
    createdAt: '2026-09-22T16:45:00Z',
    status: 'active'
  }
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Tikmillions Store',
  ownerName: 'Tikmillions',
  ownerEmail: 'tikmillions@gmail.com',
  supportPhone: '+1 (555) 789-2026',
  currency: 'USD ($)',
  address: 'Tikmillions Distribution Suite 400, San Francisco, CA 94107',
  announcement: 'Welcome to Tikmillions Store. Custom wholesale & retail order requests processed within 24h.'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Artisanal Speckled Pour-Over Set',
    sku: 'TIK-KIT-01',
    category: 'Kitchen & Table',
    price: 68.0,
    standardDeliveryPrice: 68.0,
    expressDeliveryPrice: 85.0,
    costPrice: 28.0,
    stock: 24,
    minOrderQuantity: 1,
    description: 'Hand-thrown speckled stoneware dripper with matching 350ml cup. Designed with internal helical ridges for steady flow extraction and thermal retention.',
    details: [
      'Material: High-fire stoneware, food-safe feldspathic glaze',
      'Filter compatibility: Standard conical #02 filters',
      'Standard 2-Weeks Delivery: $68.00 | Express 5-7 Days: $85.00',
      'Dishwasher and microwave safe'
    ],
    imageUrl: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg',
    status: 'active',
    leadTimeDays: 2,
    options: {
      name: 'Finish',
      choices: ['Speckled Sand', 'Chalk Matte', 'Obsidian Slate']
    },
    createdAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Cast Iron Dutch Oven & Braiser (4.2L)',
    sku: 'TIK-KIT-02',
    category: 'Kitchen & Table',
    price: 185.0,
    standardDeliveryPrice: 185.0,
    expressDeliveryPrice: 220.0,
    costPrice: 85.0,
    stock: 12,
    minOrderQuantity: 1,
    description: 'Heavyweight matte enameled cast iron round cocotte with solid brushed brass lid pull. Exceptional heat distribution and retention for slow braises and artisan crusty breads.',
    details: [
      'Capacity: 4.2 Liters / 4.5 Quarts',
      'Solid brushed brass handle (oven safe up to 500°F / 260°C)',
      'Standard 2-Weeks Delivery: $185.00 | Express 5-7 Days: $220.00',
      'Compatible with Induction, Gas, Electric, and Ceramic cooktops'
    ],
    imageUrl: '/src/assets/images/product_cast_iron_pot_1791156133998.jpg',
    status: 'active',
    leadTimeDays: 3,
    options: {
      name: 'Colorway',
      choices: ['Matte Pitch Black', 'Smoked Sage', 'Deep Terracotta']
    },
    createdAt: '2026-09-18T11:30:00Z'
  },
  {
    id: 'prod-003',
    name: 'Precision Walnut Desk Modular Console',
    sku: 'TIK-OBJ-03',
    category: 'Objects & Studio',
    price: 124.0,
    standardDeliveryPrice: 124.0,
    expressDeliveryPrice: 155.0,
    costPrice: 48.0,
    stock: 18,
    minOrderQuantity: 1,
    description: 'Sculpted from sustainably harvested American black walnut with solid brass card/pen slots and concealed magnetic cable channels. Hand-finished by Tikmillions artisans.',
    details: [
      'Wood: Kiln-dried American Black Walnut (FSC Certified)',
      'Dimensions: 360mm x 140mm x 28mm',
      'Standard 2-Weeks Delivery: $124.00 | Express 5-7 Days: $155.00',
      'Crafted in small numbered batches for Tikmillions Store'
    ],
    imageUrl: '/src/assets/images/product_walnut_organizer_1791156143048.jpg',
    status: 'active',
    leadTimeDays: 2,
    options: {
      name: 'Timber',
      choices: ['Solid American Walnut', 'Bleached White Oak']
    },
    createdAt: '2026-09-22T08:15:00Z'
  },
  {
    id: 'prod-004',
    name: 'Belgian Washed Linen Throw & Pillow Set',
    sku: 'TIK-TEX-04',
    category: 'Textiles & Living',
    price: 145.0,
    standardDeliveryPrice: 145.0,
    expressDeliveryPrice: 175.0,
    costPrice: 56.0,
    stock: 8,
    minOrderQuantity: 1,
    description: 'Pure flax linen throw woven in Flanders, garment-washed with pumice stones for a cloud-soft drape. Paired with a matching 50x50cm wool-cushion case.',
    details: [
      'Fiber: 100% Belgian Certified Flax Linen (240 GSM)',
      'Throw Dimensions: 140cm x 200cm with eyelash fringe',
      'Standard 2-Weeks Delivery: $145.00 | Express 5-7 Days: $175.00',
      'Gentle machine wash cold, tumble dry low'
    ],
    imageUrl: '/src/assets/images/product_linen_textile_1791156152269.jpg',
    status: 'active',
    leadTimeDays: 4,
    options: {
      name: 'Palette',
      choices: ['Oatmeal Heather', 'Smoked Flax', 'Fossil Grey']
    },
    createdAt: '2026-09-25T14:40:00Z'
  },
  {
    id: 'prod-005',
    name: 'Precision Studio Gooseneck Kettle (0.9L)',
    sku: 'TIK-KIT-05',
    category: 'Kitchen & Table',
    price: 98.0,
    standardDeliveryPrice: 98.0,
    expressDeliveryPrice: 125.0,
    costPrice: 42.0,
    stock: 5,
    minOrderQuantity: 1,
    description: 'Balanced counterweighted handle with narrow gooseneck spout for surgical pour rate control. Integrated analog dial temperature gauge recessed into the brushed steel lid.',
    details: [
      'Capacity: 900ml',
      'Material: 304 High-Grade Stainless Steel & Walnut Grip',
      'Standard 2-Weeks Delivery: $98.00 | Express 5-7 Days: $125.00',
      'Direct flame and induction compatible'
    ],
    imageUrl: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg',
    status: 'active',
    leadTimeDays: 2,
    options: {
      name: 'Finish',
      choices: ['Brushed Steel', 'Matte Black', 'Raw Copper']
    },
    createdAt: '2026-09-28T09:20:00Z'
  },
  {
    id: 'prod-006',
    name: 'Hand-Fluted Amber Glass Decanter & Tumbler',
    sku: 'TIK-OBJ-06',
    category: 'Objects & Studio',
    price: 76.0,
    standardDeliveryPrice: 76.0,
    expressDeliveryPrice: 95.0,
    costPrice: 30.0,
    stock: 15,
    minOrderQuantity: 1,
    description: 'Mouth-blown borosilicate glass featuring delicate vertical fluting and amber tint. Designed to aerate fine spirits or elevate daily bedside hydration.',
    details: [
      'Capacity: Decanter 800ml; Tumbler 280ml',
      'Thermal shock resistant (-20°C to 150°C)',
      'Standard 2-Weeks Delivery: $76.00 | Express 5-7 Days: $95.00',
      'Handcrafted by generational glassmakers'
    ],
    imageUrl: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg',
    status: 'active',
    leadTimeDays: 3,
    options: {
      name: 'Glass Tint',
      choices: ['Smoked Amber', 'Clear Optical', 'Forest Olive']
    },
    createdAt: '2026-10-01T11:00:00Z'
  }
];

export const INITIAL_ORDERS: OrderRequest[] = [
  {
    id: 'TIK-9841',
    createdAt: '2026-10-04T12:15:00Z',
    updatedAt: '2026-10-04T12:15:00Z',
    customer: {
      name: 'Julian Rivera',
      email: 'j.rivera@solsticecoffee.com',
      phone: '+1 (415) 892-4412',
      company: 'Solstice Specialty Coffee',
      street: '482 Brannan Street, Suite 300',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Artisanal Speckled Pour-Over Set',
        sku: 'TIK-KIT-01',
        price: 68.0,
        quantity: 3,
        selectedOption: 'Speckled Sand',
        deliveryTier: 'standard_2_weeks',
        imageUrl: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg'
      },
      {
        productId: 'prod-005',
        productName: 'Precision Studio Gooseneck Kettle (0.9L)',
        sku: 'TIK-KIT-05',
        price: 98.0,
        quantity: 2,
        selectedOption: 'Matte Black',
        deliveryTier: 'standard_2_weeks',
        imageUrl: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg'
      }
    ],
    status: 'pending',
    notes: 'For Tikmillions Store fulfillment: Please pack carefully for barista bar showcase. Delivery required before Oct 15th.',
    merchantNotes: 'New specialty cafe account via Tikmillions Storefront. Standard 2-week delivery selected.',
    paymentPreference: 'invoice',
    paymentStatus: 'unpaid',
    subtotal: 400.0,
    shippingFee: 25.0,
    tax: 34.0,
    discount: 0,
    total: 459.0,
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-04T12:15:00Z',
        note: 'Order request submitted to Tikmillions Store queue.',
        actor: 'customer'
      }
    ]
  },
  {
    id: 'TIK-9838',
    createdAt: '2026-10-03T15:30:00Z',
    updatedAt: '2026-10-04T09:45:00Z',
    customer: {
      name: 'Claire Dupont',
      email: 'claire@atelierdupont.design',
      phone: '+1 (212) 555-0193',
      company: 'Atelier Dupont Interiors',
      street: '72 Mercer Street, Fl 4',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-004',
        productName: 'Belgian Washed Linen Throw & Pillow Set',
        sku: 'TIK-TEX-04',
        price: 175.0,
        quantity: 2,
        selectedOption: 'Oatmeal Heather',
        deliveryTier: 'express_5_7_days',
        imageUrl: '/src/assets/images/product_linen_textile_1791156152269.jpg'
      },
      {
        productId: 'prod-003',
        productName: 'Precision Walnut Desk Modular Console',
        sku: 'TIK-OBJ-03',
        price: 155.0,
        quantity: 2,
        selectedOption: 'Solid American Walnut',
        deliveryTier: 'express_5_7_days',
        imageUrl: '/src/assets/images/product_walnut_organizer_1791156143048.jpg'
      }
    ],
    status: 'processing',
    notes: 'Rush project: Selected Express 5-7 Days delivery tier.',
    merchantNotes: 'Express fulfillment scheduled. Priority staging.',
    paymentPreference: 'wire',
    paymentStatus: 'paid',
    subtotal: 660.0,
    shippingFee: 30.0,
    tax: 52.8,
    discount: 50.0,
    total: 692.8,
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-03T15:30:00Z',
        note: 'Order request submitted.',
        actor: 'customer'
      },
      {
        status: 'approved',
        timestamp: '2026-10-03T17:00:00Z',
        note: 'Express order approved by Tikmillions Store Owner.',
        actor: 'owner'
      },
      {
        status: 'processing',
        timestamp: '2026-10-04T09:45:00Z',
        note: 'Moved to packing & staging area for express courier.',
        actor: 'owner'
      }
    ]
  },
  {
    id: 'TIK-9824',
    createdAt: '2026-10-02T10:10:00Z',
    updatedAt: '2026-10-03T14:20:00Z',
    customer: {
      name: 'Henrik Lindqvist',
      email: 'henrik@nordicgastronomy.se',
      phone: '+46 8 123 4567',
      street: 'Sveavägen 44',
      city: 'Stockholm',
      state: 'Stockholm',
      zip: '111 34',
      country: 'Sweden'
    },
    items: [
      {
        productId: 'prod-002',
        productName: 'Cast Iron Dutch Oven & Braiser (4.2L)',
        sku: 'TIK-KIT-02',
        price: 185.0,
        quantity: 2,
        selectedOption: 'Matte Pitch Black',
        deliveryTier: 'standard_2_weeks',
        imageUrl: '/src/assets/images/product_cast_iron_pot_1791156133998.jpg'
      }
    ],
    status: 'shipped',
    notes: 'Please attach customs commercial invoice for culinary studio.',
    merchantNotes: 'Dispatched via DHL Express from Tikmillions hub.',
    paymentPreference: 'card',
    paymentStatus: 'paid',
    subtotal: 370.0,
    shippingFee: 45.0,
    tax: 0.0,
    discount: 0,
    total: 415.0,
    trackingCarrier: 'DHL Express',
    trackingNumber: 'DHL-TIK-94829104',
    history: [
      {
        status: 'pending',
        timestamp: '2026-10-02T10:10:00Z',
        note: 'International order request created.',
        actor: 'customer'
      },
      {
        status: 'approved',
        timestamp: '2026-10-02T11:40:00Z',
        note: 'Approved by Tikmillions Store.',
        actor: 'owner'
      },
      {
        status: 'processing',
        timestamp: '2026-10-02T16:00:00Z',
        note: 'Packed with reinforced heavy-duty protection.',
        actor: 'owner'
      },
      {
        status: 'shipped',
        timestamp: '2026-10-03T14:20:00Z',
        note: 'Handed to DHL courier. Tracking ID: DHL-TIK-94829104.',
        actor: 'owner'
      }
    ]
  },
  {
    id: 'TIK-9802',
    createdAt: '2026-09-29T16:40:00Z',
    updatedAt: '2026-10-01T11:00:00Z',
    customer: {
      name: 'Maya Lin',
      email: 'maya.lin@gmail.com',
      phone: '+1 (503) 772-9104',
      street: '1420 NW Lovejoy St, Apt 6B',
      city: 'Portland',
      state: 'OR',
      zip: '97209',
      country: 'United States'
    },
    items: [
      {
        productId: 'prod-003',
        productName: 'Precision Walnut Desk Modular Console',
        sku: 'TIK-OBJ-03',
        price: 124.0,
        quantity: 1,
        selectedOption: 'Solid American Walnut',
        deliveryTier: 'standard_2_weeks',
        imageUrl: '/src/assets/images/product_walnut_organizer_1791156143048.jpg'
      }
    ],
    status: 'completed',
    notes: 'Gift order from Tikmillions Store. Include gift note.',
    merchantNotes: 'Delivered and confirmed signed.',
    paymentPreference: 'card',
    paymentStatus: 'paid',
    subtotal: 124.0,
    shippingFee: 12.0,
    tax: 0.0,
    discount: 0,
    total: 136.0,
    trackingCarrier: 'FedEx Ground',
    trackingNumber: 'FX-TIK-78291049',
    history: [
      {
        status: 'pending',
        timestamp: '2026-09-29T16:40:00Z',
        note: 'Order request received.',
        actor: 'customer'
      },
      {
        status: 'approved',
        timestamp: '2026-09-29T18:00:00Z',
        note: 'Order approved by Tikmillions.',
        actor: 'owner'
      },
      {
        status: 'processing',
        timestamp: '2026-09-30T09:15:00Z',
        note: 'Wrapped in branded Tikmillions packaging.',
        actor: 'owner'
      },
      {
        status: 'shipped',
        timestamp: '2026-09-30T17:00:00Z',
        note: 'Dispatched via FedEx.',
        actor: 'owner'
      },
      {
        status: 'completed',
        timestamp: '2026-10-01T11:00:00Z',
        note: 'Confirmed delivered to recipient.',
        actor: 'owner'
      }
    ]
  }
];

export const PRESET_IMAGES = [
  { label: 'Ceramic Pour-Over & Cup', url: '/src/assets/images/product_ceramic_pourover_1791156124138.jpg' },
  { label: 'Cast Iron Dutch Cocotte', url: '/src/assets/images/product_cast_iron_pot_1791156133998.jpg' },
  { label: 'Walnut Desk Console', url: '/src/assets/images/product_walnut_organizer_1791156143048.jpg' },
  { label: 'Belgian Linen Textiles', url: '/src/assets/images/product_linen_textile_1791156152269.jpg' }
];
