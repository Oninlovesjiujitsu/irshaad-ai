"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';

const DecryptedText = dynamic(
  () => import("@appletosolutions/reactbits").then((mod) => mod.DecryptedText),
  { ssr: false }
);

const Magnet = dynamic(
  () => import("@appletosolutions/reactbits").then((mod) => mod.Magnet),
  { ssr: false }
);

interface FloatingTag {
  text: string;
  className: string; // Positioning coordinates
  animationClass: string; // CSS float loop speed/tilt class
}

const Hero3DObject = dynamic(() => import('./Hero3DObject'), {
  ssr: false
});

const FLOATING_TAGS: FloatingTag[] = [
  { text: "Tone", className: "-top-2 -left-2 sm:-left-8 md:-left-16", animationClass: "animate-float-1" },
  { text: "Pacing", className: "top-12 -right-2 sm:-right-8 md:-right-16", animationClass: "animate-float-2" },
  { text: "Clarity", className: "bottom-12 -left-6 sm:-left-12 md:-left-20", animationClass: "animate-float-3" },
  { text: "Structure", className: "bottom-0 -right-6 sm:-right-12 md:-right-24", animationClass: "animate-float-1" },
  { text: "Confidence", className: "-bottom-6 left-8 sm:left-12 md:left-4", animationClass: "animate-float-2" },
  { text: "Filler Words", className: "top-0 right-10 sm:right-16 md:right-32", animationClass: "animate-float-3" },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-x-clip">
      {/* 3D Core with Interactive Floating Tags */}
      <div className="w-48 h-48 md:w-64 md:h-64 mb-6 relative">
        <Hero3DObject />

        {FLOATING_TAGS.map((tag, idx) => (
          <div
            key={idx}
            className={`absolute z-20 ${tag.className} ${tag.animationClass}`}
          >
            <Magnet magnetStrength={0.15} padding={50}>
              <div className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md bg-white/[0.02] border border-white/[0.08] text-primary whitespace-nowrap cursor-default shadow-sm select-none transition-colors duration-300 hover:border-primary/30">
                {tag.text}
              </div>
            </Magnet>
          </div>
        ))}
      </div>

      {/* Cipher Decrypting Title */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 mb-6 font-display">
        <DecryptedText text="Irshaad AI" animateOn="view" />
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 px-4 sm:px-0">
        Your real-time conversational AI Interview Coach. Practice with lifelike AI, get instant feedback, and land your dream job.
      </p>

      <div className="flex flex-row gap-3 w-full max-w-sm sm:max-w-none mx-auto justify-center items-center px-4 sm:px-0">
        <Link
          href="/sign-up"
          className="flex-1 sm:flex-none bg-primary text-primary-foreground px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-glow transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          <span className="hidden sm:inline">Start Practicing</span>
          <span className="sm:hidden">Practice</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <Link
          href="/login"
          className="flex-1 sm:flex-none backdrop-blur-xl bg-white/[0.02] text-foreground border border-white/[0.08] px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/[0.05] transition-all flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
