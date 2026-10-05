"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ProductModal } from "@/components/ProductModal";
import { useApp } from "@/context/AppContext";
import { Product, ProductCategory } from "@/lib/types";
import { formatRupiah } from "@/lib/storage";
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  Coffee,
  CupSoda,
  Utensils,
  Cookie,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories: ProductCategory[] = ["All", "Coffee", "Non-Coffee", "Food", "Pastry"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (
    data: Omit<Product, "id" | "sku">,
    existingId?: string
  ) => {
    if (existingId && editingProduct) {
      updateProduct({
        ...editingProduct,
        ...data,
      });
    } else {
      addProduct(data);
    }
  };

  const handleQuickStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct({ ...product, stock: newStock });
  };

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
    <div className="flex-1 flex flex-col min-w-0 font-mono lowercase">
      <Header
        title="product management"
        subtitle="catalog list, pricing controls, and real-time inventory levels"
        actions={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>add product</span>
          </button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
        {/* Controls Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search products or sku..."
                className="w-full pl-10 pr-9 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 transition-all font-mono"
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

            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
              total catalog: <span className="font-bold text-zinc-900 dark:text-zinc-100">{products.length} products</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-none text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Card with Adaptive Mobile View */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center p-6">
              <div className="w-12 h-12 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto mb-3 border border-zinc-300 dark:border-zinc-700">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                no products found
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                try modifying search or adding a new product.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Products List (< sm screens) */}
              <div className="sm:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredProducts.map((p) => {
                  const isOut = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= 10;

                  return (
                    <div key={p.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                              {getCategoryIcon(p.category)}
                              {p.category}
                            </span>
                            <span className="font-mono text-zinc-400 text-[10px]">{p.sku}</span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-sm text-zinc-950 dark:text-zinc-50 shrink-0">
                          {formatRupiah(p.price)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quick Stock Controls */}
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-[11px] text-zinc-400 mr-1">stock:</span>
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            disabled={p.stock <= 0}
                            className="w-6 h-6 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold text-zinc-800 dark:text-zinc-200"
                            title="decrease stock"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{p.stock}</span>
                          <button
                            onClick={() => handleQuickStock(p, 5)}
                            className="w-6 h-6 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-800 dark:text-zinc-200"
                            title="add +5 stock"
                          >
                            +
                          </button>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-2">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-none border border-rose-300 dark:border-rose-800">
                              out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-none border border-amber-300 dark:border-amber-800">
                              low: {p.stock}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                              in stock
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-none border border-zinc-300 dark:border-zinc-700"
                            title="edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-none border border-rose-300 dark:border-rose-800"
                            title="delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (>= sm screens) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">product</th>
                      <th className="py-3.5 px-5">category</th>
                      <th className="py-3.5 px-5">sku</th>
                      <th className="py-3.5 px-5 text-right">price</th>
                      <th className="py-3.5 px-5 text-center">stock</th>
                      <th className="py-3.5 px-5 text-center">status</th>
                      <th className="py-3.5 px-5 text-right">actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredProducts.map((p) => {
                      const isOut = p.stock <= 0;
                      const isLow = p.stock > 0 && p.stock <= 10;

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                        >
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-zinc-950 dark:text-zinc-100 text-xs sm:text-sm">
                              {p.name}
                            </div>
                            {p.description && (
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs mt-0.5">
                                {p.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                              {getCategoryIcon(p.category)}
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-zinc-500 dark:text-zinc-400 text-[11px]">
                            {p.sku}
                          </td>
                          <td className="py-3.5 px-5 font-mono font-bold text-zinc-950 dark:text-zinc-50 text-right whitespace-nowrap">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <div className="inline-flex items-center gap-1.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                              <button
                                onClick={() => handleQuickStock(p, -1)}
                                disabled={p.stock <= 0}
                                className="w-5 h-5 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300"
                                title="decrease stock by 1"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{p.stock}</span>
                              <button
                                onClick={() => handleQuickStock(p, 5)}
                                className="w-5 h-5 rounded-none bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300"
                                title="add +5 stock"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-none border border-rose-300 dark:border-rose-800">
                                <AlertTriangle className="w-3 h-3" /> out of stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-none border border-amber-300 dark:border-amber-800">
                                <AlertTriangle className="w-3 h-3" /> low stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" /> in stock
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                title="edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(`are you sure you want to delete "${p.name}"?`)
                                  ) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-none border border-transparent hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                                title="delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
}
