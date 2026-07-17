"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useRemoteParticipants,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, AlertCircle, Sparkles, Volume2, ShieldAlert } from "lucide-react";

function ActiveInterviewContent({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const connectionState = useConnectionState();
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  // Toggle microphone muting
  const toggleMute = async () => {
    if (localParticipant) {
      const enabled = !isMuted;
      await localParticipant.setMicrophoneEnabled(enabled);
      setIsMuted(!enabled);
    }
  };

  // Check if the agent (remote participant) is speaking
  const isAgentSpeaking = remoteParticipants.some((p) => p.isSpeaking);

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (
      connectionState === ConnectionState.Connecting ||
      connectionState === ConnectionState.Connected
    ) {
      setHasStarted(true);
    }
  }, [connectionState]);

  // If disconnected after starting, redirect back to dashboard
  useEffect(() => {
    if (hasStarted && connectionState === ConnectionState.Disconnected) {
      router.push("/dashboard");
    }
  }, [connectionState, hasStarted, router]);

  return (
    <div className="z-10 max-w-4xl w-full flex flex-col items-center justify-between min-h-[80vh] py-12 px-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs text-indigo-400 font-mono tracking-widest uppercase mb-2 block">
          Session Active
        </span>
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> Mock Interview Coach
        </h1>
      </div>

      {/* Main Visual Feedback Area */}
      <div className="flex flex-col items-center justify-center my-12">
        <div className="relative flex items-center justify-center">
          {/* Pulsing visualizer rings */}
          {connectionState === ConnectionState.Connected && (
            <>
              <motion.div
                animate={{
                  scale: isAgentSpeaking ? [1, 1.4, 1] : [1, 1.1, 1],
                  opacity: isAgentSpeaking ? [0.15, 0.4, 0.15] : [0.08, 0.15, 0.08],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isAgentSpeaking ? 1.5 : 3,
                  ease: "easeInOut",
                }}
                className="absolute w-64 h-64 rounded-full bg-indigo-500/20 blur-md"
              />
              <motion.div
                animate={{
                  scale: isAgentSpeaking ? [1, 1.7, 1] : [1, 1.2, 1],
                  opacity: isAgentSpeaking ? [0.1, 0.3, 0.1] : [0.05, 0.1, 0.05],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isAgentSpeaking ? 1.8 : 3.5,
                  ease: "easeInOut",
                }}
                className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-lg"
              />
            </>
          )}

          {/* Central Glassmorphic Coach Orb */}
          <div
            className={`w-44 h-44 rounded-full backdrop-blur-2xl bg-white/[0.03] border flex flex-col items-center justify-center shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-all duration-500 ${
              isAgentSpeaking
                ? "border-indigo-400/50 scale-105 bg-indigo-500/5"
                : "border-white/10"
            }`}
          >
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-3 animate-pulse">
              <Volume2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-slate-400">
              {connectionState === ConnectionState.Connecting
                ? "Connecting..."
                : isAgentSpeaking
                ? "Coach Speaking"
                : "Listening to you"}
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] p-6 rounded-3xl shadow-xl flex flex-col items-center gap-6">
        {/* Status Text */}
        <div className="text-center text-sm">
          {connectionState === ConnectionState.Connecting && (
            <p className="text-slate-400 font-mono animate-pulse">Connecting to the room...</p>
          )}
          {connectionState === ConnectionState.Connected && (
            <p className="text-indigo-400 font-mono">Connected & Ready</p>
          )}
          {connectionState === ConnectionState.Reconnecting && (
            <p className="text-amber-400 font-mono animate-pulse flex items-center gap-1.5 justify-center">
              <ShieldAlert className="w-4 h-4" /> Reconnecting...
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            disabled={connectionState !== ConnectionState.Connected}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
              isMuted
                ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                : "bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Disconnect / End Interview Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-500 border border-red-600/30 hover:border-red-500/40 text-white flex items-center justify-center shadow-lg shadow-red-600/20 transition-all duration-300"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-[#030304] text-white">
        <div className="p-6 max-w-sm text-center backdrop-blur-md bg-white/[0.02] border border-white/[0.08] rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Invalid Interview Session</h2>
          <p className="text-sm text-slate-400 mb-6">
            We couldn&apos;t load the interview details. Please return to the dashboard and try again.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#030304] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-950/30 to-purple-950/0 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-purple-950/20 to-indigo-950/0 blur-[120px] pointer-events-none" />

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
