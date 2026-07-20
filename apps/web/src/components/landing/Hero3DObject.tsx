"use client";

import { useState, useEffect, useRef } from "react";

export default function Hero3DObject() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center cursor-crosshair transition-transform duration-200 ease-out"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
      }}
    >
      {/* Background glow matching the original */}
      <div className="absolute inset-0 bg-[#22c55e]/20 blur-[60px] z-0 rounded-full scale-75 animate-pulse" style={{ animationDuration: '3s' }} />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Outer rotating dashed ring (simulating wireframe shell) */}
        <div className="absolute inset-2 rounded-full border-[3px] border-[#a3ff00]/40 border-dashed animate-[spin_15s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border-2 border-[#a3ff00]/20 animate-[spin_20s_linear_infinite_reverse]" />

        {/* Inner solid glowing core */}
        <div className="relative w-3/5 h-3/5 rounded-full bg-gradient-to-br from-[#a3ff00] to-[#14532d] shadow-[0_0_50px_rgba(34,197,94,0.5),inset_0_0_20px_rgba(255,255,255,0.4)] animate-[pulse_2s_ease-in-out_infinite]">
            {/* Core highlight for 3D feel */}
            <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] bg-white/60 rounded-full blur-[8px]" />
        </div>
      </div>
    </div>
  );
}
