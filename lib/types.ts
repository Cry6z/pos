export type ProductCategory = "All" | "Coffee" | "Non-Coffee" | "Food" | "Pastry";

export interface Product {
  id: string;
  name: string;
  category: "Coffee" | "Non-Coffee" | "Food" | "Pastry";
  price: number;
  stock: number;
  sku: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = "Cash" | "QRIS" | "GoPay" | "OVO" | "DANA" | "ShopeePay";

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  invoice: string;
  date: string; // ISO string
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  status: "Paid" | "Refunded" | "Cancelled";
  cashierName: string;
  customerName?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  cashierName: string;
  taxRate: number; // e.g. 0.0 or 0.11 for 11%
  currencySymbol: string;
  receiptFooter: string;
  instagramHandle: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
}
