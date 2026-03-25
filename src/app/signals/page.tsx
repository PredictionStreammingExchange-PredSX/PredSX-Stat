"use client";

import { useEffect, useMemo, useState } from "react";
import { mainStream, Envelope } from "@/services/websocket";
import { useSignalStore } from "@/store/signalStore";
import { api } from "@/services/api";
import { SignalsPanel } from "@/components/SignalsPanel";
import { SignalChart } from "@/components/SignalChart";

const SIGNAL_TYPES = ["all", "spread", "orderbook_imbalance", "liquidity_gap", "arbitrage"];

export default function SignalsPage() {
  const addSignal = useSignalStore((state) => state.addSignal);
  const setSignals = useSignalStore((state) => state.setSignals);
  const signals = useSignalStore((state) => state.signals);

  const [selectedType, setSelectedType] = useState("all");
  const [marketFilter, setMarketFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mainStream.connect();
    const unsubscribe = mainStream.subscribe((envelope: Envelope) => {
      if (envelope.type !== "signal") return;
      const data = envelope.data as any;
      addSignal({
        id: data.signal_id,
        marketId: data.market_id,
        token: data.token,
        type: data.signal_type,
        value: data.value,
        threshold: data.threshold,
        severity: data.severity,
        timestamp: data.timestamp,
        details: data.details,
      });
    });

    return () => {
      unsubscribe();
      mainStream.disconnect();
    };
  }, [addSignal]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getSignals(marketFilter || undefined, selectedType === "all" ? undefined : selectedType)
      .then((data) => {
        if (!mounted) return;
        setSignals(
          (data || []).map((s: any) => ({
            id: s.signal_id,
            marketId: s.market_id,
            token: s.token,
            type: s.signal_type,
            value: s.value,
            threshold: s.threshold,
            severity: s.severity,
            timestamp: s.timestamp,
            details: s.details,
          }))
        );
      })
      .catch(() => {
        if (mounted) setSignals([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [marketFilter, selectedType, setSignals]);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      if (selectedType !== "all" && s.type !== selectedType) return false;
      if (marketFilter && !s.marketId.includes(marketFilter)) return false;
      return true;
    });
  }, [signals, selectedType, marketFilter]);

  const chartMode: "count" | "value" = selectedType === "all" ? "count" : "value";

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Signals</h1>
        <p className="text-neutral-400">Real-time signal engine with historical context.</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Type</span>
            <select
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-md px-3 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {SIGNAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Market</span>
            <input
              className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-md px-3 py-2 w-[320px] max-w-full"
              placeholder="Filter by market id (optional)"
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value.trim())}
            />
          </div>

          {loading && <span className="text-xs text-neutral-500">Loading historical signals...</span>}
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">
          {chartMode === "count" ? "Signal Count" : "Signal Values"}
        </h2>
        <SignalChart signals={filteredSignals} mode={chartMode} />
      </div>

      <SignalsPanel />
    </div>
  );
}
