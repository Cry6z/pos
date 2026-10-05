"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const prevPathnameRef = useRef<string>(pathname);
  const [isTransitioningFromLogin, setIsTransitioningFromLogin] = useState<boolean>(false);

  const isLoginPage = pathname === "/login";

  // Auth guard: if locked or not authenticated, redirect to /login
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoginPage, router]);

  // Detect route transition handover from /login to dashboard/POS
  useEffect(() => {
    if (prevPathnameRef.current === "/login" && !isLoginPage) {
      setIsTransitioningFromLogin(true);
      const timer = setTimeout(() => {
        setIsTransitioningFromLogin(false);
      }, 700);
      return () => clearTimeout(timer);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isLoginPage]);

  if (isLoginPage) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="flex w-full min-h-screen relative overflow-x-hidden">
      {/* Handover Telemetry Sweep Accent when arriving from login */}
      {isTransitioningFromLogin && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-zinc-950 dark:bg-white z-50 anim-sweep pointer-events-none" />
      )}

      {/* Sidebar with entrance motion */}
      <div className={`shrink-0 ${isTransitioningFromLogin ? "anim-slide-left" : ""}`}>
        <Sidebar />
      </div>

      {/* Main Content Area with smooth entrance */}
      <div
        key={pathname}
        className={`flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 ${
          isTransitioningFromLogin ? "anim-slide-up" : "anim-fade-in"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
