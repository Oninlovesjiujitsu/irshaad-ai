"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useConnectionState,
  useRemoteParticipants,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Sparkles, Volume2, ShieldAlert } from "lucide-react";

export function ActiveInterviewContent({ sessionId }: { sessionId: string }) {
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
        <span className="text-xs text-primary font-mono tracking-widest uppercase mb-2 block">
          Session Active
        </span>
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Mock Interview Coach
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
                className="absolute w-64 h-64 rounded-full bg-primary/20 blur-md"
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
                className="absolute w-80 h-80 rounded-full bg-accent/10 blur-lg"
              />
            </>
          )}

          {/* Central Glassmorphic Coach Orb */}
          <div
            className={`w-44 h-44 rounded-full backdrop-blur-2xl bg-white/[0.03] border flex flex-col items-center justify-center transition-all duration-500 ${
              isAgentSpeaking
                ? "border-primary/50 scale-105 bg-primary/5 shadow-glow"
                : "border-border shadow-lg"
            }`}
          >
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-3 animate-pulse">
              <Volume2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
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
      <div className="w-full max-w-md backdrop-blur-xl bg-card border border-border p-6 rounded-3xl shadow-xl flex flex-col items-center gap-6">
        {/* Status Text */}
        <div className="text-center text-sm">
          {connectionState === ConnectionState.Connecting && (
            <p className="text-muted-foreground font-mono animate-pulse">Connecting to the room...</p>
          )}
          {connectionState === ConnectionState.Connected && (
            <p className="text-primary font-mono">Connected & Ready</p>
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
