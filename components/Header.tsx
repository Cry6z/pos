"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Clock, Sun, Moon, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/lib/storage";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, total, settings, theme, toggleTheme, cashier, lockTerminal } = useApp();
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).toLowerCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    if (title) return title.toLowerCase();
    if (pathname === "/") return "dashboard overview";
    if (pathname.startsWith("/pos")) return "pos terminal";
    if (pathname.startsWith("/transactions")) return "transaction history";
    if (pathname.startsWith("/products")) return "product management";
    if (pathname.startsWith("/settings")) return "system settings";
    return "minipos";
  };

  const cartTotalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="h-16 px-3 sm:px-6 lg:px-8 border-b border-zinc-300 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 sticky top-0 z-20 flex items-center justify-between no-print rounded-none font-mono lowercase">
      {/* Brand & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <div className="lg:hidden w-7 h-7 shrink-0 rounded-none bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
          p
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm lg:text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight truncate lowercase">
            {getPageTitle()}
          </h1>
          {subtitle ? (
            <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate lowercase">
              {subtitle}
            </p>
          ) : (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate lowercase">
              {settings.storeName || "proticafe"} • terminal kasir
            </p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Active Cashier Pill with Quick Lock */}
        <button
          onClick={() => {
            lockTerminal();
            router.push("/login");
          }}
          title="kunci terminal kasir (lock)"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-none bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold transition-colors"
        >
          <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-bold hidden xs:inline sm:inline">{cashier.name}</span>
          <Lock className="w-3 h-3 text-zinc-400 sm:ml-0.5" />
        </button>

        {/* Live Clock (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span>{timeString || "06 oct 2026"}</span>
        </div>

        {/* Theme Toggle Button (Mode Siang / Mode Malam) */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "ganti ke mode siang" : "ganti ke mode malam"}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-none bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold transition-colors shadow-sm"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline">mode siang</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              <span className="hidden md:inline">mode malam</span>
            </>
          )}
        </button>

        {actions}

        {/* Quick Cart Pill if not on /pos */}
        {pathname !== "/pos" && (
          <Link
            href="/pos"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-none bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0" />
            <span className="hidden sm:inline">pos order</span>
            {cartTotalQty > 0 && (
              <span className="bg-amber-400 dark:bg-zinc-900 text-zinc-950 dark:text-white font-bold px-1.5 py-0.2 rounded-none text-[10px]">
                {cartTotalQty} <span className="hidden xl:inline">({formatRupiah(total)})</span>
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
