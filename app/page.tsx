"use client";

import React from "react";
import Link from "next/link";
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
  const { transactions, setActiveReceipt } = useApp();

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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-none text-xs font-semibold shadow-sm transition-all border border-zinc-950 dark:border-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>open pos</span>
          </Link>
        }
      />

      <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Recent Transactions Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm sm:text-base lowercase">
                recent transactions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 lowercase">
                latest customer orders and payment confirmations
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">invoice</th>
                  <th className="py-3 px-5">time</th>
                  <th className="py-3 px-5">payment</th>
                  <th className="py-3 px-5">items</th>
                  <th className="py-3 px-5 text-right">amount</th>
                  <th className="py-3 px-5 text-center">status</th>
                  <th className="py-3 px-5 text-right">action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                    onClick={() => setActiveReceipt(tx)}
                  >
                    <td className="py-3.5 px-5 font-bold text-zinc-950 dark:text-zinc-100">
                      {tx.invoice.toLowerCase()}
                    </td>
                    <td className="py-3.5 px-5 text-zinc-500 dark:text-zinc-400">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                        {tx.paymentMethod.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-zinc-600 dark:text-zinc-300 truncate max-w-[180px]">
                      {tx.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-zinc-950 dark:text-zinc-50 text-right">
                      {formatRupiah(tx.total)}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> paid
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveReceipt(tx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2.5 py-1 rounded-none border border-zinc-300 dark:border-zinc-700 transition-colors"
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
