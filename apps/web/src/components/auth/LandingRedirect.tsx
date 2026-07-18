"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BrainCircuit } from "lucide-react";

export default function LandingRedirect() {
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check if a Supabase auth token is present in localStorage to avoid flashes for guests
    const hasSessionKey = Object.keys(localStorage).some(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token")
    );

    if (hasSessionKey) {
      setShouldRedirect(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push("/dashboard");
        } else {
          setShouldRedirect(false);
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setShouldRedirect(true);
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (shouldRedirect) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center text-foreground bg-[#051109]">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground font-mono text-sm">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
