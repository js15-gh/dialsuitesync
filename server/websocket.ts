import { WebSocketServer } from "ws";
import type { Server } from "http";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws"
  });

  wss.on("connection", (ws) => {
    ws.on("error", console.error);

    // Keep connection alive
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000);

    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  return wss;
}

export function broadcastCall(wss: WebSocketServer, callData: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({
        type: "call",
        ...callData
      }));
    }
  });
}
