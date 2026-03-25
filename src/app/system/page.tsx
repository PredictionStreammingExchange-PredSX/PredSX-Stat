import { SystemHealth } from "@/components/SystemHealth";

export default function SystemPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">System Telemetry</h1>
        <p className="text-neutral-400">Engine throughput, active streams, and Kafka ingestion lag.</p>
      </div>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 backdrop-blur-sm">
        <SystemHealth />
      </div>
    </div>
  );
}
