<p align="center">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Framework-Next.js%2014-000000?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/UI-Tailwind%20CSS-06B6D4?logo=tailwindcss" alt="Tailwind CSS">
</p>

# PredSX-Stat — Real-Time Market UI

**PredSX-Stat** is the official real-time React dashboard for the [PredSX Engine](https://github.com/PredictionStreammingExchange-PredSX/PredSX). It connects directly to the backend's live WebSocket gateway to stream Polymarket orderbooks, active trades, and predictive signals directly into the browser.

---

## 🔌 Connection to Main Backend

This frontend acts as a "dumb terminal" — it relies entirely on the primary **PredSX** backend repository to supply processed data. Here is exactly how the frontend connects to the main repo's data streams:

```mermaid
graph TD
    subgraph MainRepo [PredSX (Backend on Port 8080)]
        style MainRepo fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
        A[(Apache Kafka)] -->|Normalized Events| B[Go API Gateway]
        B -->|Broadcast Hub| C((WebSocket Port 8080))
    end

    subgraph FrontendRepo [PredSX-Stat (Frontend on Port 3000)]
        style FrontendRepo fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff
        D[src/services/websocket.ts]
        E[(Zustand State Stores)]
        F[React Components / UI]
        D -->|State Hydration| E
        E -->|React Hooks| F
    end

    C -.->|ws://localhost:8080/stream| D
```

### 1. Data Ingestion Point
The `src/services/websocket.ts` file acts as the primary "Main" script that links the entire frontend to the backend. It maintains a persistent WebSocket connection to `ws://localhost:8080/stream` running from your main backend repo.

### 2. Live State Broadcasting
As the backend pushes normalized trades, price updates, and L2 orderbooks, the `websocket.ts` service catches these payloads and pumps them into `Zustand` state managers (e.g. `src/store/marketStore.ts`). 

### 3. Reactive UI Update
Once the store is updated, any interconnected `.tsx` components instantly re-render on the screen without needing page refreshes.

---

## 🛠️ Working With The App (Local Development)

To use the primary functionality of this UI, you must ensure the [PredSX Engine stack](https://github.com/PredictionStreammingExchange-PredSX/PredSX) is running on port `8080` in the background (using the `start-docker.bat` in the main repo).

### 1. Installation
Clone this repository and install the standard Node packages:
```bash
git clone https://github.com/PredictionStreammingExchange-PredSX/PredSX-Stat.git
cd PredSX-Stat
npm install
```

### 2. Running Local Dev
Start the Next.js development server:
```bash
npm run dev
```

The primary dashboard will be immediately available at **http://localhost:3000**.
