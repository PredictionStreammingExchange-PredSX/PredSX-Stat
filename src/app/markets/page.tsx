import { MarketTable } from "@/components/MarketTable";

export default function MarketsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Discovered Markets</h1>
        <p className="text-neutral-400">Available trading pairs and their current status.</p>
      </div>
      <MarketTable />
    </div>
  );
}
