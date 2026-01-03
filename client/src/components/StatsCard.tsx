import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ label, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors blur-xl" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-3xl font-display font-bold text-white mt-2">{value}</h3>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              <span>{trendUp ? '↑' : '↓'} {trend}</span>
              <span className="text-muted-foreground/60 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className="w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
}
