import { Layout } from "@/components/Layout";
import { useTelegramMessages } from "@/hooks/use-telegram";
import { MessageSquare, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { data: messages, isLoading } = useTelegramMessages();

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Message Logs</h1>
        <p className="text-muted-foreground mt-2">Real-time log of all inbound and outbound messages.</p>
      </header>

      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {messages?.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "p-4 hover:bg-muted/30 transition-colors flex items-start gap-4",
                  msg.direction === 'inbound' ? "bg-card" : "bg-card/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                  msg.direction === 'inbound' 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                )}>
                  {msg.direction === 'inbound' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        {msg.direction === 'inbound' ? 'From User' : 'To User'}
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                          ID: {msg.telegramId}
                        </span>
                      </h4>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {msg.createdAt && format(new Date(msg.createdAt), "MMM d, HH:mm:ss")}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {msg.content}
                  </p>
                  
                  {msg.metadata && Object.keys(msg.metadata as object).length > 0 && (
                    <div className="mt-2 text-xs font-mono text-muted-foreground/50 bg-black/20 p-2 rounded border border-white/5 inline-block">
                      JSON: {JSON.stringify(msg.metadata)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(!messages || messages.length === 0) && (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-white">No logs found</h3>
                <p className="text-muted-foreground mt-1">Message activity will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
