import { 
  telegramUsers, telegramMessages, broadcasts,
  type TelegramUser, type InsertTelegramUser,
  type TelegramMessage, type InsertTelegramMessage,
  type Broadcast, type InsertBroadcast,
  type StatsResponse
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Stats
  getStats(): Promise<StatsResponse>;

  // Users
  getTelegramUsers(): Promise<TelegramUser[]>;
  upsertTelegramUser(user: InsertTelegramUser): Promise<TelegramUser>;

  // Messages
  logTelegramMessage(message: InsertTelegramMessage): Promise<TelegramMessage>;
  getTelegramMessages(limit?: number): Promise<TelegramMessage[]>;

  // Broadcasts
  createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
  getBroadcasts(): Promise<Broadcast[]>;
}

export class DatabaseStorage implements IStorage {
  async getStats(): Promise<StatsResponse> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(telegramUsers);
    const [activeCount] = await db.select({ count: sql<number>`count(*)` }).from(telegramUsers).where(eq(telegramUsers.isActive, true));
    const [msgCount] = await db.select({ count: sql<number>`count(*)` }).from(telegramMessages);

    return {
      totalUsers: Number(userCount?.count || 0),
      activeUsers: Number(activeCount?.count || 0),
      totalMessages: Number(msgCount?.count || 0),
    };
  }

  async getTelegramUsers(): Promise<TelegramUser[]> {
    return await db.select().from(telegramUsers).orderBy(desc(telegramUsers.joinedAt));
  }

  async upsertTelegramUser(user: InsertTelegramUser): Promise<TelegramUser> {
    const [upserted] = await db
      .insert(telegramUsers)
      .values(user)
      .onConflictDoUpdate({
        target: telegramUsers.telegramId,
        set: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          lastActiveAt: new Date(),
          isActive: true,
        },
      })
      .returning();
    return upserted;
  }

  async logTelegramMessage(message: InsertTelegramMessage): Promise<TelegramMessage> {
    const [logged] = await db.insert(telegramMessages).values(message).returning();
    return logged;
  }

  async getTelegramMessages(limit = 50): Promise<TelegramMessage[]> {
    return await db.select().from(telegramMessages).orderBy(desc(telegramMessages.createdAt)).limit(limit);
  }

  async createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast> {
    const [created] = await db.insert(broadcasts).values(broadcast).returning();
    return created;
  }

  async getBroadcasts(): Promise<Broadcast[]> {
    return await db.select().from(broadcasts).orderBy(desc(broadcasts.createdAt));
  }
}

export const storage = new DatabaseStorage();
