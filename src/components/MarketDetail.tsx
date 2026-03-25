"use client";

import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, MarketDetail, PriceHistoryPoint, Signal } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RESOLUTIONS = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "1h", value: "1h" },
] as const;

interface MarketDetailProps {
  marketId: string;
}

export function MarketDetail({ marketId }: MarketDetailProps) {
  const [market, setMarket] = useState<MarketDetail | null>(null);
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);
  const [resolution, setResolution] = useState<typeof RESOLUTIONS[number]["value"]>("1m");
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getMarketDetail(marketId)
      .then((data) => setMarket(data))
      .finally(() => setLoading(false));
  }, [marketId]);

  useEffect(() => {
    setHistoryLoading(true);
    api
      .getMarketPriceHistory(marketId, resolution, 500)
      .then((data) => setHistory(data))
      .finally(() => setHistoryLoading(false));
  }, [marketId, resolution]);

  const chartData = useMemo(
    () =>
      history
        .map((point) => ({
          ...point,
          label: new Date(point.timestamp).toLocaleTimeString([], { hour12: false }),
          avg_price: point.avg_price ?? 0,
        }))
        .reverse(),
    [history]
  );

  if (loading || !market) {
    return <div className="p-8 text-center">Loading market...</div>;
  }

  const tokenRows = market.tokens
    ? Object.entries(market.tokens).map(([key, value]) => (
        <div key={key} className="flex justify-between text-sm text-neutral-400">
          <span className="font-mono">{key}</span>
          <span>{value}</span>
        </div>
      ))
    : null;

  const signalRows = (market.signals || []).slice(0, 3).map((signal: Signal) => (
    <div key={signal.signal_id} className="flex justify-between text-sm text-neutral-400">
      <span className="font-semibold">{signal.signal_type}</span>
      <span>{signal.value.toFixed(3)}</span>
    </div>
  ));

  return (
    <div className="space-y-6">
      <section className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950/40 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{market.title}</h1>
            <p className="text-sm text-neutral-400">{market.question}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={market.status === "ACTIVE" ? "default" : "secondary"}>
              {market.status ?? "UNKNOWN"}
            </Badge>
            {market.exchange && (
              <span className="text-xs uppercase tracking-widest text-neutral-500">{market.exchange}</span>
            )}
          </div>
        </div>
        <div className="grid gap-3 text-sm text-neutral-300 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-neutral-500">Start</p>
            <p>{market.startTime ? new Date(market.startTime).toLocaleString() : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">End</p>
            <p>{market.endTime ? new Date(market.endTime).toLocaleString() : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Outcomes</p>
            <p>{market.outcomes?.join(", ") || "—"}</p>
          </div>
        </div>
        {tokenRows && (
          <div className="space-y-1 border-t border-neutral-800 pt-3 text-xs text-neutral-400">
            <p className="text-neutral-500">Tokens</p>
            {tokenRows}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Price History</h2>
            <p className="text-xs text-neutral-500">
              {chartData.length} points · resolution {resolution}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {RESOLUTIONS.map((option) => (
              <Button
                key={option.value}
                variant={resolution === option.value ? "outline" : "ghost"}
                size="sm"
                onClick={() => setResolution(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {historyLoading ? (
          <div className="h-56 text-center text-sm text-neutral-500">Loading history...</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <XAxis dataKey="label" stroke="#475569" />
              <YAxis stroke="#475569" domain={["dataMin", "dataMax"]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", borderColor: "#1f2937" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="avg_price"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {signalRows.length > 0 && (
        <section className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Signals</h2>
            <span className="text-xs text-neutral-500">Live</span>
          </div>
          <div className="space-y-2">{signalRows}</div>
        </section>
      )}
    </div>
  );
}
