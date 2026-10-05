"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Settings,
  CircleDot,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, settings, cashier, lockTerminal } = useApp();

  const navItems = [
    {
      label: "dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "pos",
      href: "/pos",
      icon: ShoppingCart,
      badge: cart.length > 0 ? cart.reduce((acc, i) => acc + i.quantity, 0) : null,
    },
    {
      label: "transactions",
      href: "/transactions",
      icon: Receipt,
    },
    {
      label: "products",
      href: "/products",
      icon: Package,
    },
    {
      label: "settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-zinc-950 border-r border-zinc-300 dark:border-zinc-800 h-screen sticky top-0 shrink-0 select-none z-30 no-print rounded-none font-mono lowercase">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-none bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm">
            p
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-950 dark:text-zinc-50 text-base tracking-tight lowercase">
                minipos
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-none bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                pro
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium lowercase">
              {settings.storeName || "proticafe"}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
            menu
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white dark:text-zinc-950" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-none font-bold ${
                      isActive
                        ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white"
                        : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cashier Status Box at Bottom */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 rounded-none p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
                cashier
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-200 dark:border-emerald-800">
                <CircleDot className="w-2.5 h-2.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                open
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-none bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 shrink-0 font-bold text-xs uppercase">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate lowercase">
                  {cashier.name}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate lowercase">
                  {cashier.shift}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                lockTerminal();
                router.push("/login");
              }}
              title="kunci terminal kasir"
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-zinc-200/70 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>kunci kasir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-300 dark:border-zinc-800 px-1 py-1 sm:px-2 sm:py-1.5 flex justify-around items-center no-print rounded-none font-mono lowercase">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-none text-[9px] sm:text-[10px] font-medium relative transition-colors ${
                isActive ? "text-zinc-950 dark:text-zinc-50 font-bold" : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-600"}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-none flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 truncate max-w-full text-center leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
