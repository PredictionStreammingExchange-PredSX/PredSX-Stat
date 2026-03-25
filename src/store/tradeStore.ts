import { create } from "zustand";

export interface Trade {
  id: string; // derived or from backend
  symbol: string;
  price: number;
  size: number;
  timestamp: string;
  side: "buy" | "sell";
}

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  setTrades: (trades: Trade[]) => void;
}

const MAX_TRADES = 100;

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  addTrade: (trade) =>
    set((state) => {
      const newTrades = [trade, ...state.trades].slice(0, MAX_TRADES);
      return { trades: newTrades };
    }),
  setTrades: (trades) => set({ trades }),
}));
