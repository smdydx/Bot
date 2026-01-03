import { Shield } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">TrustPivot</h1>
          <p className="text-muted-foreground mb-8">
            Secure Admin Dashboard Access
          </p>

          <button
            onClick={handleLogin}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            Log in with Replit
          </button>
          
          <p className="mt-6 text-xs text-muted-foreground/60">
            Authorized personnel only. All access is logged.
          </p>
        </div>
      </div>
    </div>
  );
}
