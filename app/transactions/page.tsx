"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/context/AppContext";
import { formatRupiah, formatDate } from "@/lib/storage";
import { PaymentMethod } from "@/lib/types";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Receipt,
  X,
} from "lucide-react";

export default function TransactionsPage() {
  const { transactions, setActiveReceipt } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const paymentMethods: (string | PaymentMethod)[] = [
    "All",
    "QRIS",
    "Cash",
    "GoPay",
    "OVO",
    "DANA",
    "ShopeePay",
  ];

  const statuses: string[] = ["All", "Paid", "Refunded"];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.customerName &&
          tx.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesMethod =
        selectedMethod === "All" || tx.paymentMethod === selectedMethod;

      const matchesStatus =
        selectedStatus === "All" || tx.status === selectedStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [transactions, searchQuery, selectedMethod, selectedStatus]);

  const totalFilteredSales = filteredTransactions.reduce(
    (acc, tx) => acc + tx.total,
    0
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 font-mono lowercase">
      <Header
        title="transaction history"
        subtitle="full audit trail of sales invoices and digital payment receipts"
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search invoice number, customer, item..."
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

            {/* Quick Summary Pill with Sharp Shape */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full md:w-auto text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-3.5 py-2 rounded-none">
              <span>found: {filteredTransactions.length} orders</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="font-bold text-zinc-950 dark:text-zinc-50">
                total: {formatRupiah(totalFilteredSales)}
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Payment Method Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> method:
              </span>
              {paymentMethods.map((method) => {
                const isActive = selectedMethod === method;
                return (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`px-2.5 sm:px-3 py-1 rounded-none text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:ml-auto w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider mr-1 shrink-0">
                status:
              </span>
              {statuses.map((status) => {
                const isActive = selectedStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-2.5 py-1 rounded-none text-xs font-medium whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transactions Table Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center p-6">
              <div className="w-12 h-12 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto mb-3 border border-zinc-300 dark:border-zinc-700">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                no transactions found
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                try modifying your search or payment filter.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Transaction Cards (< sm screens) */}
              <div className="sm:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredTransactions.map((tx) => {
                  const totalQty = tx.items.reduce((acc, i) => acc + i.quantity, 0);
                  return (
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
                        <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {formatDate(tx.date)}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                          {tx.paymentMethod.toLowerCase()}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-zinc-900 dark:text-zinc-200 mr-1.5">
                          {totalQty} {totalQty === 1 ? "item" : "items"}:
                        </span>
                        <span className="truncate">{tx.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}</span>
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
                  );
                })}
              </div>

              {/* Desktop Table (>= sm screens) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">invoice</th>
                      <th className="py-3.5 px-5">date & time</th>
                      <th className="py-3.5 px-5">items</th>
                      <th className="py-3.5 px-5">payment</th>
                      <th className="py-3.5 px-5 text-right">amount</th>
                      <th className="py-3.5 px-5 text-center">status</th>
                      <th className="py-3.5 px-5 text-right">action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredTransactions.map((tx) => {
                      const totalQty = tx.items.reduce((acc, i) => acc + i.quantity, 0);

                      return (
                        <tr
                          key={tx.id}
                          onClick={() => setActiveReceipt(tx)}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                        >
                          <td className="py-3.5 px-5 font-bold text-zinc-950 dark:text-zinc-100">
                            {tx.invoice.toLowerCase()}
                          </td>
                          <td className="py-3.5 px-5 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                            {formatDate(tx.date)}
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              {totalQty} {totalQty === 1 ? "item" : "items"}
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                              {tx.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                            </div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                              {tx.paymentMethod.toLowerCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-zinc-950 dark:text-zinc-50 text-right whitespace-nowrap">
                            {formatRupiah(tx.total)}
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> paid
                            </span>
                          </td>
                          <td
                            className="py-3.5 px-5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => setActiveReceipt(tx)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-none border border-zinc-300 dark:border-zinc-700 transition-colors shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>view receipt</span>
                            </button>
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
    </div>
  );
}
