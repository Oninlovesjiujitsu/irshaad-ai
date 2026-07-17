import { Zap, Mic2, PauseCircle } from "lucide-react";

export function FeatureGridSection() {
  return (
    <section id="features" className="py-24 px-6 backdrop-blur-md bg-white/[0.01] border-y border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 px-4">Outcome-Driven Capabilities</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">We focus on real-world benefits. No robotic delays, just fluid conversation.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98]">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Zero-Latency Flow</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Experience ultra-low latency voice responses. Our optimized backend ensures the AI reacts instantly, simulating the pacing of a real human interview perfectly.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98]">
            <PauseCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Natural Interruptions</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Powered by advanced Silero VAD integration, the AI gracefully stops talking the moment you naturally interrupt to clarify a point—just like a real recruiter would.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98] md:col-span-2 lg:col-span-1">
            <Mic2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Lifelike Voice Quality</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Forget robotic TTS. Our voice models are highly expressive and realistic, allowing you to practice tone and emotional delivery dynamically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
