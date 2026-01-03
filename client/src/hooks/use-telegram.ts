import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// ============================================
// STATS
// ============================================
export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.get.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

// ============================================
// USERS
// ============================================
export function useTelegramUsers() {
  return useQuery({
    queryKey: [api.telegram.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.telegram.users.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.telegram.users.list.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// MESSAGES (LOGS)
// ============================================
export function useTelegramMessages() {
  return useQuery({
    queryKey: [api.telegram.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.telegram.messages.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.telegram.messages.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Live-ish logs
  });
}

// ============================================
// BROADCAST
// ============================================
export function useSendBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const validated = api.telegram.broadcast.create.input.parse({ content });
      const res = await fetch(api.telegram.broadcast.create.path, {
        method: api.telegram.broadcast.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.telegram.broadcast.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send broadcast");
      }
      return api.telegram.broadcast.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: [api.telegram.messages.list.path] });
    },
  });
}
