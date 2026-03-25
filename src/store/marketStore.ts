import { create } from "zustand";
import { api, Market } from "@/services/api";

interface MarketStore {
  markets: Market[];
  isLoading: boolean;
  error: string | null;
  fetchMarkets: () => Promise<void>;
  updateMarket: (market: Market) => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
  markets: [],
  isLoading: false,
  error: null,
  fetchMarkets: async () => {
    set({ isLoading: true, error: null });
    try {
      const markets = await api.getMarkets();
      set({ markets, isLoading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err), isLoading: false });
    }
  },
  updateMarket: (updated) =>
    set((state) => ({
      markets: state.markets.map((m) => (m.marketId === updated.marketId ? updated : m)),
    })),
}));
