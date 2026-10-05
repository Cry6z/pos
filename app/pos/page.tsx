"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useApp } from "@/context/AppContext";
import { ProductCategory } from "@/lib/types";
import { Search, ShoppingBag, X, Coffee, Utensils, CupSoda, Cookie } from "lucide-react";
import { formatRupiah } from "@/lib/storage";

export default function POSPage() {
  const { products, cart, total } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const categories: { label: ProductCategory; icon?: React.ReactNode }[] = [
    { label: "All" },
    { label: "Coffee", icon: <Coffee className="w-3.5 h-3.5" /> },
    { label: "Non-Coffee", icon: <CupSoda className="w-3.5 h-3.5" /> },
    { label: "Food", icon: <Utensils className="w-3.5 h-3.5" /> },
    { label: "Pastry", icon: <Cookie className="w-3.5 h-3.5" /> },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalCartQty = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden font-mono lowercase">
      <Header
        title="pos cashier terminal"
        subtitle="select items, manage cart and process instant customer checkout"
      />

      <main className="flex-1 flex overflow-hidden p-4 lg:p-6 gap-6 max-w-7xl w-full mx-auto">
        {/* LEFT COLUMN: Product Catalog */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Catalog Controls */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 space-y-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search coffee, drinks, foods or sku..."
                className="w-full pl-10 pr-9 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs with Sharp Corners */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 py-16">
                <div className="w-12 h-12 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3 border border-zinc-300 dark:border-zinc-700">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  no products found
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
                  we couldn&apos;t find any item matching &quot;{searchQuery}&quot;. try adjusting your keywords or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Cart Panel */}
        <div className="hidden lg:flex w-96 shrink-0 h-full flex-col">
          <Cart onOpenCheckout={() => setIsCheckoutOpen(true)} />
        </div>
      </main>

      {/* Mobile Floating Cart Trigger Bar */}
      {totalCartQty > 0 && (
        <div className="lg:hidden fixed bottom-16 left-4 right-4 z-30 no-print animate-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full flex items-center justify-between p-3.5 bg-zinc-950 dark:bg-zinc-900 text-white rounded-none shadow-xl border border-zinc-800 dark:border-zinc-700"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-none bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">
                  view order ({totalCartQty} items)
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  total: {formatRupiah(total)}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-white text-zinc-950 px-3 py-1 rounded-none">
              open cart
            </span>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer Modal */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-h-[85vh] bg-white dark:bg-zinc-900 rounded-none shadow-2xl flex flex-col overflow-hidden border-t-2 border-zinc-950 dark:border-zinc-700">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 pl-2">current cart</span>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Cart
                onOpenCheckout={() => {
                  setIsMobileCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
