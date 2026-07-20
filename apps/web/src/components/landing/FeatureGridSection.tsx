import { Zap, Mic2, PauseCircle, Github } from "lucide-react";

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
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Hybrid Cloud & Local</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Deployed to the cloud for accessibility, but built for performance. To bypass free-tier CPU limits and achieve true zero-latency, seamlessly run the agent worker on your local machine.
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

        {/* Local Deployment CTA Banner */}
        <div className="mt-16 bg-white/[0.02] border border-primary/20 p-6 sm:p-8 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <h4 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Want true zero-latency?
            </h4>
            <p className="text-sm text-muted-foreground">
              Due to cloud free-tier CPU limits, the deployed agent may experience cold-start delays. For lightning-fast responses, clone the repo and run the <code className="text-primary font-mono bg-white/[0.05] px-1.5 py-0.5 rounded">agent-worker</code> locally!
            </p>
          </div>
          <a 
            href="https://github.com/Oninlovesjiujitsu/irshaad-ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="shrink-0 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
