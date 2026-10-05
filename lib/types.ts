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

export type PaymentMethod =
  | "Cash"
  | "QRIS"
  | "GoPay"
  | "OVO"
  | "DANA"
  | "ShopeePay"
  | "VA BCA"
  | "VA Mandiri"
  | "VA BRI"
  | "SPayLater"
  | "Kredivo";

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface SecurityMeta {
  authType: "PIN" | "OTP" | "QRIS_NMID" | "Direct_Cash";
  encryption: "AES-256-GCM" | "TLS_1.3_SHA256";
  signatureHash: string;
  verifiedAt: string;
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
  securityMeta?: SecurityMeta;
  vaNumber?: string;
  tenor?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  cashierName: string;
  taxRate: number;
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

export interface ApiLog {
  id: string;
  timestamp: string;
  method: "POST" | "GET";
  endpoint: string;
  status: number;
  requestBody: Record<string, unknown>;
  responseBody: Record<string, unknown>;
  headers: Record<string, string>;
}

export interface P2PLoan {
  id: string;
  lenderName: string;
  amount: number;
  tenorMonths: number;
  interestRate: number; // e.g. 0.015 for 1.5%
  monthlyInstallment: number;
  status: "Aktif" | "Diajukan" | "Lunas";
  disbursedDate: string;
  purpose: string;
}

export interface CashierConfig {
  name: string;
  role: string;
  shift: string;
  pin: string;
}

export type Barista = CashierConfig;

