import { OrderbookView } from "@/components/OrderbookView";

export default function OrderbookPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Orderbook Depth</h1>
        <p className="text-neutral-400">Real-time bids and asks visualization.</p>
      </div>
      <OrderbookView />
    </div>
  );
}
