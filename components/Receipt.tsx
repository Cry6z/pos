"use client";

import React, { useRef } from "react";
import { Transaction } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { Printer, Download, X, CheckCircle2, Coffee } from "lucide-react";

interface ReceiptProps {
  transaction: Transaction | null;
  onClose?: () => void;
  standalone?: boolean;
}

export function Receipt({ transaction, onClose, standalone = false }: ReceiptProps) {
  const { settings, setActiveReceipt } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveReceipt(null);
    }
  };

  const content = (
    <div
      id="printable-receipt"
      ref={receiptRef}
      className="w-full max-w-sm mx-auto bg-white rounded-none border border-zinc-900 shadow-xl overflow-hidden font-mono text-zinc-900 text-xs lowercase"
    >
      {/* Top Header */}
      <div className="bg-zinc-950 text-white px-6 py-5 text-center relative overflow-hidden rounded-none">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-none bg-white/10 flex items-center justify-center text-amber-300">
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-bold tracking-tight lowercase">
            {settings.storeName || "proticafe"}
          </span>
        </div>
        <p className="text-xs text-zinc-400 font-medium tracking-wide lowercase">
          digital payment receipt
        </p>
        <p className="text-[11px] text-zinc-400 mt-1 max-w-[240px] mx-auto leading-tight lowercase">
          {settings.address}
        </p>
        <p className="text-[11px] text-zinc-500 mt-0.5">{settings.phone}</p>
      </div>

      <div className="p-6 space-y-4 text-xs">
        {/* Invoice Metadata */}
        <div className="flex justify-between items-start pb-3 border-b border-dashed border-zinc-300">
          <div>
            <span className="text-[10px] font-semibold text-zinc-500 tracking-wider block">
              invoice no.
            </span>
            <p className="font-mono text-xs font-bold text-zinc-900">
              {transaction.invoice.toLowerCase()}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-zinc-500 tracking-wider block">
              cashier
            </span>
            <p className="font-medium text-zinc-800">
              {transaction.cashierName || settings.cashierName}
            </p>
            {transaction.customerName && (
              <p className="text-[11px] text-zinc-500 mt-0.5">
                cust: {transaction.customerName}
              </p>
            )}
          </div>
        </div>

        {/* Itemized list */}
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-zinc-500 tracking-wider pb-1.5 border-b border-zinc-200">
            <span>item description</span>
            <span>subtotal</span>
          </div>

          <div className="divide-y divide-zinc-100 pt-1">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="py-2 flex justify-between items-baseline gap-2">
                <div className="min-w-0 pr-2">
                  <p className="font-medium text-zinc-900 text-xs">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {item.quantity} × {formatRupiah(item.price)}
                  </p>
                </div>
                <span className="font-mono font-semibold text-zinc-900 shrink-0 text-xs">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="pt-3 border-t border-dashed border-zinc-300 space-y-1.5 font-mono">
          <div className="flex justify-between text-zinc-600">
            <span className="text-xs">subtotal</span>
            <span className="font-semibold text-xs">
              {formatRupiah(transaction.subtotal)}
            </span>
          </div>

          {transaction.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span className="text-xs">discount</span>
              <span className="text-xs">-{formatRupiah(transaction.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-zinc-600">
            <span className="text-xs">
              tax ({settings.taxRate ? `${settings.taxRate * 100}%` : "0%"})
            </span>
            <span className="text-xs">{formatRupiah(transaction.tax)}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-900">
            <span className="tracking-wide">total</span>
            <span className="text-base text-zinc-950 font-mono">
              {formatRupiah(transaction.total)}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-zinc-50 rounded-none p-3 border border-zinc-200 space-y-1 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">payment method</span>
            <span className="font-bold text-zinc-900 lowercase">
              {transaction.paymentMethod}
            </span>
          </div>

          {transaction.paymentMethod === "Cash" && (
            <>
              <div className="flex justify-between">
                <span className="text-zinc-500">amount received</span>
                <span className="font-mono font-medium text-zinc-800">
                  {formatRupiah(transaction.amountReceived)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">change</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatRupiah(transaction.change)}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-1.5 border-t border-zinc-200 mt-1">
            <span className="text-zinc-500">status</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-none border border-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> paid ✓
            </span>
          </div>
        </div>

        {/* Thermal Barcode representation */}
        <div className="pt-2 text-center space-y-2">
          <div className="flex justify-center items-center gap-0.5 h-10 px-4 opacity-80">
            {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 2, 5, 1, 6, 3, 2, 4, 1, 7, 2, 5, 3, 1, 4].map(
              (width, i) => (
                <div
                  key={i}
                  className="h-full bg-zinc-950"
                  style={{ width: `${width * 1.5}px` }}
                />
              )
            )}
          </div>
          <p className="font-mono text-[10px] text-zinc-500 tracking-widest lowercase">
            {transaction.invoice.toLowerCase()} • nmid-id102030405
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 border-t border-dashed border-zinc-300 text-zinc-600 text-[11px] leading-relaxed whitespace-pre-line lowercase">
          {settings.receiptFooter || "thank you for your purchase!\nfollow us on instagram @proticafe"}
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto no-print">
      <div className="relative w-full max-w-sm my-8">
        {content}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-none text-xs font-semibold shadow-sm transition-all active:scale-[0.99] border border-zinc-950"
          >
            <Printer className="w-4 h-4" />
            <span>print receipt</span>
          </button>
          <button
            onClick={handlePrint}
            title="save as pdf via browser print"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 rounded-none text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>pdf</span>
          </button>
          <button
            onClick={handleClose}
            className="flex items-center justify-center p-2.5 bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-300 rounded-none transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
