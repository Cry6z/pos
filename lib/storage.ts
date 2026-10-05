import { Product, Transaction, StoreSettings, Barista, CashierConfig } from "./types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "americano",
    category: "Coffee",
    price: 18000,
    stock: 45,
    sku: "cof-ame-01",
    description: "espresso shot diluted with hot water, rich & bold aroma",
  },
  {
    id: "prod-2",
    name: "cafe latte",
    category: "Coffee",
    price: 25000,
    stock: 38,
    sku: "cof-lat-02",
    description: "rich espresso balanced with creamy steamed milk and light foam",
  },
  {
    id: "prod-3",
    name: "cappuccino",
    category: "Coffee",
    price: 25000,
    stock: 32,
    sku: "cof-cap-03",
    description: "equal parts espresso, steamed milk, and velvety thick foam",
  },
  {
    id: "prod-4",
    name: "matcha latte",
    category: "Non-Coffee",
    price: 28000,
    stock: 24,
    sku: "nco-mat-01",
    description: "premium japanese green tea matcha blended with fresh steamed milk",
  },
  {
    id: "prod-5",
    name: "chocolate",
    category: "Non-Coffee",
    price: 23000,
    stock: 29,
    sku: "nco-cho-02",
    description: "dark artisanal chocolate melted with silky milk and cocoa dusting",
  },
  {
    id: "prod-6",
    name: "croissant",
    category: "Food",
    price: 20000,
    stock: 18,
    sku: "fod-cro-01",
    description: "flaky, buttery french golden pastry baked fresh daily",
  },
  {
    id: "prod-7",
    name: "french fries",
    category: "Food",
    price: 18000,
    stock: 30,
    sku: "fod-fri-02",
    description: "crispy golden cut potatoes seasoned with savory herbs and sea salt",
  },
  {
    id: "prod-8",
    name: "chicken sandwich",
    category: "Food",
    price: 30000,
    stock: 15,
    sku: "fod-swc-03",
    description: "tender grilled chicken breast, fresh lettuce, and house mayo on toasted brioche",
  },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "proticafe",
  tagline: "specialty coffee & good vibes",
  address: "jl. wr. supratman, kandang limun, kec. muara bangka hulu, sumatera, bengkulu 38371",
  phone: "+62 812-3456-7890",
  cashierName: "cashier",
  taxRate: 0,
  currencySymbol: "rp",
  receiptFooter: "thank you for your purchase!\nfollow us on instagram @proticafe",
  instagramHandle: "@proticafe",
};

export const DEFAULT_CASHIER: CashierConfig = {
  name: "cashier",
  role: "kasir front counter",
  shift: "shift 1 • front counter",
  pin: "1234",
};

export const DEMO_BARISTAS: Barista[] = [DEFAULT_CASHIER];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoice: "#inv-00128",
    date: "2026-10-05T14:30:00.000Z",
    items: [
      { id: "prod-2", name: "cafe latte", price: 25000, quantity: 2, subtotal: 50000 },
      { id: "prod-1", name: "americano", price: 18000, quantity: 1, subtotal: 18000 },
    ],
    subtotal: 68000,
    discount: 0,
    tax: 0,
    total: 68000,
    paymentMethod: "QRIS",
    amountReceived: 68000,
    change: 0,
    status: "Paid",
    cashierName: "cashier",
    customerName: "dika",
  },
  {
    id: "tx-2",
    invoice: "#inv-00127",
    date: "2026-10-05T13:45:00.000Z",
    items: [
      { id: "prod-4", name: "matcha latte", price: 28000, quantity: 1, subtotal: 28000 },
      { id: "prod-6", name: "croissant", price: 20000, quantity: 2, subtotal: 40000 },
    ],
    subtotal: 68000,
    discount: 0,
    tax: 0,
    total: 68000,
    paymentMethod: "GoPay",
    amountReceived: 68000,
    change: 0,
    status: "Paid",
    cashierName: "cashier",
    customerName: "sarah",
  },
  {
    id: "tx-3",
    invoice: "#inv-00126",
    date: "2026-10-05T12:15:00.000Z",
    items: [
      { id: "prod-3", name: "cappuccino", price: 25000, quantity: 1, subtotal: 25000 },
      { id: "prod-8", name: "chicken sandwich", price: 30000, quantity: 1, subtotal: 30000 },
      { id: "prod-7", name: "french fries", price: 18000, quantity: 1, subtotal: 18000 },
    ],
    subtotal: 73000,
    discount: 0,
    tax: 0,
    total: 73000,
    paymentMethod: "Cash",
    amountReceived: 100000,
    change: 27000,
    status: "Paid",
    cashierName: "cashier",
    customerName: "budi",
  },
];

const KEYS = {
  PRODUCTS: "minipos_products_v2",
  TRANSACTIONS: "minipos_transactions_v2",
  SETTINGS: "minipos_settings_v2",
  CART: "minipos_cart_v2",
  BARISTA: "minipos_active_barista_v2",
};

export const storage = {
  getProducts(): Product[] {
    if (typeof window === "undefined") return DEFAULT_PRODUCTS;
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  setProducts(products: Product[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products", e);
    }
  },

  getTransactions(): Transaction[] {
    if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
    try {
      const data = localStorage.getItem(KEYS.TRANSACTIONS);
      if (!data) {
        localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  setTransactions(transactions: Transaction[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error("Failed to save transactions", e);
    }
  },

  addTransaction(transaction: Transaction): void {
    const list = this.getTransactions();
    const updated = [transaction, ...list];
    this.setTransactions(updated);
  },

  getSettings(): StoreSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(data);
      if (
        !parsed.storeName ||
        parsed.storeName.toLowerCase().includes("gib") ||
        !parsed.address ||
        parsed.address.toLowerCase().includes("senopati")
      ) {
        const updated = {
          ...parsed,
          storeName: "proticafe",
          address: DEFAULT_SETTINGS.address,
          instagramHandle: "@proticafe",
          receiptFooter: "thank you for your purchase!\nfollow us on instagram @proticafe",
        };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  setSettings(settings: StoreSettings): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  },

  getActiveBarista(): Barista | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(KEYS.BARISTA);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setActiveBarista(barista: Barista | null): void {
    if (typeof window === "undefined") return;
    try {
      if (barista) {
        localStorage.setItem(KEYS.BARISTA, JSON.stringify(barista));
      } else {
        localStorage.removeItem(KEYS.BARISTA);
      }
    } catch (e) {
      console.error("Failed to save barista", e);
    }
  },

  getIsAuthenticated(): boolean {
    if (typeof window === "undefined") return true;
    try {
      const auth = localStorage.getItem("minipos_auth_v2");
      return auth === "true";
    } catch {
      return false;
    }
  },

  setIsAuthenticated(authenticated: boolean): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("minipos_auth_v2", authenticated ? "true" : "false");
    } catch (e) {
      console.error("Failed to save auth state", e);
    }
  },

  resetAll(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.removeItem(KEYS.CART);
  },
};

export function formatRupiah(amount: number): string {
  return "rp" + amount.toLocaleString("id-ID");
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).toLowerCase();
  } catch {
    return dateString.toLowerCase();
  }
}
