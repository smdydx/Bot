import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { startBot, broadcastMessage } from "./bot";
import { isAuthenticated } from "./replit_integrations/auth"; // Middleware for protection

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protect all API routes with Replit Auth
  // We can't apply it globally because auth routes themselves need to be public
  // So we apply it to specific routes or groups.
  const protectedApi = [
    api.stats.get.path,
    api.telegram.users.list.path,
    api.telegram.messages.list.path,
    api.telegram.broadcast.create.path
  ];

  // Stats
  app.get(api.stats.get.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Users
  app.get(api.telegram.users.list.path, isAuthenticated, async (req, res) => {
    const users = await storage.getTelegramUsers();
    res.json(users);
  });

  // Messages
  app.get(api.telegram.messages.list.path, isAuthenticated, async (req, res) => {
    const messages = await storage.getTelegramMessages();
    res.json(messages);
  });

  // Broadcast
  app.post(api.telegram.broadcast.create.path, isAuthenticated, async (req, res) => {
    try {
      const { content } = api.telegram.broadcast.create.input.parse(req.body);
      
      // Start broadcast process
      const { sent, failed } = await broadcastMessage(content);

      const broadcast = await storage.createBroadcast({
          content,
          sentCount: sent,
          failedCount: failed,
          status: "completed"
      });

      res.status(201).json(broadcast);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to broadcast message" });
    }
  });

  // Start the bot
  startBot();

  return httpServer;
}
