"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/context/AppContext";
import { StoreSettings } from "@/lib/types";
import {
  Store,
  User,
  Receipt,
  RotateCcw,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, theme, setTheme } = useApp();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = <K extends keyof StoreSettings>(field: K, value: StoreSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (
      confirm(
        "are you sure you want to reset all prototype data to defaults? this will restore original products, clear custom transactions, and reset settings."
      )
    ) {
      resetAllData();
      setFormData(settings);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 font-mono lowercase">
      <Header
        title="system settings"
        subtitle="configure store information, tax rate, cashier details, and prototype data"
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-4xl w-full mx-auto pb-24 lg:pb-10">
        {/* Theme Appearance Mode Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-7 h-7 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
              {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-zinc-300" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                mode tampilan (theme appearance)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase">
                pilih antara mode siang (terang) atau mode malam (gelap)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-none border text-xs font-bold transition-all ${
                theme === "light"
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                  : "bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>mode siang (light)</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-none border text-xs font-bold transition-all ${
                theme === "dark"
                  ? "bg-white text-zinc-950 border-white shadow-sm"
                  : "bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Moon className="w-4 h-4 text-zinc-400" />
              <span>mode malam (dark)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Profile Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                  store profile & branding
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase">
                  displayed on sidebar, header, and digital e-receipts
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  store name
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  store address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  phone / whatsapp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  instagram handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => handleChange("instagramHandle", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Cashier & Tax Configuration */}
          <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                  cashier & tax calculation
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase">
                  shift operator identity and tax configuration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  default cashier name
                </label>
                <input
                  type="text"
                  required
                  value={formData.cashierName}
                  onChange={(e) => handleChange("cashierName", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  tax rate (ppn / service charge)
                </label>
                <select
                  value={formData.taxRate.toString()}
                  onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 font-mono"
                >
                  <option value="0">0% (tax-free / umkm default)</option>
                  <option value="0.10">10% (pb1 restaurant tax)</option>
                  <option value="0.11">11% (ppn indonesia standard)</option>
                  <option value="0.12">12% (upcoming standard)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Receipt Customization */}
          <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                  e-receipt footer message
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 lowercase">
                  closing greeting printed at the bottom of customer receipts
                </p>
              </div>
            </div>

            <div>
              <textarea
                rows={3}
                value={formData.receiptFooter}
                onChange={(e) => handleChange("receiptFooter", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-none text-xs text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-400 font-mono"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>persisted automatically in client-side localstorage</span>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-bold shadow-sm transition-all border border-zinc-950 dark:border-white"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>save changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Prototype Reset Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-rose-200 dark:border-rose-900/60 p-4 sm:p-6 shadow-sm space-y-3 mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 lowercase">
                reset prototype data
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 lowercase">
                restores original proticafe menu items, seeds sample transaction history, and clears active cart.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-none text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>reset data</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
