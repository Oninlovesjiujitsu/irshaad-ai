"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, ViewType } from "@supabase/auth-ui-shared";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Sparkles, BrainCircuit, Mic } from "lucide-react";

interface AuthWidgetProps {
  view: ViewType;
  title: string;
}

export function AuthWidget({ view, title }: AuthWidgetProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      if (session) {
        router.push("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-muted-foreground font-mono text-sm">Loading Irshaad AI...</p>
      </div>
    );
  }

  return (
    <div className="z-10 w-full max-w-md flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-8 text-center"
      >
        <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 border border-border">
          <Mic className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 font-sans bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
          Irshaad AI
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="w-full backdrop-blur-xl bg-card/80 border border-border p-8 rounded-3xl shadow-lg"
      >
        <h2 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> {title}
        </h2>

        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(85, 100%, 50%)',
                  brandAccent: 'hsl(85, 100%, 40%)',
                  inputBackground: 'hsl(140, 40%, 8%)',
                  inputBorder: 'hsl(140, 60%, 70%)',
                  inputText: 'hsl(0, 0%, 100%)',
                  inputPlaceholder: 'hsl(140, 20%, 70%)',
                },
                radii: {
                  buttonBorderRadius: '12px',
                  inputBorderRadius: '12px',
                }
              }
            }
          }}
          redirectTo={typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined}
          providers={["google"]}
          theme="dark"
        />
      </motion.div>
    </div>
  );
}
