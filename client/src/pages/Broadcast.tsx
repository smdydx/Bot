import { Layout } from "@/components/Layout";
import { useSendBroadcast } from "@/hooks/use-telegram";
import { useState } from "react";
import { Send, AlertCircle, CheckCircle2, Radio, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Broadcast() {
  const [content, setContent] = useState("");
  const { mutate: sendBroadcast, isPending } = useSendBroadcast();
  const { toast } = useToast();

  const handleSend = () => {
    if (!content.trim()) return;
    
    sendBroadcast(content, {
      onSuccess: () => {
        toast({
          title: "Broadcast Sent",
          description: "Your message is being delivered to all active users.",
          className: "bg-emerald-900 border-emerald-800 text-white"
        });
        setContent("");
      },
      onError: (err) => {
        toast({
          title: "Failed to Send",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Radio className="w-8 h-8 text-primary" />
          Broadcast Message
        </h1>
        <p className="text-muted-foreground mt-2">Send announcements, updates, or alerts to all your bot users instantly.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border">
            <label className="block text-sm font-medium text-white mb-2">Message Content</label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-48 bg-background border border-border rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                {content.length} characters
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSend}
                disabled={isPending || !content.trim()}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg",
                  isPending || !content.trim()
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-primary/25 hover:-translate-y-0.5"
                )}
              >
                {isPending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Broadcast
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Pro Tip</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You can use standard HTML tags like &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, and &lt;a href="..."&gt;links&lt;/a&gt; in your message for rich text formatting supported by Telegram.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border">
            <h3 className="font-bold text-white mb-4">Before Sending</h3>
            <ul className="space-y-3">
              {[
                "Check for typos and formatting",
                "Ensure links are valid and working",
                "Keep it concise and clear",
                "Avoid spamming users frequently"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border bg-gradient-to-br from-card to-red-900/10">
            <div className="flex items-center gap-3 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold">Warning</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Broadcasts cannot be undone. Once sent, the message will be delivered to all users who haven't blocked the bot.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
