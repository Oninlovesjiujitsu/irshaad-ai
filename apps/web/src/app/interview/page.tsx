"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { AlertCircle } from "lucide-react";
import { ActiveInterviewContent } from "@/components/interview/ActiveInterviewContent";

export default function InterviewRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const serverUrl = searchParams.get("serverUrl");
  const sessionId = searchParams.get("sessionId");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  if (!authorized || !token || !serverUrl || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="p-6 max-w-sm text-center backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Invalid Interview Session</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't load the interview details. Please return to the dashboard and try again.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-primary hover:shadow-glow text-primary-foreground rounded-xl text-sm font-medium transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        connectOptions={{ autoSubscribe: true }}
      >
        <ActiveInterviewContent sessionId={sessionId} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </main>
  );
}
