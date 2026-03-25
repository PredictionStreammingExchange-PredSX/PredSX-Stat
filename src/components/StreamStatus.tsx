"use client";

import { useSystemStore } from "@/store/systemStore";
import { Badge } from "@/components/ui/badge";

export function StreamStatus() {
  const wsConnected = useSystemStore((state) => state.wsConnected);

  if (wsConnected) {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <span className="mr-2 h-2 w-2 rounded-full bg-white"></span>
        Connected
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <span className="mr-2 h-2 w-2 rounded-full bg-white animate-pulse"></span>
      Disconnected
    </Badge>
  );
}
