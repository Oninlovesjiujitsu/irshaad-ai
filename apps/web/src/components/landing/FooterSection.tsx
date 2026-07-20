'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#051109]/30 backdrop-blur-md py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-white">
              Irshaad <span className="text-primary">AI</span>
            </span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>

        {/* Builder Credit Link */}
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Designed & Built by
          </span>
          <a
            href="https://onin-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-300 shadow-sm"
          >
            <span className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-primary transition-colors duration-300">
              Niño Olvis
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            
            {/* Subtle glow border effect on hover */}
            <span className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 group-hover:shadow-[0_0_12px_rgba(135,255,0,0.15)] transition-all duration-300 pointer-events-none" />
          </a>
        </div>
      </div>
    </footer>
  );
}
