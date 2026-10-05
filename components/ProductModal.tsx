"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import { X, PackagePlus } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id" | "sku">, id?: string) => void;
  initialProduct?: Product | null;
}

function ProductFormContent({
  initialProduct,
  onSave,
  onClose,
}: {
  initialProduct?: Product | null;
  onSave: (product: Omit<Product, "id" | "sku">, id?: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialProduct?.name || "");
  const [category, setCategory] = useState<"Coffee" | "Non-Coffee" | "Food" | "Pastry">(
    initialProduct?.category || "Coffee"
  );
  const [price, setPrice] = useState<number>(initialProduct?.price ?? 20000);
  const [stock, setStock] = useState<number>(initialProduct?.stock ?? 30);
  const [description, setDescription] = useState(initialProduct?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim().toLowerCase(),
        category,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        description: description.trim().toLowerCase(),
      },
      initialProduct?.id
    );
    onClose();
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 font-mono lowercase text-zinc-950 dark:text-zinc-50">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-none bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
            <PackagePlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
              {initialProduct ? "edit product" : "add new product"}
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 lowercase">
              {initialProduct ? "update catalog product details" : "add a new item to your pos menu"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-none hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            product name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. vanilla caramel macchiato"
            className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "Coffee" | "Non-Coffee" | "Food" | "Pastry")
              }
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 font-mono"
            >
              <option value="Coffee">coffee</option>
              <option value="Non-Coffee">non-coffee</option>
              <option value="Food">food</option>
              <option value="Pastry">pastry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              initial stock *
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            price (idr) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
              rp
            </span>
            <input
              type="number"
              min="0"
              step="500"
              required
              value={price}
              onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 font-mono font-bold focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            description (optional)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="flavor notes, ingredients, or preparation details"
            className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 font-mono"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
          >
            {initialProduct ? "save changes" : "create product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 no-print font-mono lowercase">
      <ProductFormContent
        key={initialProduct?.id || "new-product"}
        initialProduct={initialProduct}
        onSave={onSave}
        onClose={onClose}
      />
    </div>
  );
}
