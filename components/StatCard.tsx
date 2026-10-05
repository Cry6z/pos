"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  caption?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  caption,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-300 dark:border-zinc-800 p-6 sm:p-7 shadow-sm font-mono lowercase space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider lowercase">
          {title}
        </span>
        <div className="w-8 h-8 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50 font-mono tracking-tight">
          {value}
        </h3>

        {(change || caption) && (
          <div className="flex items-center gap-1.5 text-xs">
            {change && (
              <span
                className={`font-semibold ${
                  changeType === "positive"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : changeType === "negative"
                    ? "text-rose-700 dark:text-rose-400"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {change}
              </span>
            )}
            {caption && <span className="text-zinc-500 dark:text-zinc-400">{caption}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
