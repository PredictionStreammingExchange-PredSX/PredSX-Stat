 "use client";

import Link from "next/link";
import { useMarketStore } from "@/store/marketStore";
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["ALL", "ACTIVE", "CLOSED"] as const;

export function MarketTable() {
  const { markets, fetchMarkets, isLoading, error } = useMarketStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>("ALL");

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const filtered = useMemo(() => {
    return markets.filter((market) => {
      const matchesStatus =
        statusFilter === "ALL" || (market.status || "").toUpperCase() === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      if (!filter) return true;
      const needle = filter.toLowerCase();
      return (
        (market.marketId?.toLowerCase().includes(needle) ?? false) ||
        (market.title?.toLowerCase().includes(needle) ?? false) ||
        (market.slug?.toLowerCase().includes(needle) ?? false) ||
        (market.outcomes || []).some((outcome) => outcome.toLowerCase().includes(needle))
      );
    });
  }, [markets, filter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  if (isLoading) {
    return <div className="p-4 text-center">Loading markets...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading markets: {error}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-md px-3 py-2 w-[260px] max-w-full"
          placeholder="Filter by ID, title, or outcome"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>Status</span>
          <select
            className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-md px-2 py-1"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>Page size</span>
          <select
            className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-md px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm text-neutral-400">
          <button
            className="px-3 py-1 rounded-md border border-neutral-800 hover:bg-neutral-900 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
          >
            Prev
          </button>
          <span>
            Page {safePage} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-md border border-neutral-800 hover:bg-neutral-900 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-md border border-neutral-800">
      <Table>
        <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead>Market</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Spread</TableHead>
              <TableHead className="text-right">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((market) => (
              <TableRow key={market.marketId} className="border-neutral-800 hover:bg-neutral-900/50">
                <TableCell className="font-medium text-neutral-100">
                  <div>{market.marketId}</div>
                  <div className="text-xs text-neutral-500">{market.slug}</div>
                </TableCell>
                <TableCell className="text-neutral-200 text-sm">{market.title}</TableCell>
                <TableCell>
                  <Badge variant={market.status === "ACTIVE" ? "default" : "secondary"}>
                    {market.status ?? "UNKNOWN"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-neutral-300">
                  {typeof market.price === "number" ? market.price.toFixed(3) : "-"}
                </TableCell>
                <TableCell className="text-right text-neutral-300">
                  {market.volume ? market.volume.toLocaleString() : "-"}
                </TableCell>
                <TableCell className="text-right text-neutral-300">
                  {typeof market.spread === "number" ? market.spread.toFixed(3) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/markets/${market.marketId}`}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
              <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                No markets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
