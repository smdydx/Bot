import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { useStats, useTelegramMessages } from "@/hooks/use-telegram";
import { Users, Activity, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();
  const { data: messages } = useTelegramMessages();

  // Mock data for the chart since we don't have historical stats API yet
  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 480 },
    { name: 'Fri', value: 700 },
    { name: 'Sat', value: 650 },
    { name: 'Sun', value: 800 },
  ];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening with your bot today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          label="Total Users"
          value={isLoading ? "..." : stats?.totalUsers || 0}
          icon={Users}
          trend="12%"
          trendUp={true}
        />
        <StatsCard
          label="Active Users"
          value={isLoading ? "..." : stats?.activeUsers || 0}
          icon={Activity}
          trend="5%"
          trendUp={true}
        />
        <StatsCard
          label="Total Messages"
          value={isLoading ? "..." : stats?.totalMessages || 0}
          icon={MessageSquare}
          trend="8%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Activity Trend
            </h3>
            <select className="bg-background border border-border rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-primary text-muted-foreground">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages Feed */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Live Logs</h3>
            <Link href="/messages" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {messages?.slice(0, 6).map((msg) => (
              <div key={msg.id} className="p-3 rounded-xl bg-background/50 border border-border/50 text-sm hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    msg.direction === 'inbound' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {msg.direction}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {msg.createdAt && format(new Date(msg.createdAt), 'HH:mm')}
                  </span>
                </div>
                <p className="text-muted-foreground truncate">{msg.content}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">User: {msg.telegramId}</p>
              </div>
            ))}
            
            {(!messages || messages.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                No recent messages
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
