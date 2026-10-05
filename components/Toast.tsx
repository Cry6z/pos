"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 font-mono lowercase">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-700 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />,
        };

        const borders = {
          success: "border-emerald-300 bg-white shadow-emerald-950/10",
          info: "border-blue-300 bg-white shadow-blue-950/10",
          warning: "border-amber-300 bg-white shadow-amber-950/10",
          error: "border-rose-300 bg-white shadow-rose-950/10",
        };

        const type = toast.type || "success";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-none border shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borders[type]}`}
          >
            {icons[type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-950 leading-snug lowercase">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed lowercase">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded-none hover:bg-zinc-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
