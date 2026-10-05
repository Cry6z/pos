"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PaymentMethod, Transaction } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/storage";
import { Receipt } from "./Receipt";
import { OpenApiModal } from "./OpenApiModal";
import {
  X,
  Banknote,
  QrCode,
  Smartphone,
  CheckCircle2,
  Printer,
  FileText,
  RotateCcw,
  Loader2,
  Building2,
  CreditCard,
  Lock,
  KeyRound,
  ShieldCheck,
  Code2,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MainCategory = "QRIS" | "CASH" | "EWALLET" | "MBANKING" | "PAYLATER";

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { total, subtotal, discount, tax, processCheckout, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<MainCategory>("QRIS");
  const [, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [cashReceived, setCashReceived] = useState<number>(total);
  const [customerName] = useState<string>("walk-in guest");

  // E-Wallet states
  const [selectedWallet, setSelectedWallet] = useState<"GoPay" | "OVO" | "DANA" | "ShopeePay">("GoPay");
  const [walletPhone, setWalletPhone] = useState<string>("0812-9876-5432");
  const [pinCode, setPinCode] = useState<string>("");

  // Mobile Banking states
  const [selectedBank, setSelectedBank] = useState<"VA BCA" | "VA Mandiri" | "VA BRI">("VA BCA");
  const [generatedVa] = useState<string>(() => "80777" + Math.floor(1000000000 + Math.random() * 9000000000));

  // P2P Lending / PayLater states
  const [selectedPayLater, setSelectedPayLater] = useState<"SPayLater" | "Kredivo">("SPayLater");
  const [tenorChoice, setTenorChoice] = useState<string>("30 hari (bunga 0%)");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(60);

  // Flow states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const cashChange = Math.max(0, cashReceived - total);
  const isCashInsufficient = activeCategory === "CASH" && cashReceived < total;

  const handleCashPreset = (amount: number) => {
    setCashReceived(amount);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCountdown(60);
    showToast("otp terkirim", "kode verifikasi keamanan 4-digit dikirim via sms/wa (simulasi: 8492)", "info");
  };

  const executePayment = (method: PaymentMethod, authType: "PIN" | "OTP" | "QRIS_NMID" | "Direct_Cash") => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const tx = processCheckout(
        method,
        activeCategory === "CASH" ? cashReceived : total,
        customerName
      );

      // Enhance with security metadata & VA / Tenor info
      tx.securityMeta = {
        authType,
        encryption: "TLS_1.3_SHA256",
        signatureHash: "sha256:" + Math.random().toString(16).substring(2, 14),
        verifiedAt: new Date().toISOString(),
      };
      if (activeCategory === "MBANKING") {
        tx.vaNumber = generatedVa;
      }
      if (activeCategory === "PAYLATER") {
        tx.tenor = tenorChoice;
      }

      setCompletedTx(tx);
    }, 1100);
  };

  const handleResetForNewOrder = () => {
    setCompletedTx(null);
    setShowReceiptModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 no-print font-mono lowercase">
        <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-zinc-950 dark:text-zinc-50">
          {/* Header with Open API Quick Inspector */}
          <div className="px-6 py-4 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                  {completedTx ? "transaksi berhasil" : "checkout & gateway pembayaran digital"}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  snap bi
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase mt-0.5">
                {completedTx
                  ? "pembayaran terverifikasi dan tercatat pada buku kasir"
                  : "integrasi 6 pilar fintech: qris, e-wallet, mobile banking, p2p, open api & keamanan"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowApiModal(true)}
                title="lihat simulasi open api snap bi"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>open api</span>
              </button>

              {!completedTx && (
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {completedTx ? (
              /* Success State */
              <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-none bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider lowercase">
                    verifikasi pembayaran sukses
                  </span>
                  <h3 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1 font-mono">
                    {formatRupiah(completedTx.total)}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                    invoice: <span className="font-bold text-zinc-900 dark:text-zinc-200">{completedTx.invoice.toLowerCase()}</span>
                  </p>
                </div>

                {/* Details Card */}
                <div className="max-w-md mx-auto bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-none p-4 text-xs space-y-2 text-left font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">metode pembayaran</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200 lowercase">
                      {completedTx.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">waktu transaksi</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {formatDate(completedTx.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">kasir</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {completedTx.cashierName}
                    </span>
                  </div>
                  {completedTx.vaNumber && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">virtual account</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{completedTx.vaNumber}</span>
                    </div>
                  )}
                  {completedTx.tenor && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">tenor p2p</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{completedTx.tenor}</span>
                    </div>
                  )}
                  {completedTx.securityMeta && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 space-y-0.5">
                      <div className="flex justify-between">
                        <span>otentikasi keamanan:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{completedTx.securityMeta.authType} terverifikasi ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>enkripsi token:</span>
                        <span className="font-mono">{completedTx.securityMeta.signatureHash}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs font-semibold shadow-sm transition-all"
                  >
                    <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span>lihat e-receipt</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
                  >
                    <Printer className="w-4 h-4" />
                    <span>cetak struk</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetForNewOrder}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors py-1.5 px-3 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>transaksi baru</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Payment Selector */
              <div className="space-y-5">
                {/* Total Summary Banner */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider block">
                      total tagihan kasir
                    </span>
                    <span className="text-2xl font-black text-zinc-950 dark:text-zinc-50 font-mono">
                      {formatRupiah(total)}
                    </span>
                  </div>
                  <div className="text-right text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <p>subtotal: {formatRupiah(subtotal)}</p>
                    {discount > 0 && <p className="text-emerald-700 dark:text-emerald-400">diskon: -{formatRupiah(discount)}</p>}
                    <p>tax: {formatRupiah(tax)}</p>
                  </div>
                </div>

                {/* 5 Fintech Product Concept Tabs */}
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                    pilih konsep produk digital:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setActiveCategory("QRIS"); setPaymentMethod("QRIS"); }}
                      className={`p-2.5 border flex flex-col items-center justify-center gap-1 transition-all ${
                        activeCategory === "QRIS"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>qris</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveCategory("EWALLET"); setPaymentMethod(selectedWallet); }}
                      className={`p-2.5 border flex flex-col items-center justify-center gap-1 transition-all ${
                        activeCategory === "EWALLET"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>e-wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveCategory("MBANKING"); setPaymentMethod(selectedBank); }}
                      className={`p-2.5 border flex flex-col items-center justify-center gap-1 transition-all ${
                        activeCategory === "MBANKING"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>m-banking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveCategory("PAYLATER"); setPaymentMethod(selectedPayLater); }}
                      className={`p-2.5 border flex flex-col items-center justify-center gap-1 transition-all ${
                        activeCategory === "PAYLATER"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>p2p / bnpl</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveCategory("CASH"); setPaymentMethod("Cash"); }}
                      className={`p-2.5 border flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 transition-all ${
                        activeCategory === "CASH"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>cash</span>
                    </button>
                  </div>
                </div>

                {/* 1. QRIS TAB */}
                {activeCategory === "QRIS" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px]">qris snap bi</span>
                      <span>dynamic merchant presented mode</span>
                    </div>

                    <div className="w-44 h-44 mx-auto bg-white p-3 border border-zinc-300 shadow-sm flex flex-col items-center justify-between">
                      <div className="text-[10px] font-bold text-zinc-800 tracking-wider">
                        proticafe • nmid-id102030405
                      </div>
                      <div className="relative w-32 h-32 bg-zinc-950 p-2 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                          <rect x="5" y="5" width="25" height="25" fill="white" />
                          <rect x="9" y="9" width="17" height="17" fill="#18181b" />
                          <rect x="13" y="13" width="9" height="9" fill="white" />
                          <rect x="70" y="5" width="25" height="25" fill="white" />
                          <rect x="74" y="9" width="17" height="17" fill="#18181b" />
                          <rect x="78" y="13" width="9" height="9" fill="white" />
                          <rect x="5" y="70" width="25" height="25" fill="white" />
                          <rect x="9" y="74" width="17" height="17" fill="#18181b" />
                          <rect x="13" y="78" width="9" height="9" fill="white" />
                          <rect x="35" y="10" width="8" height="8" fill="white" />
                          <rect x="48" y="10" width="12" height="6" fill="white" />
                          <rect x="35" y="24" width="6" height="12" fill="white" />
                          <rect x="45" y="22" width="10" height="10" fill="white" />
                          <rect x="60" y="35" width="14" height="8" fill="white" />
                          <rect x="10" y="45" width="15" height="10" fill="white" />
                          <rect x="30" y="45" width="18" height="8" fill="white" />
                          <rect x="55" y="48" width="10" height="14" fill="white" />
                          <rect x="75" y="50" width="18" height="6" fill="white" />
                          <rect x="35" y="65" width="12" height="10" fill="white" />
                          <rect x="52" y="70" width="14" height="14" fill="white" />
                          <rect x="75" y="70" width="8" height="16" fill="white" />
                          <rect x="40" y="85" width="20" height="8" fill="white" />
                        </svg>
                        <div className="absolute inset-0 m-auto w-7 h-7 bg-white flex items-center justify-center font-bold text-[8px] text-zinc-950 border border-zinc-300">
                          proti
                        </div>
                      </div>
                      <div className="text-[10px] font-mono font-bold text-zinc-900">
                        {formatRupiah(total)}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      pelanggan dapat memindai dengan mobile banking (bca, mandiri, bri) maupun e-wallet (gopay, ovo, dana, shopeepay).
                    </p>

                    <button
                      onClick={() => executePayment("QRIS", "QRIS_NMID")}
                      disabled={isSimulating}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>simulasi pembayaran qris (pelanggan sudah bayar)</span>
                    </button>
                  </div>
                )}

                {/* 2. E-WALLET TAB WITH PIN VERIFICATION */}
                {activeCategory === "EWALLET" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                        pilih dompet digital:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {(["GoPay", "OVO", "DANA", "ShopeePay"] as const).map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => { setSelectedWallet(w); setPaymentMethod(w); }}
                            className={`py-2 px-3 border text-xs font-bold transition-all ${
                              selectedWallet === w
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        nomor handphone akun {selectedWallet}
                      </label>
                      <input
                        type="text"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                      />
                    </div>

                    {/* Keamanan: PIN 6 Digit Input */}
                    <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                        <span>keamanan: masukkan pin transaksi (6 digit)</span>
                      </div>
                      <input
                        type="password"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••••• (contoh: 123456)"
                        className="w-full tracking-widest px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-center text-sm font-bold font-mono"
                      />
                      <p className="text-[10px] text-zinc-400">
                        standar snap bi: proteksi pin 6-digit terenkripsi aes-256 untuk otorisasi debit dompet digital.
                      </p>
                    </div>

                    <button
                      onClick={() => executePayment(selectedWallet, "PIN")}
                      disabled={isSimulating || pinCode.length < 6}
                      className="w-full py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>verifikasi pin & proses debit {selectedWallet}</span>
                    </button>
                  </div>
                )}

                {/* 3. MOBILE BANKING VIRTUAL ACCOUNT */}
                {activeCategory === "MBANKING" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                        pilih bank penerbit virtual account:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["VA BCA", "VA Mandiri", "VA BRI"] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => { setSelectedBank(b); setPaymentMethod(b); }}
                            className={`py-2 px-3 border text-xs font-bold transition-all ${
                              selectedBank === b
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* VA Number Display */}
                    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 space-y-2 text-center">
                      <span className="text-[10px] text-zinc-400 block">nomor virtual account ({selectedBank})</span>
                      <div className="text-xl font-bold font-mono tracking-wider text-zinc-950 dark:text-zinc-50 select-all">
                        {generatedVa}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        nama rekening: <strong>proticafe - {customerName}</strong>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        instruksi: buka m-banking bca/mandiri/bri → transfer virtual account → masukkan nominal {formatRupiah(total)}.
                      </p>
                    </div>

                    <button
                      onClick={() => executePayment(selectedBank, "Direct_Cash")}
                      disabled={isSimulating}
                      className="w-full py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                      <span>simulasi transfer m-banking selesai (auto-detect va)</span>
                    </button>
                  </div>
                )}

                {/* 4. P2P LENDING & PAYLATER WITH OTP VERIFICATION */}
                {activeCategory === "PAYLATER" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                        fintech p2p lending / paylater partner:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(["SPayLater", "Kredivo"] as const).map((pl) => (
                          <button
                            key={pl}
                            type="button"
                            onClick={() => { setSelectedPayLater(pl); setPaymentMethod(pl); }}
                            className={`py-2 px-3 border text-xs font-bold transition-all ${
                              selectedPayLater === pl
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {pl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                        pilihan skema cicilan (tenor):
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {["30 hari (bunga 0%)", "3 bulan cicilan", "6 bulan cicilan"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTenorChoice(t)}
                            className={`py-2 px-2 border text-[11px] font-semibold transition-all ${
                              tenorChoice === t
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Keamanan: OTP Verification */}
                    <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>keamanan: verifikasi otp (one-time password)</span>
                        </span>
                        {!otpSent ? (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[10px] text-emerald-700 dark:text-emerald-400 underline font-bold"
                          >
                            kirim otp
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-400">kirim ulang ({otpCountdown}s)</span>
                        )}
                      </div>

                      {otpSent ? (
                        <div>
                          <input
                            type="text"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="kode 4-digit (ketik: 8492)"
                            className="w-full tracking-widest px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-center text-sm font-bold font-mono"
                          />
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                            kode otp simulasi: <strong>8492</strong> dikirim via sms gateway.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-400">
                          klik &quot;kirim otp&quot; untuk mensimulasikan otentikasi token pinjaman p2p lending.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => executePayment(selectedPayLater, "OTP")}
                      disabled={isSimulating || otpCode !== "8492"}
                      className="w-full py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>konfirmasi pinjaman p2p & checkout</span>
                    </button>
                  </div>
                )}

                {/* 5. CASH TAB */}
                {activeCategory === "CASH" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        nominal uang tunai diterima
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">
                          rp
                        </span>
                        <input
                          type="number"
                          value={cashReceived || ""}
                          onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm font-mono font-bold text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-zinc-950"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCashPreset(total)}
                        className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                      >
                        uang pas ({formatRupiah(total)})
                      </button>
                      {[50000, 100000, 150000, 200000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleCashPreset(amt)}
                          className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                        >
                          {formatRupiah(amt)}
                        </button>
                      ))}
                    </div>

                    <div
                      className={`p-3.5 border flex items-center justify-between ${
                        isCashInsufficient
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800"
                          : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-300"
                      }`}
                    >
                      <span className="text-xs font-bold">
                        {isCashInsufficient ? "uang kurang" : "kembalian (change)"}
                      </span>
                      <span className="text-base font-bold font-mono">
                        {formatRupiah(isCashInsufficient ? total - cashReceived : cashChange)}
                      </span>
                    </div>

                    <button
                      onClick={() => executePayment("Cash", "Direct_Cash")}
                      disabled={isCashInsufficient || isSimulating}
                      className="w-full py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 text-xs font-bold transition-all"
                    >
                      konfirmasi pembayaran tunai
                    </button>
                  </div>
                )}

                {/* Footer Security Badge */}
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>enkripsi tls 1.3 & hmac-sha256 signature standar snap bi</span>
                  </div>
                  <span className="font-mono">iso/iec 27001</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipts */}
      {showReceiptModal && completedTx && (
        <Receipt
          transaction={completedTx}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {/* Open API Console Modal */}
      {showApiModal && (
        <OpenApiModal
          isOpen={showApiModal}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </>
  );
}
