import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { ToastContainer } from "@/components/Toast";
import { GlobalReceiptViewer } from "@/components/GlobalReceiptViewer";

const anonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-anonymous-pro",
});

export const metadata: Metadata = {
  title: "minipos - proticafe point of sale",
  description: "modern pos, digital payment & e-receipt prototype for proticafe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anonymousPro.variable} h-full antialiased lowercase`}
    >
      <body className="min-h-full flex bg-[#f8fafc] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-mono lowercase selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
        <AppProvider>
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
              {children}
            </div>
          </div>
          <ToastContainer />
          <GlobalReceiptViewer />
        </AppProvider>
      </body>
    </html>
  );
}
