"use client";

import React, { useState } from "react";
import { X, Shield, Terminal, CheckCircle2 } from "lucide-react";

interface OpenApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEndpoint?: string;
  payload?: unknown;
}

const STATIC_TIMESTAMP = "2026-10-05T14:30:00.000Z";
const STATIC_EXT_ID = "EXT-20261005-09881";

export function OpenApiModal({ isOpen, onClose }: OpenApiModalProps) {
  const [selectedApi, setSelectedApi] = useState<"QRIS" | "VA" | "EWALLET" | "PAYLATER">("QRIS");

  if (!isOpen) return null;

  const apiSpecs = {
    QRIS: {
      title: "SNAP BI - QRIS Dynamic MPM",
      endpoint: "POST /v1.0/qr/qr-mpm-generate",
      description: "Standar Nasional Open API Pembayaran (SNAP BI) untuk penerbitan Dynamic QRIS Merchant Presented Mode.",
      headers: {
        "Content-Type": "application/json",
        "X-TIMESTAMP": STATIC_TIMESTAMP,
        "X-PARTNER-ID": "PROTICAFE-MERCHANT-01",
        "X-EXTERNAL-ID": STATIC_EXT_ID,
        "X-SIGNATURE": "HMACSHA256(SecretKey, RequestPayload)",
      },
      request: {
        partnerReferenceNo: "INV-20261005-00129",
        amount: {
          value: "68000.00",
          currency: "IDR",
        },
        merchantId: "ID1020304050607",
        terminalId: "TERM-01",
        validityPeriod: "15M",
      },
      response: {
        responseCode: "2005100",
        responseMessage: "Successful",
        referenceNo: "REF-SNAP-QRIS-99812",
        qrContent: "00020101021226600016ID.CO.QRIS.WWW01189360050300000889220215ID102030405060751440014ID.LINKAJA.WWW0215ID1020304050607520458125303360540868000.005802ID5910proticafe6008BENGKULU61053837162070703A0163048A2C",
      },
    },
    VA: {
      title: "SNAP BI - Mobile Banking Virtual Account",
      endpoint: "POST /v1.0/transfer-va/create-va",
      description: "Open API integrasi perbankan (BCA, Mandiri, BRI) untuk pembuatan nomor Virtual Account real-time.",
      headers: {
        "Content-Type": "application/json",
        "X-TIMESTAMP": STATIC_TIMESTAMP,
        "X-PARTNER-ID": "PROTICAFE-MERCHANT-01",
        "X-SIGNATURE": "AsymmetricSignature_RSA2048(Payload)",
      },
      request: {
        partnerServiceId: "80777",
        customerNo: "081298765432",
        virtualAccountNo: "80777081298765432",
        virtualAccountName: "proticafe - walk-in",
        totalAmount: {
          value: "68000.00",
          currency: "IDR",
        },
        trxId: "TRX-VA-202610-09",
      },
      response: {
        responseCode: "2002700",
        responseMessage: "Successful",
        virtualAccountData: {
          partnerServiceId: "80777",
          customerNo: "081298765432",
          virtualAccountNo: "80777081298765432",
          inquiryStatus: "PENDING",
        },
      },
    },
    EWALLET: {
      title: "Open API - Direct E-Wallet Charge",
      endpoint: "POST /v1.0/debit/charge",
      description: "Protokol REST API untuk push-notification charge ke aplikasi GoPay/OVO/DANA dengan verifikasi PIN.",
      headers: {
        "Content-Type": "application/json",
        "X-TIMESTAMP": STATIC_TIMESTAMP,
        "X-PARTNER-ID": "PROTICAFE-MERCHANT-01",
        "Authorization": "Bearer snap_sec_token_991823a8b7c6",
      },
      request: {
        channelCode: "GOPAY",
        chargeType: "PUSH_NOTIFICATION",
        mobileNumber: "081298765432",
        amount: 68000,
        securityCheck: {
          pinRequired: true,
          encryptionType: "AES-256-GCM",
        },
      },
      response: {
        status: "SUCCESS",
        chargeId: "chg_gopay_98127391",
        pinVerified: true,
        transactionTime: STATIC_TIMESTAMP,
      },
    },
    PAYLATER: {
      title: "Open API - P2P Lending & PayLater Inquiry",
      endpoint: "POST /v1.0/lending/paylater-charge",
      description: "Integrasi sistem pembiayaan digital (P2P Lending / PayLater: SPayLater, Kredivo) dengan verifikasi OTP.",
      headers: {
        "Content-Type": "application/json",
        "X-TIMESTAMP": STATIC_TIMESTAMP,
        "X-PARTNER-ID": "PROTICAFE-MERCHANT-01",
      },
      request: {
        provider: "KREDIVO_P2P",
        loanTenor: "30_DAYS",
        interestRate: 0.0,
        otpToken: "8492",
        amount: 68000,
        borrowerRiskScore: "GRADE_A",
      },
      response: {
        loanApprovalStatus: "APPROVED",
        contractNo: "P2P-LEND-2026-99120",
        disbursementStatus: "SETTLED_TO_MERCHANT",
        nextBillingDate: "2026-11-05",
      },
    },
  };

  const current = apiSpecs[selectedApi];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 no-print font-mono lowercase">
      <div className="relative w-full max-w-3xl bg-zinc-950 text-zinc-100 rounded-none border-2 border-zinc-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white lowercase">
                  open api & webhook telemetry console
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  snap bi verified
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 lowercase">
                arsitektur integrasi finansial digital sistem minipos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Selector Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto">
          {(["QRIS", "VA", "EWALLET", "PAYLATER"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedApi(key)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                selectedApi === key
                  ? "border-emerald-500 text-emerald-400 bg-zinc-800/80 font-bold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              {key === "VA" ? "mobile banking (va)" : key === "EWALLET" ? "e-wallet api" : key === "PAYLATER" ? "p2p lending / paylater" : "qris (snap bi)"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Endpoint Banner */}
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
                {current.endpoint.split(" ")[0]}
              </span>
              <span className="font-mono text-xs text-white font-bold">
                {current.endpoint.split(" ")[1]}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              tls 1.3 / aes-256
            </span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed">
            {current.description}
          </p>

          {/* Request Headers */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 tracking-wider block mb-1.5">
              http request headers (snap bi signature)
            </span>
            <pre className="p-3.5 bg-black border border-zinc-800 text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(current.headers, null, 2)}
            </pre>
          </div>

          {/* Payload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider block mb-1.5 items-center gap-1">
                <span>request payload (json)</span>
              </span>
              <pre className="p-3.5 bg-black border border-zinc-800 text-[11px] text-emerald-300/90 overflow-x-auto h-52">
                {JSON.stringify(current.request, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider block mb-1.5 items-center gap-1">
                <span>gateway response (json)</span>
              </span>
              <pre className="p-3.5 bg-black border border-zinc-800 text-[11px] text-blue-300/90 overflow-x-auto h-52">
                {JSON.stringify(current.response, null, 2)}
              </pre>
            </div>
          </div>

          {/* Security & Concept Explain for Presentation */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              poin penting untuk presentasi fintech:
            </h4>
            <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-1 leading-relaxed">
              <li>
                <strong className="text-zinc-200">Open API:</strong> Menghubungkan kasir proticafe dengan ekosistem perbankan tanpa integrasi tertutup manual.
              </li>
              <li>
                <strong className="text-zinc-200">Keamanan:</strong> Dilindungi autentikasi ganda (HMAC-SHA256 signature, tokenisasi, OTP, dan PIN 6-digit).
              </li>
              <li>
                <strong className="text-zinc-200">Inklusi Keuangan:</strong> Mendukung transaksi tunai, QRIS, e-wallet, mobile banking, hingga P2P lending modal usaha.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors"
          >
            tutup console
          </button>
        </div>
      </div>
    </div>
  );
}
