"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, LineSeries } from "lightweight-charts";
import { useSystemStore } from "@/store/systemStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemHealth() {
  const metrics = useSystemStore((state) => state.currentMetrics);
  const history = useSystemStore((state) => state.history);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
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
      color: "#3b82f6",
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
  }, []);

  useEffect(() => {
    if (seriesRef.current && history.length > 0) {
      const data = history.map((m) => ({
        time: (new Date(m.timestamp).getTime() / 1000) as any,
        value: m.eventsPerSecond,
      }));
      // Filter out duplicate timestamps which lightweight-charts rejects
      const uniqueData = data.filter((v, i, a) => a.findIndex((t) => t.time === v.time) === i);
      seriesRef.current.setData(uniqueData);
    }
  }, [history]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events / sec</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.eventsPerSecond || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kafka Lag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.kafkaLag || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeStreams || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orderbook Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.orderbookUpdateRate || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartContainerRef} className="w-full h-[300px]" />
        </CardContent>
      </Card>
    </div>
  );
}
