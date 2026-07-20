"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, FileText, AlertCircle } from "lucide-react";

export default function SessionReport({ session }: { session: any }) {
  // session may already have interview_summaries from the initial history fetch
  const initialSummary = session.interview_summaries?.[0];
  
  const [summary, setSummary] = useState<any>(initialSummary || null);
  const [isPolling, setIsPolling] = useState(!initialSummary);

  useEffect(() => {
    // If we already have the summary, no need to poll
    if (summary) {
      setIsPolling(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchFeedback = async () => {
      try {
        console.log("Polling feedback for session:", session.id);
        const { data: { session: authSession } } = await supabase.auth.getSession();
        if (!authSession) {
          console.log("No auth session found!");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/session/${session.id}/feedback`, {
          headers: {
            Authorization: `Bearer ${authSession.access_token}`,
          },
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Feedback fetched successfully:", data);
          setSummary(data);
          setIsPolling(false);
          clearInterval(intervalId);
        } else {
          console.log("Response not OK. Status:", response.status);
          const errText = await response.text();
          console.log("Error text:", errText);
        }
      } catch (err) {
        console.error("Error polling for feedback:", err);
      }
    };

    // Initial check
    fetchFeedback();

    // Poll every 3 seconds if not found
    intervalId = setInterval(fetchFeedback, 3000);

    return () => clearInterval(intervalId);
  }, [session.id, summary]);

  const hasFeedback = !!summary;

  return (
    <div className="grid grid-cols-1 gap-6">
      {hasFeedback ? (
        <>
          {/* New Structured Session Report UI */}
          {typeof summary.feedback === 'object' && summary.feedback !== null && 'score' in summary.feedback ? (
            <div className="relative z-10 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Session Report
                </h3>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">
                  Score: {summary.feedback.score}/100
                </span>
              </div>

              <div className="space-y-6">
                {summary.feedback.overall_impression && (
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Overall Impression</h4>
                    <p className="text-foreground text-sm leading-relaxed p-4 backdrop-blur-md bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      {summary.feedback.overall_impression}
                    </p>
                  </div>
                )}

                {summary.feedback.technical_corrections && summary.feedback.technical_corrections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Technical Corrections</h4>
                    <div className="space-y-3">
                      {summary.feedback.technical_corrections.map((tc: any, i: number) => (
                        <div key={i} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                          <p className="text-foreground text-sm line-through opacity-70 mb-2">"{tc.original}"</p>
                          <p className="text-primary text-sm font-bold">Correction: {tc.correction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {summary.feedback.transcript_highlights && summary.feedback.transcript_highlights.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Transcript Highlights</h4>
                    <div className="space-y-3">
                      {summary.feedback.transcript_highlights.map((th: any, i: number) => {
                        // Simple highlight logic: wrap filler words in span
                        let text = th.text;
                        if (th.filler_words && Array.isArray(th.filler_words)) {
                          th.filler_words.forEach((word: string) => {
                            const regex = new RegExp(`\\b${word}\\b`, 'gi');
                            text = text.replace(regex, `<span class="text-yellow-500 bg-yellow-500/10 px-1 rounded">$&</span>`);
                          });
                        }
                        return (
                          <p 
                            key={i} 
                            className="text-foreground text-sm leading-relaxed p-4 backdrop-blur-md bg-white/[0.02] rounded-xl border border-white/[0.05]"
                            dangerouslySetInnerHTML={{ __html: `"...${text}..."` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {summary.feedback.recommended_next_steps && summary.feedback.recommended_next_steps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommended Next Steps</h4>
                    <ul className="list-disc list-inside text-foreground text-sm space-y-2 p-4 backdrop-blur-md bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      {summary.feedback.recommended_next_steps.map((step: string, i: number) => (
                        <li key={i} className="text-slate-300">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Legacy Fallback UI */
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
          )}
        </>
      ) : (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold flex items-center gap-2">
              Feedback Pending 
              {isPolling && <span className="animate-pulse w-2 h-2 bg-amber-400 rounded-full inline-block" />}
            </p>
            <p className="text-xs mt-0.5">
              The AI agent is currently analyzing your session and compiling your feedback. This typically takes 10-20 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
