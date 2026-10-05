"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/lib/storage";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";

interface CartProps {
  onOpenCheckout: () => void;
}

export function Cart({ onOpenCheckout }: CartProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    setDiscount,
    tax,
    total,
    settings,
  } = useApp();

  const [showPromo, setShowPromo] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyPresetDiscount = (amount: number) => {
    setDiscount(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden font-mono lowercase">
      {/* Cart Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-950 dark:text-zinc-50 font-semibold border border-zinc-300 dark:border-zinc-700">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-950 dark:text-zinc-50 text-xs sm:text-sm leading-tight lowercase">
              current order
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 lowercase">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1 rounded-none hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1"
            title="clear all items in cart"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">clear</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 py-12">
            <div className="w-12 h-12 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3 border border-zinc-300 dark:border-zinc-700">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm lowercase">
              your cart is empty
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-50 leading-relaxed lowercase">
              select items from the catalog on the left to start a new order.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className="pt-3 first:pt-0 flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50 truncate lowercase">
                    {item.product.name}
                  </h4>
                  <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 shrink-0">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                  {formatRupiah(item.product.price)} each
                </p>

                {/* Quantity Controls with Sharp Corners */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-none overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                      title="decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-xs text-zinc-950 dark:text-zinc-50 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-none hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-auto"
                    title="remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Checkout */}
      {cart.length > 0 && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
          {/* Quick Discount Toggle */}
          <div className="space-y-1.5">
            <button
              onClick={() => setShowPromo(!showPromo)}
              className="flex items-center justify-between w-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                <span>apply promo / discount</span>
              </span>
              <span className="text-[11px] text-zinc-500 underline">
                {showPromo ? "hide" : "select"}
              </span>
            </button>

            {showPromo && (
              <div className="flex flex-wrap gap-1.5 pt-1 animate-in fade-in duration-150">
                <button
                  onClick={() => applyPresetDiscount(0)}
                  className={`text-[11px] px-2.5 py-1 rounded-none border font-medium transition-all ${
                    discount === 0
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  none
                </button>
                <button
                  onClick={() => applyPresetDiscount(5000)}
                  className={`text-[11px] px-2.5 py-1 rounded-none border font-medium transition-all ${
                    discount === 5000
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  -5k voucher
                </button>
                <button
                  onClick={() => applyPresetDiscount(10000)}
                  className={`text-[11px] px-2.5 py-1 rounded-none border font-medium transition-all ${
                    discount === 10000
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  -10k voucher
                </button>
                <button
                  onClick={() => applyPresetDiscount(Math.round(subtotal * 0.1))}
                  className={`text-[11px] px-2.5 py-1 rounded-none border font-medium transition-all ${
                    discount === Math.round(subtotal * 0.1) && discount > 0
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  10% member
                </button>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono border-t border-zinc-200 dark:border-zinc-800 pt-2.5">
            <div className="flex justify-between">
              <span>subtotal</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatRupiah(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> discount
                </span>
                <span className="font-bold">-{formatRupiah(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>tax ({settings.taxRate ? `${settings.taxRate * 100}%` : "0%"})</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatRupiah(tax)}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-zinc-950 dark:text-zinc-50 pt-2 border-t border-zinc-300 dark:border-zinc-800">
              <span className="tracking-wide">total</span>
              <span className="text-base text-zinc-950 dark:text-zinc-50 font-mono">
                {formatRupiah(total)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={onOpenCheckout}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-between py-3.5 px-4 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white dark:text-zinc-950 rounded-none text-xs font-bold shadow-sm transition-all border border-zinc-950 dark:border-white group"
          >
            <span>proceed to checkout</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span>{formatRupiah(total)}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
