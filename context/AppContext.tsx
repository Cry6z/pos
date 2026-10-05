"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Product,
  CartItem,
  Transaction,
  PaymentMethod,
  StoreSettings,
  ToastMessage,
} from "@/lib/types";
import { storage, DEFAULT_PRODUCTS, DEFAULT_SETTINGS, INITIAL_TRANSACTIONS } from "@/lib/storage";

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  settings: StoreSettings;
  toasts: ToastMessage[];
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  activeReceipt: Transaction | null;
  setActiveReceipt: (tx: Transaction | null) => void;
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  // Cart Actions
  addToCart: (product: Product) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setDiscount: (discount: number) => void;
  // Product Actions
  addProduct: (product: Omit<Product, "id" | "sku">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Checkout
  processCheckout: (
    paymentMethod: PaymentMethod,
    amountReceived: number,
    customerName?: string
  ) => Transaction;
  // Settings
  updateSettings: (newSettings: StoreSettings) => void;
  resetAllData: () => void;
  // Toast
  showToast: (
    title: string,
    description?: string,
    type?: "success" | "info" | "warning" | "error"
  ) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [discount, setDiscount] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  // Initialize theme and localStorage asynchronously on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(storage.getProducts());
      setTransactions(storage.getTransactions());
      setSettings(storage.getSettings());

      // Theme initialization
      const savedTheme = localStorage.getItem("minipos_theme_v2") as "light" | "dark" | null;
      if (savedTheme) {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = isDark ? "dark" : "light";
        setThemeState(initial);
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Theme Actions
  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("minipos_theme_v2", newTheme);
    } catch {}
    showToast(
      newTheme === "dark" ? "mode malam aktif" : "mode siang aktif",
      newTheme === "dark" ? "tampilan gelap diaktifkan" : "tampilan terang diaktifkan",
      "info"
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Save products to localStorage on update
  useEffect(() => {
    if (isHydrated) {
      storage.setProducts(products);
    }
  }, [products, isHydrated]);

  // Save transactions to localStorage on update
  useEffect(() => {
    if (isHydrated) {
      storage.setTransactions(transactions);
    }
  }, [transactions, isHydrated]);

  // Save settings to localStorage on update
  useEffect(() => {
    if (isHydrated) {
      storage.setSettings(settings);
    }
  }, [settings, isHydrated]);

  // Toast Helpers
  const showToast = (
    title: string,
    description?: string,
    type: "success" | "info" | "warning" | "error" = "success"
  ) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => {
    return Math.round(subtotal * (settings.taxRate || 0));
  }, [subtotal, settings.taxRate]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + tax);
  }, [subtotal, discount, tax]);

  // Cart Operations
  const addToCart = (product: Product): boolean => {
    const existing = cart.find((item) => item.product.id === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (product.stock <= currentQtyInCart) {
      showToast(
        "stok habis / limit",
        `hanya tersedia ${product.stock} ${product.name} di inventori.`,
        "warning"
      );
      return false;
    }

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { product, quantity: 1 }]);
    }

    showToast(`tambah ke keranjang`, `${product.name} (+1)`, "success");
    return true;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stock) {
      showToast(
        "limit stok terlampaui",
        `maksimal stok untuk ${prod.name} adalah ${prod.stock}.`,
        "warning"
      );
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`hapus dari keranjang`, item.product.name, "info");
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, "id" | "sku">) => {
    const catCode = productData.category.substring(0, 3).toLowerCase();
    const sku = `${catCode}-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      sku,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast("produk ditambahkan", `${newProduct.name} masuk ke katalog`, "success");
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id
          ? { ...item, product: updated }
          : item
      )
    );
    showToast("produk diperbarui", `${updated.name} berhasil disimpan`, "success");
  };

  const deleteProduct = (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast("produk dihapus", toDelete?.name || "produk telah dihapus", "info");
  };

  // Checkout Execution
  const processCheckout = (
    paymentMethod: PaymentMethod,
    amountReceived: number,
    customerName: string = "pelanggan walk-in"
  ): Transaction => {
    const nextInvNumber = 129 + transactions.length;
    const invoice = `#inv-${String(nextInvNumber).padStart(5, "0")}`;

    const txItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    const finalReceived =
      paymentMethod === "Cash" ? amountReceived : total;
    const finalChange = Math.max(0, finalReceived - total);

    const newTransaction: Transaction = {
      id: "tx-" + Date.now(),
      invoice,
      date: new Date().toISOString(),
      items: txItems,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      amountReceived: finalReceived,
      change: finalChange,
      status: "Paid",
      cashierName: settings.cashierName,
      customerName,
    };

    // Deduct stock for all items
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity),
          };
        }
        return prod;
      })
    );

    // Save transaction
    setTransactions((prev) => [newTransaction, ...prev]);

    // Clear cart & reset discount
    clearCart();

    showToast("pembayaran berhasil", `transaksi ${invoice} tercatat`, "success");
    return newTransaction;
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast("pengaturan disimpan", "data toko berhasil diperbarui", "success");
  };

  const resetAllData = () => {
    storage.resetAll();
    setProducts(DEFAULT_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(DEFAULT_SETTINGS);
    setCart([]);
    setDiscount(0);
    showToast("reset sistem", "data dikembalikan ke default prototype", "info");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        transactions,
        settings,
        toasts,
        discount,
        subtotal,
        tax,
        total,
        activeReceipt,
        setActiveReceipt,
        theme,
        toggleTheme,
        setTheme,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setDiscount,
        addProduct,
        updateProduct,
        deleteProduct,
        processCheckout,
        updateSettings,
        resetAllData,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
