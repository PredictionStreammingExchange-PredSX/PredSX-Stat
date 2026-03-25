"use client";

import { SystemHealth } from "@/components/SystemHealth";
import { SignalsPanel } from "@/components/SignalsPanel";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">PredSX Terminal</h1>
        <p className="text-neutral-400">High-performance streaming engine operational overview.</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-neutral-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Live Health Metrics
        </h2>
        <SystemHealth />
      </div>

      <SignalsPanel />
    </div>
  );
}
