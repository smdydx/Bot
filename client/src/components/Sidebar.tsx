import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, MessageSquare, Radio, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/broadcast", label: "Broadcast", icon: Radio },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      {/* Brand */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-none tracking-tight text-white">TrustPivot</h1>
            <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-inner"
                    : "text-muted-foreground hover:bg-muted hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                  )}
                />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border/50 bg-card/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-background border border-border/50 mb-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback>{user?.firstName?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "Admin"}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
