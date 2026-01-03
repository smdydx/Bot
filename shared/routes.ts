import { z } from "zod";
import { insertBroadcastSchema, telegramUsers, telegramMessages, broadcasts } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  stats: {
    get: {
      method: "GET" as const,
      path: "/api/stats",
      responses: {
        200: z.object({
          totalUsers: z.number(),
          activeUsers: z.number(),
          totalMessages: z.number(),
        }),
      },
    },
  },
  telegram: {
    users: {
      list: {
        method: "GET" as const,
        path: "/api/telegram/users",
        responses: {
          200: z.array(z.custom<typeof telegramUsers.$inferSelect>()),
        },
      },
    },
    messages: {
      list: {
        method: "GET" as const,
        path: "/api/telegram/messages",
        responses: {
          200: z.array(z.custom<typeof telegramMessages.$inferSelect>()),
        },
      },
    },
    broadcast: {
      create: {
        method: "POST" as const,
        path: "/api/telegram/broadcast",
        input: z.object({
          content: z.string().min(1, "Message content is required"),
        }),
        responses: {
          201: z.custom<typeof broadcasts.$inferSelect>(),
          400: errorSchemas.validation,
        },
      },
    },
  },
};
