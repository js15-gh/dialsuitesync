import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupWebSocket } from "./websocket";
import { db } from "@db";
import { callLogs, apiStatus } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  setupWebSocket(httpServer);

  app.get("/api/calls", async (_req, res) => {
    const logs = await db.query.callLogs.findMany({
      orderBy: (logs, { desc }) => [desc(logs.createdAt)],
      limit: 100
    });
    res.json(logs);
  });

  app.get("/api/status", async (_req, res) => {
    const [dialpadStatus, netsuiteStatus] = await Promise.all([
      db.query.apiStatus.findFirst({
        where: eq(apiStatus.service, "dialpad")
      }),
      db.query.apiStatus.findFirst({
        where: eq(apiStatus.service, "netsuite")
      })
    ]);
    
    res.json({
      dialpad: dialpadStatus,
      netsuite: netsuiteStatus
    });
  });

  return httpServer;
}
