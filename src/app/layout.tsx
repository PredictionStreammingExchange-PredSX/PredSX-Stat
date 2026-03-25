import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StreamStatus } from "@/components/StreamStatus";
import { DataStreamer } from "@/components/DataStreamer";
import Link from "next/link";
import { Activity, BarChart2, BookOpen, Layers, LayoutDashboard, Signal } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PredSX Dashboard",
  description: "Real-time monitoring and trading engine dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-neutral-200 min-h-screen flex flex-col`}>
        <DataStreamer />
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">PredSX</span>
            <span className="text-neutral-500 text-sm ml-2">Terminal</span>
          </div>
          <div className="flex items-center space-x-4">
            <StreamStatus />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-56 border-r border-neutral-800 bg-neutral-950 flex flex-col py-4 hidden md:flex">
            <nav className="flex-1 px-3 space-y-1">
              <Link href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                <LayoutDashboard className="mr-3 h-4 w-4 text-neutral-400" />
                Overview
              </Link>
              <Link href="/markets" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                <BarChart2 className="mr-3 h-4 w-4 text-neutral-400" />
                Markets
              </Link>
              <Link href="/trades" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                <Activity className="mr-3 h-4 w-4 text-neutral-400" />
                Live Trades
              </Link>
              <Link href="/orderbook" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                <BookOpen className="mr-3 h-4 w-4 text-neutral-400" />
                Orderbook
              </Link>
              <Link href="/signals" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                <Signal className="mr-3 h-4 w-4 text-neutral-400" />
                Signals
              </Link>
              <div className="pt-4 mt-4 border-t border-neutral-800">
                <Link href="/system" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
                  <Layers className="mr-3 h-4 w-4 text-neutral-400" />
                  System Metrics
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-black">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
