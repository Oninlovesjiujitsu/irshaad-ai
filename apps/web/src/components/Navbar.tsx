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
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center border border-white/10">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Irshaad AI
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-slate-300">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[150px] truncate font-mono">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
