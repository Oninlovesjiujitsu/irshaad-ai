import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_4px_rgba(163,255,0,0.3)] border border-border">
        <Mic className="w-10 h-10 text-primary-foreground" />
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 font-sans">
        Master the Interview with <span className="text-primary">Irshaad AI</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
        Your real-time conversational AI Interview Coach. Practice with lifelike AI, get instant feedback, and land your dream job.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/sign-up" 
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:shadow-glow transition-all flex items-center justify-center gap-2"
        >
          Start Practicing <ArrowRight className="w-5 h-5" />
        </Link>
        <Link 
          href="/login" 
          className="bg-card/50 text-foreground border border-border px-8 py-4 rounded-xl font-bold hover:bg-card transition-all flex items-center justify-center"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
