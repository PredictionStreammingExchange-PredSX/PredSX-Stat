import { MarketDetail } from "@/components/MarketDetail";

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Market Detail</h1>
        <p className="text-neutral-400">Price history, signals, and metadata per market.</p>
      </div>
      <MarketDetail marketId={params.id} />
    </div>
  );
}
