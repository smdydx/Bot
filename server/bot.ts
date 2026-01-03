import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";

let bot: TelegramBot | null = null;

export function startBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set. Bot will not start.");
    return;
  }

  // Create a bot that uses 'polling' to fetch new updates
  bot = new TelegramBot(token, { polling: true });

  console.log("Telegram Bot started...");

  // Matches "/start"
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const user = msg.from;

    if (user) {
      await storage.upsertTelegramUser({
        telegramId: chatId,
        username: user.username || null,
        firstName: user.first_name || null,
        lastName: user.last_name || null,
        isActive: true,
      });
    }

    const resp = 'Welcome to TrustPivot Bot!';
    bot?.sendMessage(chatId, resp);

    // Log outbound welcome message
    await storage.logTelegramMessage({
        telegramId: chatId,
        content: resp,
        direction: "outbound",
        metadata: { type: "welcome" }
    });
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id.toString();
    const text = msg.text;
    const user = msg.from;

    if (!text) return; // Ignore non-text messages for now

    // Log inbound message
    await storage.logTelegramMessage({
        telegramId: chatId,
        content: text,
        direction: "inbound",
        metadata: { message_id: msg.message_id }
    });
    
    // Ensure user exists/update activity
    if (user) {
        await storage.upsertTelegramUser({
            telegramId: chatId,
            username: user.username || null,
            firstName: user.first_name || null,
            lastName: user.last_name || null,
            isActive: true,
        });
    }

    // Echo/Reply logic can go here (optional)
    // For now, just logging.
  });

  bot.on("polling_error", (msg) => {
      console.log("Polling Error:", msg);
  });
}

export async function broadcastMessage(content: string): Promise<{ sent: number; failed: number }> {
    if (!bot) {
        throw new Error("Bot not initialized");
    }

    const users = await storage.getTelegramUsers();
    let sent = 0;
    let failed = 0;

    for (const user of users) {
        if (!user.isActive) continue;

        try {
            await bot.sendMessage(user.telegramId, content);
            sent++;
            
            // Log outbound
            await storage.logTelegramMessage({
                telegramId: user.telegramId,
                content: content,
                direction: "outbound",
                metadata: { type: "broadcast" }
            });

        } catch (error) {
            console.error(`Failed to send to ${user.telegramId}:`, error);
            failed++;
            // Optionally mark user as inactive if error is "blocked"
        }
    }

    return { sent, failed };
}
