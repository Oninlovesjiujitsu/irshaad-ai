import { Zap, Mic2, PauseCircle } from "lucide-react";

export function FeatureGridSection() {
  return (
    <section className="py-20 px-6 bg-card/30 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Outcome-Driven Capabilities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We focus on real-world benefits. No robotic delays, just fluid conversation.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
            <Zap className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Zero-Latency Flow</h3>
            <p className="text-muted-foreground">
              Experience ultra-low latency voice responses. Our optimized backend ensures the AI reacts instantly, simulating the pacing of a real human interview perfectly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
            <PauseCircle className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Natural Interruptions</h3>
            <p className="text-muted-foreground">
              Powered by advanced Silero VAD integration, the AI gracefully stops talking the moment you naturally interrupt to clarify a point—just like a real recruiter would.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors md:col-span-2 lg:col-span-1">
            <Mic2 className="w-10 h-10 text-primary mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Lifelike Voice Quality</h3>
            <p className="text-muted-foreground">
              Forget robotic TTS. Our voice models are highly expressive and realistic, allowing you to practice tone and emotional delivery dynamically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
