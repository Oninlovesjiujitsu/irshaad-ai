"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import HistoryList from "@/components/HistoryList";
import { BrainCircuit } from "lucide-react";

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSessionCreated = (sessionData: {
    sessionId: string;
    token: string;
    roomName: string;
    serverUrl: string;
  }) => {
    // Navigate to the interview page passing the token and serverUrl as query params
    const queryParams = new URLSearchParams({
      token: sessionData.token,
      serverUrl: sessionData.serverUrl,
      sessionId: sessionData.sessionId,
    }).toString();

    router.push(`/interview?${queryParams}`);
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030304] text-white">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-indigo-500 animate-pulse" />
          <p className="text-gray-400 font-mono text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#030304] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-900/20 to-pink-900/0 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-purple-900/20 to-indigo-900/0 blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Widget */}
        <div className="lg:col-span-5 w-full">
          <ResumeUpload onSessionCreated={handleSessionCreated} />
        </div>

        {/* Right Side: Interview History & Feedback */}
        <div className="lg:col-span-7 w-full">
          <HistoryList />
        </div>
      </div>
    </main>
  );
}
