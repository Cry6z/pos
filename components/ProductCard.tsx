"use client";

import React from "react";
import { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { Plus, Coffee, Utensils, CupSoda, Cookie } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart } = useApp();

  const cartItem = cart.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = inCartQty >= product.stock;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Coffee":
        return <Coffee className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />;
      case "Non-Coffee":
        return <CupSoda className="w-3.5 h-3.5 text-blue-800 dark:text-blue-400" />;
      case "Food":
        return <Utensils className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />;
      case "Pastry":
        return <Cookie className="w-3.5 h-3.5 text-orange-800 dark:text-orange-400" />;
      default:
        return <Coffee className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />;
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 rounded-none border font-mono transition-all duration-150 lowercase ${
        isOutOfStock
          ? "opacity-60 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 cursor-not-allowed"
          : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-500 hover:shadow-sm"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 lowercase">
            {getCategoryIcon(product.category)}
            {product.category}
          </span>

          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-none border border-rose-300 dark:border-rose-800">
              out of stock
            </span>
          ) : product.stock <= 10 ? (
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-none border border-amber-300 dark:border-amber-800">
              stock: {product.stock}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              stock: {product.stock}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-xs sm:text-sm leading-snug line-clamp-1 lowercase">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed lowercase">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer with Price & Add Button */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider block lowercase">
            price
          </span>
          <span className="font-bold text-zinc-950 dark:text-zinc-50 text-xs sm:text-sm font-mono">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock || isMaxInCart}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold transition-all border ${
            isOutOfStock || isMaxInCart
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
              : "bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm active:scale-[0.98]"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>add</span>
          {inCartQty > 0 && (
            <span className="bg-amber-400 dark:bg-amber-500 text-zinc-950 font-bold px-1.5 py-0.2 rounded-none text-[10px] ml-0.5">
              {inCartQty}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
