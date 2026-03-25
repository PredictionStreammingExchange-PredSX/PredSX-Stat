"use client";

import { useOrderbookStore } from "@/store/orderbookStore";
import { useEffect, useState } from "react";

export function OrderbookView() {
  const { bids, asks, symbol } = useOrderbookStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Compute max size for depth bar visualization
  const maxBidSize = Math.max(...bids.map(b => b.size), 1);
  const maxAskSize = Math.max(...asks.map(a => a.size), 1);
  const maxSize = Math.max(maxBidSize, maxAskSize);

  return (
    <div className="rounded-md border border-neutral-800 bg-black text-sm font-mono overflow-hidden">
      <div className="bg-neutral-950 p-2 border-b border-neutral-800 text-neutral-400 font-sans flex justify-between items-center">
        <span>Orderbook {symbol ? `- ${symbol}` : ""}</span>
        <span className="text-xs">Spread: {asks.length && bids.length ? (asks[0].price - bids[0].price).toFixed(2) : "-"}</span>
      </div>
      
      <div className="grid grid-cols-2 divide-x divide-neutral-800 h-[500px] overflow-hidden">
        {/* Bids */}
        <div className="overflow-auto relative bg-neutral-950/20">
          <div className="grid grid-cols-[1fr_auto] sticky top-0 bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-xs py-1 px-4 z-10">
            <div>Size</div>
            <div className="text-right">Bid Price</div>
          </div>
          <div className="flex flex-col">
            {bids.map((bid, i) => (
              <div key={`bid-${bid.price}-${i}`} className="relative grid grid-cols-[1fr_auto] px-4 py-1 hover:bg-neutral-800/50 group">
                {/* Depth Indicator Background */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-green-500/10 pointer-events-none transition-all duration-300 ease-in-out"
                  style={{ width: `${(bid.size / maxSize) * 100}%` }}
                />
                <div className="relative text-neutral-300">{bid.size}</div>
                <div className="relative text-green-500 font-semibold">{bid.price.toFixed(2)}</div>
              </div>
            ))}
            {bids.length === 0 && <div className="p-4 text-center text-neutral-600 text-xs">No Bids</div>}
          </div>
        </div>

        {/* Asks */}
        <div className="overflow-auto relative bg-neutral-950/20">
          <div className="grid grid-cols-[auto_1fr] sticky top-0 bg-neutral-900 border-b border-neutral-800 text-neutral-400 text-xs py-1 px-4 z-10">
            <div>Ask Price</div>
            <div className="text-right">Size</div>
          </div>
          <div className="flex flex-col">
            {asks.map((ask, i) => (
              <div key={`ask-${ask.price}-${i}`} className="relative grid grid-cols-[auto_1fr] px-4 py-1 hover:bg-neutral-800/50 group">
                {/* Depth Indicator Background */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-red-500/10 pointer-events-none transition-all duration-300 ease-in-out"
                  style={{ width: `${(ask.size / maxSize) * 100}%` }}
                />
                <div className="relative text-red-500 font-semibold">{ask.price.toFixed(2)}</div>
                <div className="relative text-right text-neutral-300">{ask.size}</div>
              </div>
            ))}
            {asks.length === 0 && <div className="p-4 text-center text-neutral-600 text-xs">No Asks</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
