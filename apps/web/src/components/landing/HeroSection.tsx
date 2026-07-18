"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const DecryptedText = dynamic(
  () => import("@appletosolutions/reactbits").then((mod) => mod.DecryptedText),
  { ssr: false }
);

const Magnet = dynamic(
  () => import("@appletosolutions/reactbits").then((mod) => mod.Magnet),
  { ssr: false }
);

const COLORS = [
  "var(--primary)",
  "hsl(142, 75%, 45%)",
  "hsl(165, 80%, 45%)",
  "hsl(263, 70%, 60%)",
  "hsl(190, 90%, 50%)",
  "hsl(45, 100%, 55%)",
];

const TOPICS = [
  "System Design",
  "Behavioral Mock",
  "Data Structures",
  "Pacing & Tone",
  "Confidence Boost",
  "Resume Review",
  "Mock Interviews",
  "Clarity Check",
  "Filler Words",
  "STAR Method",
  "Instant AI Feedback",
  "Leadership Principles",
  "Coding Challenge",
  "Active Listening",
  "Problem Solving"
];

interface FloatingTag {
  text: string;
  className: string;
  animationClass: string;
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
  const [shuffledTopics, setShuffledTopics] = useState<{ name: string; color: string }[]>([]);

  useEffect(() => {
    const shuffled = [...TOPICS]
      .sort(() => Math.random() - 0.5)
      .map((name) => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return { name, color };
      });
    setShuffledTopics(shuffled);
  }, []);

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
        Irshaad
        <span className="text-primary"> AI</span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 px-4 sm:px-0">
        Your real-time conversational AI Interview Coach. Practice with lifelike AI, get instant feedback, and land your dream job.
      </p>

      {/* Infinite Marquee Strip */}
      <div className="w-screen overflow-hidden mt-2 py-4 border-y border-white/5 bg-white/[0.01] relative left-1/2 -translate-x-1/2">
        <div className="flex animate-marquee w-max">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex gap-12 sm:gap-20 px-6 sm:px-10 items-center">
              {shuffledTopics.map((topic, idx) => (
                <div
                  key={`${copyIndex}-${idx}`}
                  className="text-white/40 whitespace-nowrap font-display font-medium text-lg sm:text-2xl tracking-wide flex items-center gap-3 cursor-default hover:text-white transition-colors duration-300"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full opacity-80 shrink-0"
                    style={{
                      backgroundColor: topic.color,
                      boxShadow: `0 0 14px ${topic.color}`
                    }}
                  />
                  {topic.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
