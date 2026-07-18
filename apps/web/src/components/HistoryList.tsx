"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function HistoryList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/session/history`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history.");
      }

      const data = await response.json();
      setSessions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
        <p className="text-slate-400 text-sm">No previous interview sessions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Previous Sessions</h3>
      <div className="space-y-4">
        {sessions.map((session) => {
          const isExpanded = expandedSession === session.id;
          const summary = session.interview_summaries?.[0];
          const hasFeedback = !!summary;
          const date = new Date(session.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={session.id}
              className="backdrop-blur-md bg-white/[0.01] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
            >
              {/* Header Info */}
              <div
                onClick={() => toggleExpand(session.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs text-primary font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {date}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        session.status === "completed"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : session.status === "failed"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : session.status === "disconnected"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                    {session.job_description}
                  </h4>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsible Area */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-white/[0.05] bg-white/[0.005]"
                  >
                    <div className="p-5 space-y-6">
                      {/* Job Description Full */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                          Target Job Description
                        </h5>
                        <p className="text-sm text-slate-300 whitespace-pre-line bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                          {session.job_description}
                        </p>
                      </div>

                      {/* AI Feedback / Summary */}
                      {hasFeedback ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> AI Feedback & Score
                            </h5>
                            <div className="text-sm text-slate-300 bg-green-500/[0.01] border border-green-500/10 p-4 rounded-xl whitespace-pre-wrap font-sans leading-relaxed">
                              {summary.feedback?.summary || (typeof summary.feedback === 'string' ? summary.feedback : "Feedback loading or unavailable.")}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 font-mono flex items-center gap-1">
                              <FileText className="w-4 h-4" /> Transcript / Notes
                            </h5>
                            <div className="text-sm text-slate-300 bg-primary/[0.01] border border-primary/10 p-4 rounded-xl whitespace-pre-wrap font-sans leading-relaxed">
                              {summary.transcript || "Transcript loading or unavailable."}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-sm flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Feedback Pending</p>
                            <p className="text-xs mt-0.5">
                              If you recently completed this session, the AI agent is still compiling your feedback. Please refresh in a moment.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
