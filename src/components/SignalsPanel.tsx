"use client";

import { useSignalStore } from "@/store/signalStore";

export function SignalsPanel() {
  const signals = useSignalStore((state) => state.signals);

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-200">Live Signals</h2>
        <span className="text-xs text-neutral-500">{signals.length} events</span>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-neutral-500">
            <tr>
              <th className="pb-2">Time</th>
              <th className="pb-2">Market</th>
              <th className="pb-2">Type</th>
              <th className="pb-2 text-right">Value</th>
              <th className="pb-2 text-right">Threshold</th>
              <th className="pb-2">Severity</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {signals.map((s, i) => (
              <tr key={`${s.id}-${i}`} className="border-t border-neutral-800/60">
                <td className="py-2 pr-2">
                  {new Date(s.timestamp).toLocaleTimeString([], { hour12: false })}
                </td>
                <td className="py-2 pr-2">{s.marketId}</td>
                <td className="py-2 pr-2">{s.type}</td>
                <td className="py-2 text-right">{Number(s.value).toFixed(4)}</td>
                <td className="py-2 text-right">{Number(s.threshold).toFixed(4)}</td>
                <td className="py-2">
                  <span
                    className={
                      s.severity === "high"
                        ? "text-red-400"
                        : s.severity === "medium"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }
                  >
                    {s.severity}
                  </span>
                </td>
              </tr>
            ))}
            {signals.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-neutral-500">
                  Waiting for signals...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
