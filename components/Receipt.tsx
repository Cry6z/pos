"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { Printer, Download, X, CheckCircle2, Coffee, ShieldCheck } from "lucide-react";

interface ReceiptProps {
  transaction: Transaction | null;
  onClose?: () => void;
  standalone?: boolean;
}

export function Receipt({ transaction, onClose, standalone = false }: ReceiptProps) {
  const { settings, setActiveReceipt } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setActiveReceipt(null);
    }
  }, [onClose, setActiveReceipt]);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const content = (
    <div
      id="printable-receipt"
      ref={receiptRef}
      className="w-full max-w-[320px] mx-auto bg-white rounded-none border border-zinc-900 shadow-xl overflow-hidden font-mono text-zinc-900 text-xs lowercase"
    >
      {/* Top Header - Compact */}
      <div className="bg-zinc-950 text-white px-4 py-3 sm:px-5 sm:py-3.5 text-center relative overflow-hidden rounded-none">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <div className="w-5 h-5 rounded-none bg-white/10 flex items-center justify-center text-amber-300">
            <Coffee className="w-3 h-3" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight lowercase">
            {settings.storeName || "proticafe"}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 font-medium tracking-wide lowercase">
          digital payment receipt
        </p>
        <p className="text-[9px] text-zinc-400 mt-0.5 max-w-[250px] mx-auto leading-tight lowercase">
          {settings.address}
        </p>
        <p className="text-[9px] text-zinc-500 mt-0.5">{settings.phone}</p>
      </div>

      <div className="p-3.5 sm:p-4 space-y-2.5 text-xs">
        {/* Invoice Metadata */}
        <div className="flex justify-between items-start pb-2 border-b border-dashed border-zinc-300">
          <div>
            <span className="text-[9px] font-semibold text-zinc-500 tracking-wider block">
              no. invoice
            </span>
            <p className="font-mono text-xs font-bold text-zinc-900">
              {transaction.invoice.toLowerCase()}
            </p>
            <p suppressHydrationWarning className="text-[10px] text-zinc-500 mt-0.5">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-semibold text-zinc-500 tracking-wider block">
              kasir
            </span>
            <p className="font-medium text-zinc-800 text-[11px]">
              {transaction.cashierName || settings.cashierName || "cashier"}
            </p>
            {transaction.customerName && (
              <p className="text-[10px] text-zinc-500 mt-0.5">
                pelanggan: {transaction.customerName}
              </p>
            )}
          </div>
        </div>

        {/* Itemized list */}
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-zinc-500 tracking-wider pb-1 border-b border-zinc-200">
            <span>item pesanan</span>
            <span>subtotal</span>
          </div>

          <div className="divide-y divide-zinc-100 pt-0.5">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="py-1 flex justify-between items-baseline gap-2">
                <div className="min-w-0 pr-1">
                  <p className="font-medium text-zinc-900 text-[11px] leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {item.quantity} × {formatRupiah(item.price)}
                  </p>
                </div>
                <span className="font-mono font-semibold text-zinc-900 shrink-0 text-[11px]">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="pt-2 border-t border-dashed border-zinc-300 space-y-1 font-mono text-[11px]">
          <div className="flex justify-between text-zinc-600">
            <span>subtotal</span>
            <span className="font-semibold">{formatRupiah(transaction.subtotal)}</span>
          </div>

          {transaction.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>diskon</span>
              <span>-{formatRupiah(transaction.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-zinc-600">
            <span>pajak ({settings.taxRate ? `${settings.taxRate * 100}%` : "0%"})</span>
            <span>{formatRupiah(transaction.tax)}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-zinc-950 pt-1.5 border-t border-zinc-900">
            <span className="tracking-wide">total</span>
            <span className="text-sm font-bold text-zinc-950 font-mono">
              {formatRupiah(transaction.total)}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-zinc-50 rounded-none p-2.5 border border-zinc-200 space-y-1 text-[10px]">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">metode pembayaran</span>
            <span className="font-bold text-zinc-900 lowercase">
              {transaction.paymentMethod}
            </span>
          </div>

          {transaction.paymentMethod === "Cash" && (
            <>
              <div className="flex justify-between">
                <span className="text-zinc-500">diterima</span>
                <span className="font-mono font-medium text-zinc-800">
                  {formatRupiah(transaction.amountReceived)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">kembalian</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatRupiah(transaction.change)}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-1 border-t border-zinc-200 mt-0.5">
            <span className="text-zinc-500">status</span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-none border border-emerald-300">
              <CheckCircle2 className="w-2.5 h-2.5" /> lunas ✓
            </span>
          </div>

          {/* Fintech Verification */}
          <div className="pt-1.5 border-t border-dashed border-zinc-200 text-[9px] space-y-0.5 bg-zinc-100/70 p-1.5 rounded-none">
            <div className="flex items-center justify-between font-semibold text-zinc-700">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                verifikasi fintech
              </span>
              <span className="text-[8px] uppercase px-1 py-0.2 bg-zinc-200 text-zinc-700">
                {transaction.securityMeta?.authType ? transaction.securityMeta.authType.replace("_", " ") : "2fa verified"}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500 font-mono text-[8px]">
              <span>protokol: snap bi open api</span>
              <span>tls 1.3 / aes-256</span>
            </div>
            {transaction.securityMeta?.signatureHash && (
              <p className="font-mono text-[7px] text-zinc-500 truncate pt-0.5 border-t border-zinc-200">
                sig: {transaction.securityMeta.signatureHash}
              </p>
            )}
          </div>
        </div>

        {/* Thermal Barcode */}
        <div className="pt-1 text-center space-y-1">
          <div className="flex justify-center items-center gap-0.5 h-6 px-3 opacity-80">
            {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 2, 5, 1, 6, 3, 2, 4, 1, 7, 2, 5, 3, 1, 4].map(
              (width, i) => (
                <div
                  key={i}
                  className="h-full bg-zinc-950"
                  style={{ width: `${width * 1.3}px` }}
                />
              )
            )}
          </div>
          <p className="font-mono text-[9px] text-zinc-500 tracking-wider lowercase">
            {transaction.invoice.toLowerCase()} • nmid-id102030405
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-1.5 border-t border-dashed border-zinc-300 text-zinc-600 text-[10px] leading-tight whitespace-pre-line lowercase">
          {settings.receiptFooter || "thank you for your purchase!\nfollow us on instagram @proticafe"}
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex justify-center items-start p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto no-print"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[320px] my-auto py-3 sm:py-6"
      >
        {content}

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-xs font-semibold shadow-sm transition-all active:scale-[0.99] border border-zinc-950"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>cetak struk</span>
          </button>
          <button
            onClick={handlePrint}
            title="simpan sebagai pdf via print browser"
            className="flex items-center justify-center gap-1 py-2 px-2.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 rounded-none text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>pdf</span>
          </button>
          <button
            onClick={handleClose}
            title="tutup struk"
            className="flex items-center justify-center p-2 bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-300 rounded-none transition-colors shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
