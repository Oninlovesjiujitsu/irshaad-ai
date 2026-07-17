"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, Mic, User } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="w-full backdrop-blur-md bg-white/[0.02] border-b border-white/[0.08] sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/dashboard")}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(133,255,0,0.15)] group-hover:shadow-[0_0_25px_rgba(133,255,0,0.25)] transition-all duration-300">
          <Mic className="w-5 h-5 text-black font-bold" />
        </div>
        <span className="relative text-xl font-extrabold z-10 tracking-tight text-white">
          Irshaad <span className="text-primary">AI</span>
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/[0.02] border border-white/[0.08] text-sm text-foreground">
            <User className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline-block max-w-[150px] truncate font-mono">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
