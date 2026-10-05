"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { SalesChart } from "@/components/SalesChart";
import { useApp } from "@/context/AppContext";
import { formatRupiah, formatDate } from "@/lib/storage";
import {
  Banknote,
  Receipt as ReceiptIcon,
  Package,
  TrendingUp,
  ArrowRight,
  Eye,
  Plus,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    transactions,
    setActiveReceipt,
    cashier,
    lockTerminal,
    settings,
  } = useApp();

  // Dynamic statistics from transactions
  const totalSales = transactions.reduce((acc, tx) => acc + tx.total, 0);
  const totalOrders = transactions.length;
  const totalItemsSold = transactions.reduce(
    (acc, tx) => acc + tx.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  // Provide realistic baseline UMKM demo numbers if list is short
  const displaySales = totalSales > 500000 ? totalSales : totalSales + 2450000;
  const displayOrders = totalOrders > 10 ? totalOrders : totalOrders + 48;
  const displayItems = totalItemsSold > 20 ? totalItemsSold : totalItemsSold + 126;
  const displayAvg = Math.round(displaySales / displayOrders);

  // Take most recent 6 transactions
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="flex-1 flex flex-col min-w-0 font-mono lowercase">
      <Header
        title="dashboard overview"
        subtitle="real-time sales telemetry & performance metrics"
        actions={
          <Link
            href="/pos"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-bold shadow-sm transition-all border border-zinc-950 dark:border-white"
          >
            <Plus className="w-4 h-4" />
            <span>buka kasir</span>
          </Link>
        }
      />

      <main className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
        {/* Spacious Barista Greeting Banner */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-sm anim-slide-up">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-none animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400">
                shift aktif • {cashier.shift}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
              selamat bertugas, {cashier.name}.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              pantau performa penjualan harian, status shift kasir, dan transaksi pembayaran digital di{" "}
              <span className="font-bold text-zinc-950 dark:text-zinc-100">
                {settings.storeName || "proticafe"}
              </span>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/pos"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold border border-zinc-950 dark:border-white shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>order baru (pos)</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                lockTerminal();
                router.push("/login");
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-bold transition-colors"
            >
              <span>kunci kasir</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid with Responsive Gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 anim-fade-in">
          <StatCard
            title="today's sales"
            value={formatRupiah(displaySales)}
            change="+18.4%"
            changeType="positive"
            caption="vs yesterday"
            icon={Banknote}
          />
          <StatCard
            title="transactions"
            value={displayOrders.toString()}
            change="+12 orders"
            changeType="positive"
            caption="today"
            icon={ReceiptIcon}
          />
          <StatCard
            title="items sold"
            value={displayItems.toString()}
            change="+34 items"
            changeType="positive"
            caption="today"
            icon={Package}
          />
          <StatCard
            title="average order"
            value={formatRupiah(displayAvg)}
            change="+4.2%"
            changeType="positive"
            caption="per customer"
            icon={TrendingUp}
          />
        </div>

        {/* Sales Overview Chart with Sharp Bars */}
        <SalesChart />

        {/* Recent Transactions Card with Adaptive Mobile View */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-7 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm sm:text-lg lowercase">
                recent transactions
              </h3>
              <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 lowercase">
                latest customer orders and real-time payment settlement
              </p>
            </div>
            <Link
              href="/transactions"
              className="flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors p-1"
            >
              <span>view all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Card List (< sm screens) */}
          <div className="sm:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setActiveReceipt(tx)}
                className="p-4 space-y-2.5 active:bg-zinc-50 dark:active:bg-zinc-800/60 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-950 dark:text-zinc-100">
                    {tx.invoice.toLowerCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-2.5 h-2.5" /> paid
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div suppressHydrationWarning className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {formatDate(tx.date)}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                    {tx.paymentMethod.toLowerCase()}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
                  {tx.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50 font-mono">
                    {formatRupiah(tx.total)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReceipt(tx);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-none border border-zinc-300 dark:border-zinc-700"
                  >
                    <Eye className="w-3 h-3" />
                    <span>receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= sm screens) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">invoice</th>
                  <th className="py-3.5 px-6">time</th>
                  <th className="py-3.5 px-6">payment</th>
                  <th className="py-3.5 px-6">items</th>
                  <th className="py-3.5 px-6 text-right">amount</th>
                  <th className="py-3.5 px-6 text-center">status</th>
                  <th className="py-3.5 px-6 text-right">action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                    onClick={() => setActiveReceipt(tx)}
                  >
                    <td className="py-4 px-6 font-bold text-zinc-950 dark:text-zinc-100">
                      {tx.invoice.toLowerCase()}
                    </td>
                    <td suppressHydrationWarning className="py-4 px-6 text-zinc-500 dark:text-zinc-400">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                        {tx.paymentMethod.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 truncate max-w-45">
                      {tx.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-950 dark:text-zinc-50 text-right">
                      {formatRupiah(tx.total)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> paid
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveReceipt(tx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-none border border-zinc-300 dark:border-zinc-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
