"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Coffee, Clock, Sun, Moon, Delete, CheckCircle2 } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const { loginWithPin, settings, theme, toggleTheme } = useApp();

  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "welcoming" | "exiting">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("memverifikasi pin kasir...");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // Prefetch dashboard on mount
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        }).toLowerCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyPin = useCallback(
    (pin: string) => {
      const ok = loginWithPin(pin);
      if (ok) {
        setTransitionPhase("welcoming");
        setStatusMessage("pin terverifikasi • shift cashier aktif");
        setPinError(false);
        router.prefetch("/");

        // Stage 1: preparing data (500ms)
        const t1 = setTimeout(() => {
          setStatusMessage("menyiapkan data toko proticafe...");
        }, 500);

        // Stage 2: start smooth exit animation (1000ms)
        const t2 = setTimeout(() => {
          setStatusMessage("membuka dashboard overview...");
          setTransitionPhase("exiting");
        }, 1000);

        // Stage 3: smooth navigation handover to dashboard (1400ms)
        const t3 = setTimeout(() => {
          router.push("/");
        }, 1400);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      } else {
        setPinError(true);
        setTimeout(() => {
          setPinInput("");
          setPinError(false);
        }, 800);
      }
    },
    [loginWithPin, router]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (pinInput.length < 4 && transitionPhase === "idle") {
        const next = pinInput + digit;
        setPinInput(next);
        if (next.length === 4) {
          handleVerifyPin(next);
        }
      }
    },
    [pinInput, transitionPhase, handleVerifyPin]
  );

  const handleBackspace = useCallback(() => {
    if (transitionPhase === "idle") {
      setPinInput((prev) => prev.slice(0, -1));
      setPinError(false);
    }
  }, [transitionPhase]);

  const handleClear = useCallback(() => {
    if (transitionPhase === "idle") {
      setPinInput("");
      setPinError(false);
    }
  }, [transitionPhase]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-mono lowercase select-none relative overflow-hidden">
      {/* Top Minimal Navigation Bar */}
      <header className="h-16 px-6 sm:px-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block leading-tight">
              {settings.storeName || "proticafe"}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              terminal kasir • bengkulu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>{currentDate}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="switch mode siang / malam"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        {transitionPhase !== "idle" ? (
          /* Transition Screen: "Selamat Datang" with smooth sequential animation */
          <div
            className={`w-full max-w-md text-center space-y-6 py-12 transition-all duration-400 ease-in-out ${
              transitionPhase === "exiting"
                ? "anim-exit-fade-up pointer-events-none"
                : "anim-zoom-in"
            }`}
          >
            <div className="w-16 h-16 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 mx-auto flex items-center justify-center font-bold shadow-lg border border-zinc-950 dark:border-white">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 dark:text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                selamat datang
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
                terminal kasir {settings.storeName || "proticafe"} siap digunakan.
              </p>
            </div>

            <div className="pt-2 max-w-xs mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span>kasir: cashier</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">shift 1 aktif ✓</span>
              </div>
              {/* Minimal Progress Bar */}
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-950 dark:bg-white animate-[progress_1s_ease-in-out_forwards]" />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 min-h-[18px] transition-all">
                {statusMessage}
              </p>
            </div>
          </div>
        ) : (
          /* State 1: "hi, how are you?" + Minimalist PIN Entry */
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Greeting Typography */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                hi, how are you?
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                masukkan pin kasir untuk membuka terminal.
              </p>
            </div>

            {/* 4-Digit PIN Boxes */}
            <div className="space-y-2 w-full">
              <div
                className={`flex items-center justify-center gap-3.5 p-3.5 border transition-all ${
                  pinError
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30 animate-shake"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900"
                }`}
              >
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinInput.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 border transition-all duration-150 ${
                        isFilled
                          ? "bg-zinc-950 dark:bg-white border-zinc-950 dark:border-white scale-110"
                          : "bg-transparent border-zinc-400 dark:border-zinc-600"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="h-5 flex items-center justify-center text-xs">
                {pinError ? (
                  <span className="text-red-600 dark:text-red-400 font-bold animate-in fade-in">
                    pin salah! coba lagi.
                  </span>
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                    ketik langsung dari keyboard atau gunakan keypad
                  </span>
                )}
              </div>
            </div>

            {/* Minimalist Sharp Keypad */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mx-auto text-base">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigit(num)}
                  className="h-14 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-bold border border-zinc-300 dark:border-zinc-700 active:scale-95 transition-all text-base shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-14 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold border border-zinc-300 dark:border-zinc-700 active:scale-95 transition-all text-xs"
              >
                c
              </button>
              <button
                type="button"
                onClick={() => handleDigit("0")}
                className="h-14 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-bold border border-zinc-300 dark:border-zinc-700 active:scale-95 transition-all text-base shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-14 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold border border-zinc-300 dark:border-zinc-700 active:scale-95 transition-all flex items-center justify-center"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="h-12 px-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 bg-white/50 dark:bg-zinc-950/50">
        <span>terminal pos v2.0</span>
        <span>proticafe • all rights reserved</span>
      </footer>

      {/* Seamless Transition Overlay Curtain during route switch */}
      {transitionPhase === "exiting" && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-white/85 dark:bg-zinc-950/85 backdrop-blur-sm flex flex-col items-center justify-center anim-fade-in">
          <div className="space-y-4 text-center max-w-xs px-6">
            <div className="w-10 h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 mx-auto flex items-center justify-center font-bold text-xs shadow-md">
              <Coffee className="w-5 h-5 animate-pulse" />
            </div>
            <div className="w-40 h-1 bg-zinc-200 dark:bg-zinc-800 mx-auto overflow-hidden">
              <div className="h-full bg-zinc-950 dark:bg-white anim-sweep" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block tracking-tight">
                {settings.storeName || "proticafe"} terminal
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                transisi ke dashboard overview...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
