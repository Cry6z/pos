"use client";

import React, { useState } from "react";
import { formatRupiah } from "@/lib/storage";
import { TrendingUp, Calendar } from "lucide-react";

interface SalesPoint {
  time: string;
  amount: number;
  orders: number;
}

export function SalesChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Hourly sales data points for today
  const data: SalesPoint[] = [
    { time: "08:00", amount: 180000, orders: 4 },
    { time: "10:00", amount: 340000, orders: 8 },
    { time: "12:00", amount: 620000, orders: 14 },
    { time: "14:00", amount: 410000, orders: 9 },
    { time: "16:00", amount: 290000, orders: 6 },
    { time: "18:00", amount: 480000, orders: 11 },
    { time: "20:00", amount: 530000, orders: 12 },
  ];

  const maxAmount = Math.max(...data.map((d) => d.amount));
  const totalToday = data.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-5 shadow-sm space-y-4 font-mono lowercase">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm sm:text-base lowercase">
              sales overview
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-none border border-emerald-300 dark:border-emerald-800 lowercase">
              <TrendingUp className="w-3 h-3" />
              +14.2% today
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 lowercase">
            hourly sales velocity and transaction volume
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-3 py-1.5 rounded-none self-start sm:self-auto font-medium lowercase">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span>today (05 oct 2026)</span>
        </div>
      </div>

      {/* SVG / HTML Bar Chart with Sharp Bars */}
      <div className="pt-4">
        <div className="h-48 flex items-end gap-3 sm:gap-6 px-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          {data.map((item, index) => {
            const heightPercent = Math.round((item.amount / maxAmount) * 100);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.time}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[11px] py-1 px-2 rounded-none border border-zinc-800 dark:border-zinc-300 shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in duration-100 font-mono lowercase">
                    <p className="font-bold">{formatRupiah(item.amount)}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
                      {item.orders} orders at {item.time}
                    </p>
                  </div>
                )}

                {/* Sharp Bar Container */}
                <div
                  className="w-full max-w-[42px] bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-950 dark:group-hover:bg-zinc-100 rounded-none transition-all duration-150 relative overflow-hidden flex flex-col justify-end border border-zinc-200 dark:border-zinc-700"
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                >
                  <div
                    className={`w-full transition-all duration-150 rounded-none ${
                      isHovered
                        ? "bg-zinc-950 dark:bg-white"
                        : "bg-zinc-800 dark:bg-zinc-300"
                    }`}
                    style={{ height: "100%" }}
                  />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-mono transition-colors ${
                    isHovered
                      ? "font-bold text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Highlights */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 font-mono lowercase">
        <span>peak traffic: 12:00 wib</span>
        <span>hourly total: {formatRupiah(totalToday)}</span>
      </div>
    </div>
  );
}
