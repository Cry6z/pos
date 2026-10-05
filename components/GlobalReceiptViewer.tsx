"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Receipt } from "./Receipt";

export function GlobalReceiptViewer() {
  const { activeReceipt, setActiveReceipt } = useApp();

  if (!activeReceipt) return null;

  return (
    <Receipt
      transaction={activeReceipt}
      onClose={() => setActiveReceipt(null)}
    />
  );
}
