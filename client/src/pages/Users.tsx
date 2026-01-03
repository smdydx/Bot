import { Layout } from "@/components/Layout";
import { useTelegramUsers } from "@/hooks/use-telegram";
import { Search, Loader2, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Users() {
  const { data: users, isLoading } = useTelegramUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(search.toLowerCase()) || 
    user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    user.telegramId.includes(search)
  );

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-muted-foreground mt-2">Manage and view your Telegram bot subscribers.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telegram ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Active</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-primary/10 border border-primary/20">
                          <AvatarFallback className="text-primary text-xs">
                            {user.firstName?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username || "No Username"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground font-mono">
                      {user.telegramId}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        user.isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {user.lastActiveAt ? format(new Date(user.lastActiveAt), "MMM d, yyyy") : "Never"}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {user.joinedAt ? format(new Date(user.joinedAt), "MMM d, yyyy") : "-"}
                    </td>
                  </tr>
                ))}
                
                {filteredUsers?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
