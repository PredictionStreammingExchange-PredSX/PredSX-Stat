import { create } from "zustand";

export interface SystemMetricsEvent {
  timestamp: string;
  eventsPerSecond: number;
  activeStreams: number;
  kafkaLag: number;
  orderbookUpdateRate: number;
}

interface SystemStore {
  history: SystemMetricsEvent[];
  currentMetrics: SystemMetricsEvent | null;
  wsConnected: boolean;
  reconnectCount: number;
  addMetricsEvent: (event: SystemMetricsEvent) => void;
  setWsStatus: (connected: boolean) => void;
  incrementReconnect: () => void;
  resetReconnect: () => void;
}

const MAX_HISTORY = 60; // Keep last 60 data points for charts

export const useSystemStore = create<SystemStore>((set) => ({
  history: [],
  currentMetrics: null,
  wsConnected: false,
  reconnectCount: 0,
  addMetricsEvent: (event) =>
    set((state) => {
      const history = [...state.history, event].slice(-MAX_HISTORY);
      return { currentMetrics: event, history };
    }),
  setWsStatus: (connected) => set({ wsConnected: connected }),
  incrementReconnect: () => set((state) => ({ reconnectCount: state.reconnectCount + 1 })),
  resetReconnect: () => set({ reconnectCount: 0 }),
}));
