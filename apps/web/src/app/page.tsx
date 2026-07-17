"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Sparkles, BrainCircuit, Mic } from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        router.push("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-indigo-500 animate-pulse" />
          <p className="text-gray-400 font-mono text-sm">Loading Irshaad AI...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#030304] overflow-hidden">
      {/* Background Animated Blobs for Glassmorphism depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-800/0 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-pink-600/20 to-indigo-800/0 blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-8 text-center"
        >
          <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 font-sans bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Irshaad AI
          </h1>
          <p className="text-sm text-slate-400 max-w-xs">
            Your real-time conversational AI Interview Coach. Practice, refine, and succeed.
          </p>
        </motion.div>

        {/* Authentication Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
        >
          <h2 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Start Practicing
          </h2>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6366f1',
                    brandAccent: '#4f46e5',
                    inputBackground: 'rgba(255, 255, 255, 0.03)',
                    inputBorder: 'rgba(255, 255, 255, 0.08)',
                    inputText: 'white',
                    inputPlaceholder: '#94a3b8',
                  },
                  radii: {
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  }
                }
              }
            }}
            providers={["google"]}
            theme="dark"
          />
        </motion.div>
      </div>
    </main>
  );
}
