"use client";

import { useTradeStore } from "@/store/tradeStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

export function TradeFeed() {
  const trades = useTradeStore((state) => state.trades);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-md border border-neutral-800 bg-black max-h-[600px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-neutral-950 z-10">
          <TableRow className="border-neutral-800 hover:bg-transparent">
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, i) => (
            <TableRow 
              key={`${trade.id}-${i}`} 
              className={`border-neutral-800/50 font-mono text-xs hover:bg-neutral-900 ${
                trade.side === "buy" ? "text-green-500" : "text-red-500"
              }`}
            >
              <TableCell className="text-neutral-500 py-2">
                {new Date(trade.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}
              </TableCell>
              <TableCell className="py-2 text-neutral-300">{trade.symbol}</TableCell>
              <TableCell className="text-right py-2">
                {trade.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right py-2">{trade.size}</TableCell>
            </TableRow>
          ))}
          {trades.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-neutral-500">
                Waiting for trades...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
