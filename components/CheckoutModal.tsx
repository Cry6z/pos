"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PaymentMethod, Transaction } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/storage";
import { Receipt } from "./Receipt";
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
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { total, subtotal, discount, tax, processCheckout, showToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [cashReceived, setCashReceived] = useState<number>(total);
  const [customerName, setCustomerName] = useState<string>("walk-in guest");
  const [selectedWallet, setSelectedWallet] = useState<string>("GoPay");
  const [walletPhone, setWalletPhone] = useState<string>("0812-9876-5432");

  // Flow states
  const [isSimulatingQRIS, setIsSimulatingQRIS] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const cashChange = Math.max(0, cashReceived - total);
  const isCashInsufficient = paymentMethod === "Cash" && cashReceived < total;

  const handleCashPreset = (amount: number) => {
    setCashReceived(amount);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "Cash" && isCashInsufficient) {
      showToast("insufficient amount", "amount received is less than total bill.", "error");
      return;
    }

    const tx = processCheckout(
      paymentMethod === "Cash" ? "Cash" : paymentMethod === "QRIS" ? "QRIS" : (selectedWallet as PaymentMethod),
      paymentMethod === "Cash" ? cashReceived : total,
      customerName
    );

    setCompletedTx(tx);
  };

  const handleSimulateQRIS = () => {
    setIsSimulatingQRIS(true);
    setTimeout(() => {
      setIsSimulatingQRIS(false);
      const tx = processCheckout("QRIS", total, customerName);
      setCompletedTx(tx);
    }, 1200);
  };

  const handleResetForNewOrder = () => {
    setCompletedTx(null);
    setShowReceiptModal(false);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 no-print font-mono lowercase">
        <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-zinc-950 dark:text-zinc-50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
            <div>
              <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                {completedTx ? "payment complete" : "payment & checkout"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase">
                {completedTx
                  ? "order successfully recorded and finalized"
                  : "select payment method and finalize customer order"}
              </p>
            </div>
            {!completedTx && (
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {completedTx ? (
              /* Success State */
              <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-none bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider lowercase">
                    transaction successful
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
                    <span className="text-zinc-500 dark:text-zinc-400">payment method</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-200 lowercase">
                      {completedTx.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">date & time</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {formatDate(completedTx.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">cashier</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {completedTx.cashierName}
                    </span>
                  </div>
                  {completedTx.paymentMethod === "Cash" && (
                    <>
                      <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800">
                        <span className="text-zinc-500 dark:text-zinc-400">cash received</span>
                        <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                          {formatRupiah(completedTx.amountReceived)}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                        <span>change (kembalian)</span>
                        <span className="font-mono font-bold">
                          {formatRupiah(completedTx.change)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs font-semibold shadow-sm transition-all"
                  >
                    <FileText className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span>view receipt</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
                  >
                    <Printer className="w-4 h-4" />
                    <span>print receipt</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetForNewOrder}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors py-1.5 px-3 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>new transaction</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Payment Form */
              <div className="space-y-6">
                {/* Order Summary Box */}
                <div className="bg-zinc-50 dark:bg-zinc-950 rounded-none p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider block">
                      amount due
                    </span>
                    <span className="text-2xl font-black text-zinc-950 dark:text-zinc-50 font-mono">
                      {formatRupiah(total)}
                    </span>
                  </div>
                  <div className="text-right text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <p>subtotal: {formatRupiah(subtotal)}</p>
                    {discount > 0 && <p className="text-emerald-700 dark:text-emerald-400">discount: -{formatRupiah(discount)}</p>}
                    <p>tax: {formatRupiah(tax)}</p>
                  </div>
                </div>

                {/* Customer Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    customer name (optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. dika / meja 4"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                  />
                </div>

                {/* Payment Method Selector Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    select payment method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("QRIS")}
                      className={`flex flex-col items-center justify-center p-3 rounded-none border text-xs font-semibold transition-all ${
                        paymentMethod === "QRIS"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <QrCode className="w-5 h-5 mb-1.5" />
                      <span>qris</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("Cash");
                        if (cashReceived < total) setCashReceived(total);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-none border text-xs font-semibold transition-all ${
                        paymentMethod === "Cash"
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Banknote className="w-5 h-5 mb-1.5" />
                      <span>cash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("GoPay")}
                      className={`flex flex-col items-center justify-center p-3 rounded-none border text-xs font-semibold transition-all ${
                        ["GoPay", "OVO", "DANA", "ShopeePay"].includes(paymentMethod)
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mb-1.5" />
                      <span>e-wallet</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: QRIS Interface */}
                {paymentMethod === "QRIS" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-none border border-zinc-300 dark:border-zinc-800 text-center space-y-4">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span className="px-2 py-0.5 bg-rose-600 text-white rounded-none text-[10px] font-black tracking-wider">
                        qris
                      </span>
                      <span>scan qr to pay</span>
                    </div>

                    {/* Mock QR Canvas Display */}
                    <div className="w-48 h-48 mx-auto bg-white p-3 rounded-none border border-zinc-300 shadow-sm flex flex-col items-center justify-between">
                      <div className="text-[10px] font-bold text-zinc-800 tracking-wider lowercase">
                        proticafe • nmid-id102
                      </div>

                      {/* Sharp QR graphic */}
                      <div className="relative w-36 h-36 bg-zinc-950 rounded-none p-2 flex items-center justify-center">
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

                        {/* Center Badge */}
                        <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-none flex items-center justify-center font-bold text-[9px] text-zinc-950 border border-zinc-300 shadow-sm lowercase">
                          proti
                        </div>
                      </div>

                      <div className="text-[10px] font-mono font-bold text-zinc-900">
                        {formatRupiah(total)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5 lowercase">
                        <span className="w-2 h-2 rounded-none bg-emerald-600 animate-ping" />
                        waiting for customer payment...
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 lowercase">
                        ask customer to scan with bca, gopay, ovo, dana, or mobile banking.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-3 rounded-none border border-amber-300 dark:border-amber-800 lowercase">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>simulasi prototype — bukan qris production nyata.</span>
                    </div>

                    <button
                      onClick={handleSimulateQRIS}
                      disabled={isSimulatingQRIS}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-none text-xs font-bold shadow-sm transition-all border border-emerald-800"
                    >
                      {isSimulatingQRIS ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>simulating payment verification...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>simulate payment (customer paid)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* TAB 2: Cash Interface */}
                {paymentMethod === "Cash" && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-none border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        amount received (uang diterima)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                          rp
                        </span>
                        <input
                          type="number"
                          value={cashReceived || ""}
                          onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-none text-sm font-mono font-bold text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                        />
                      </div>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                        quick cash suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCashPreset(total)}
                          className="px-2.5 py-1 text-xs font-medium rounded-none bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                        >
                          uang pas ({formatRupiah(total)})
                        </button>
                        {[50000, 100000, 150000, 200000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleCashPreset(amt)}
                            className="px-2.5 py-1 text-xs font-medium rounded-none bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                          >
                            {formatRupiah(amt)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Change Display */}
                    <div
                      className={`p-3.5 rounded-none border flex items-center justify-between ${
                        isCashInsufficient
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                          : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCashInsufficient ? (
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold block">
                            {isCashInsufficient ? "uang kurang" : "kembalian (change)"}
                          </span>
                          <span className="text-[10px] opacity-75">
                            {isCashInsufficient
                              ? `kurang ${formatRupiah(total - cashReceived)}`
                              : "kembalikan ke pelanggan"}
                          </span>
                        </div>
                      </div>

                      <span className="text-base font-bold font-mono">
                        {formatRupiah(isCashInsufficient ? total - cashReceived : cashChange)}
                      </span>
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      disabled={isCashInsufficient}
                      className="w-full py-3 px-4 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 rounded-none text-xs font-bold shadow-sm transition-all border border-zinc-950 dark:border-white"
                    >
                      confirm cash payment
                    </button>
                  </div>
                )}

                {/* TAB 3: E-Wallet Interface */}
                {["GoPay", "OVO", "DANA", "ShopeePay"].includes(paymentMethod) && (
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-none border border-zinc-300 dark:border-zinc-800 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                        select provider
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["GoPay", "OVO", "DANA", "ShopeePay"].map((wallet) => (
                          <button
                            key={wallet}
                            type="button"
                            onClick={() => setSelectedWallet(wallet)}
                            className={`py-2 px-3 rounded-none border text-xs font-bold transition-all ${
                              selectedWallet === wallet
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        customer mobile number / id
                      </label>
                      <input
                        type="text"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                      />
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                        a push payment request will be sent to customer&apos;s {selectedWallet} app.
                      </p>
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      className="w-full py-3 px-4 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-bold shadow-sm transition-all border border-zinc-950 dark:border-white"
                    >
                      confirm payment with {selectedWallet}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Standalone Receipt Modal */}
      {showReceiptModal && completedTx && (
        <Receipt
          transaction={completedTx}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </>
  );
}
