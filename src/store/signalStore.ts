import { create } from "zustand";

export interface Signal {
  id: string;
  marketId: string;
  token?: string;
  type: string;
  value: number;
  threshold: number;
  severity: "low" | "medium" | "high" | string;
  timestamp: string;
  details?: Record<string, any>;
}

const MAX_SIGNALS = 200;

interface SignalStore {
  signals: Signal[];
  addSignal: (signal: Signal) => void;
  setSignals: (signals: Signal[]) => void;
}

export const useSignalStore = create<SignalStore>((set) => ({
  signals: [],
  addSignal: (signal) =>
    set((state) => ({
      signals: [signal, ...state.signals].slice(0, MAX_SIGNALS),
    })),
  setSignals: (signals) =>
    set({ signals: signals.slice(0, MAX_SIGNALS) }),
}));
