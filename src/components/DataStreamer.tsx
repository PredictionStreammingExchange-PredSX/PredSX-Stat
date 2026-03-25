"use client";

import { useEffect } from "react";
import { mainStream, Envelope } from "@/services/websocket";
import { useSystemStore } from "@/store/systemStore";
import { useTradeStore } from "@/store/tradeStore";
import { useOrderbookStore } from "@/store/orderbookStore";
import { useSignalStore } from "@/store/signalStore";

export function DataStreamer() {
  const addMetricsEvent = useSystemStore((state) => state.addMetricsEvent);
  const addTrade = useTradeStore((state) => state.addTrade);
  const setOrderbook = useOrderbookStore((state) => state.setOrderbook);
  const addSignal = useSignalStore((state) => state.addSignal);

  useEffect(() => {
    // connect to the multiplexed stream globally when the app mounts
    mainStream.connect();

    // router for all real-time events from Kafka
    const unsubscribe = mainStream.subscribe((envelope: Envelope) => {
      const { type, data } = envelope;

      switch (type) {
        case "trade":
          addTrade({
            id: data.trade_id,
            symbol: data.market_id,
            price: data.price,
            size: data.size,
            side: data.side,
            timestamp: data.timestamp,
          });
          break;

        case "orderbook":
          setOrderbook({
            symbol: data.market_id,
            bids: (data.bids || []).map((b: any) => ({ 
              price: parseFloat(b.price), 
              size: parseFloat(b.size) 
            })),
            asks: (data.asks || []).map((a: any) => ({ 
              price: parseFloat(a.price), 
              size: parseFloat(a.size) 
            })),
            sequence: new Date(data.timestamp).getTime(),
          });
          break;

        case "price":
          // map price updates to system health events for visualization
          addMetricsEvent({
            timestamp: data.timestamp,
            eventsPerSecond: Math.floor(data.volume_24h / 86400),
            activeStreams: 1, // static for now
            kafkaLag: 0,
            orderbookUpdateRate: 1,
          });
          break;

        case "signal":
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
          break;

        case "system":
          // fallback for legacy/mock data
          addMetricsEvent(data);
          break;
      }
    });

    return () => {
      unsubscribe();
      // Only disconnect when the entire app unmounts
      mainStream.disconnect();
    };
  }, [addMetricsEvent, addTrade, setOrderbook, addSignal]);

  // This is a logic-only component that never renders anything
  return null;
}
