export interface HealthResponse {
  status: string;
}

export interface Market {
  marketId: string;
  slug?: string;
  title?: string;
  question?: string;
  status?: string;
  exchange?: string;
  eventId?: string;
  startTime?: string;
  endTime?: string;
  outcomes?: string[];
  price?: number;
  midPrice?: number;
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
  volume?: number;
  yesPrice?: number;
  noPrice?: number;
  tokens?: Record<string, any>;
}

export interface MarketDetail extends Market {
  metadataRaw?: Record<string, any>;
  signals?: Signal[];
}

export interface PriceHistoryPoint {
  timestamp: string;
  trade_count?: number;
  volume?: number;
  avg_price?: number;
}

export interface SystemMetrics {
  eventsPerSecond: number;
  activeStreams: number;
  kafkaLag: number;
  orderbookUpdateRate: number;
}

export interface Signal {
  signal_id: string;
  market_id: string;
  token?: string;
  signal_type: string;
  value: number;
  threshold: number;
  severity: string;
  timestamp: string;
  details?: Record<string, any>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

function mapMarket(payload: any): Market {
  return {
    marketId: payload.market_id,
    slug: payload.slug,
    title: payload.title,
    question: payload.question,
    status: payload.status,
    exchange: payload.exchange,
    eventId: payload.event_id,
    startTime: payload.start_time,
    endTime: payload.end_time,
    outcomes: Array.isArray(payload.outcomes) ? payload.outcomes : [],
    price: typeof payload.price === "number" ? payload.price : undefined,
    midPrice: typeof payload.mid_price === "number" ? payload.mid_price : undefined,
    bestBid: typeof payload.best_bid === "number" ? payload.best_bid : undefined,
    bestAsk: typeof payload.best_ask === "number" ? payload.best_ask : undefined,
    spread: typeof payload.spread === "number" ? payload.spread : undefined,
    volume: typeof payload.volume === "number" ? payload.volume : undefined,
    yesPrice: typeof payload.yes_price === "number" ? payload.yes_price : undefined,
    noPrice: typeof payload.no_price === "number" ? payload.no_price : undefined,
    tokens: payload.tokens,
  };
}

function mapMarketDetail(payload: any): MarketDetail {
  return {
    ...mapMarket(payload),
    metadataRaw: payload.metadata_raw,
    signals: Array.isArray(payload.signals) ? payload.signals : [],
  };
}

function buildQuery(params: Record<string, string>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.append(key, value);
    }
  });
  return search.toString() ? `?${search.toString()}` : "";
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Failed to fetch health");
    return res.json();
  },

  async getMarkets(options?: { limit?: number; offset?: number; status?: string; exchange?: string }): Promise<Market[]> {
    const params: Record<string, string> = {
      limit: String(options?.limit ?? 200),
      offset: String(options?.offset ?? 0),
      exchange: options?.exchange ?? "polymarket",
    };
    if (options?.status) {
      params.status = options.status;
    }
    const res = await fetch(`${API_BASE}/v1/markets${buildQuery(params)}`);
    if (!res.ok) throw new Error("Failed to fetch markets");
    const data = await res.json();
    return data.map((m: any) => mapMarket(m));
  },

  async getMarketDetail(marketId: string): Promise<MarketDetail> {
    const res = await fetch(`${API_BASE}/v1/markets/${marketId}`);
    if (!res.ok) throw new Error("Failed to fetch market detail");
    const data = await res.json();
    return mapMarketDetail(data);
  },

  async getMarketPriceHistory(marketId: string, resolution = "1m", limit = 500): Promise<PriceHistoryPoint[]> {
    const params: Record<string, string> = {
      resolution,
      limit: String(limit),
    };
    const res = await fetch(`${API_BASE}/v1/markets/${marketId}/price-history${buildQuery(params)}`);
    if (!res.ok) throw new Error("Failed to fetch price history");
    return res.json();
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    const res = await fetch(`${API_BASE}/system/metrics`);
    if (!res.ok) throw new Error("Failed to fetch metrics");
    return res.json();
  },

  async getSignals(marketId?: string, signalType?: string): Promise<Signal[]> {
    const params = new URLSearchParams();
    if (signalType) params.set("type", signalType);
    const suffix = marketId ? `/debug/signals/${marketId}` : "/debug/signals";
    const url = params.toString() ? `${API_BASE}${suffix}?${params.toString()}` : `${API_BASE}${suffix}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch signals");
    return res.json();
  },
};
