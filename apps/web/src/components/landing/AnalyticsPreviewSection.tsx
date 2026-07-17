import { BarChart, MessageSquareWarning } from "lucide-react";

export function AnalyticsPreviewSection() {
  return (
    <section id="analytics" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 lg:pr-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
            Actionable Corrections, Not Just Practice
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            The core value of Irshaad AI isn't just the voice practice; it's the post-session dashboard. We grade your answers, track filler words, and provide strict technical corrections so you never make the same mistake twice.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <BarChart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Detailed Grading</h4>
                <p className="text-sm text-muted-foreground">See exactly how you scored on clarity, technical accuracy, and conciseness.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MessageSquareWarning className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Filler Word Tracking</h4>
                <p className="text-sm text-muted-foreground">Review your transcript and identify where you use "um", "like", and "you know" too often.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex-1 w-full max-w-2xl relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0" />
          <div className="relative z-10 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Session Report</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">Score: 85/100</span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Technical Correction</h4>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <p className="text-foreground text-sm line-through opacity-70 mb-2">"React uses a real DOM to update fast."</p>
                  <p className="text-primary text-sm font-bold">Correction: React uses a Virtual DOM to batch updates efficiently.</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Transcript Highlight</h4>
                <p className="text-foreground text-sm leading-relaxed p-4 backdrop-blur-md bg-white/[0.02] rounded-xl border border-white/[0.05]">
                  "...so <span className="text-yellow-500 bg-yellow-500/10 px-1 rounded">um</span> I built the API using <span className="text-yellow-500 bg-yellow-500/10 px-1 rounded">like</span> Node and Express because <span className="text-yellow-500 bg-yellow-500/10 px-1 rounded">you know</span> it's fast..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
