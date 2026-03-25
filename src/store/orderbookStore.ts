import { create } from "zustand";

export interface OrderbookEntry {
  price: number;
  size: number;
}

export interface OrderbookState {
  symbol: string;
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  sequence: number;
}

interface OrderbookStore {
  symbol: string | null;
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  sequence: number;
  setOrderbook: (data: OrderbookState) => void;
  updateOrderbook: (updates: Partial<OrderbookState>) => void;
  clear: () => void;
}

export const useOrderbookStore = create<OrderbookStore>((set) => ({
  symbol: null,
  bids: [],
  asks: [],
  sequence: 0,
  setOrderbook: (data) => set(data),
  updateOrderbook: (updates) =>
    set((state) => {
      // In a real app, you'd merge the updates into the existing top-of-book efficiently
      return { ...state, ...updates };
    }),
  clear: () => set({ symbol: null, bids: [], asks: [], sequence: 0 }),
}));
