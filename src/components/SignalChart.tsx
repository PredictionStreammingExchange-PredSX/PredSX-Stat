"use client";

import { useEffect, useMemo, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, LineSeries } from "lightweight-charts";
import { Signal } from "@/store/signalStore";

interface SignalChartProps {
  signals: Signal[];
  mode: "value" | "count";
}

export function SignalChart({ signals, mode }: SignalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const seriesData = useMemo(() => {
    if (mode === "count") {
      const bucket = new Map<number, number>();
      for (const s of signals) {
        const t = new Date(s.timestamp).getTime();
        const minute = Math.floor(t / 60000) * 60;
        bucket.set(minute, (bucket.get(minute) || 0) + 1);
      }
      return Array.from(bucket.entries())
        .map(([time, value]) => ({ time, value }))
        .sort((a, b) => a.time - b.time);
    }

    return signals
      .map((s) => ({
        time: Math.floor(new Date(s.timestamp).getTime() / 1000),
        value: Number(s.value) || 0,
      }))
      .sort((a, b) => a.time - b.time);
  }, [signals, mode]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 260,
      layout: {
        background: { color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: mode === "count" ? "#22c55e" : "#f59e0b",
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [mode]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const data = seriesData.map((d) => ({
      time: d.time as any,
      value: d.value,
    }));
    seriesRef.current.setData(data);
  }, [seriesData]);

  return <div ref={chartContainerRef} className="w-full h-[260px]" />;
}
