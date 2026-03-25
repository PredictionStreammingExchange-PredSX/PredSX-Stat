export interface Envelope<T = any> {
  type: "trade" | "orderbook" | "price" | "signal" | "system";
  data: T;
  timestamp: string;
}

import { useSystemStore } from "@/store/systemStore";

type MessageHandler = (envelope: Envelope) => void;

export class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 2000;
  private handlers: Set<MessageHandler> = new Set();
  private onStatusChange?: (status: "connected" | "disconnected" | "error") => void;

  constructor(url: string, onStatusChange?: (status: "connected" | "disconnected" | "error") => void) {
    this.url = url;
    this.onStatusChange = onStatusChange;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.onStatusChange?.("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlers.forEach((handler) => handler(data));
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      this.ws.onclose = () => {
        this.onStatusChange?.("disconnected");
        this.attemptReconnect();
      };

      this.ws.onerror = (err) => {
        this.onStatusChange?.("error");
        console.error(`WebSocket error at ${this.url}:`, err);
      };
    } catch (err) {
      console.error("Failed to connect to WS", err);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnect attempts reached for ${this.url}`);
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * Math.min(this.reconnectAttempts, 5)); // Exponential backoff max 10s
  }

  public subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.unsubscribe(handler);
  }

  public unsubscribe(handler: MessageHandler) {
    this.handlers.delete(handler);
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open, cannot send message");
    }
  }
}

// Singleton instances for different streams (multiplexed on backend)
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8080/stream";

// Since the backend now multiplexes all data on /stream, 
// we use a single global connection to conserve resources.
export const mainStream = new WebSocketClient(WS_BASE, (status) => {
  useSystemStore.getState().setWsStatus(status === "connected");
  if (status === "error" || status === "disconnected") {
    // Optionally trigger a reconnect increment here if needed
    useSystemStore.getState().incrementReconnect();
  }
});

// Re-export old names as the same singleton for backward compatibility 
// during the transition, but they now share the exact same pipe.
export const tradeStream = mainStream;
export const orderbookStream = mainStream;
export const systemStream = mainStream;
