import React from "react";

export default function MeshBackground() {
  return (
    <>
      {/* 1. Blurred Blobs Container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background">
        {/* Blob 1: Lime Green (top-left) */}
        <div className="mesh-blob absolute top-[-15%] left-[-10%] w-[65vw] sm:w-[50vw] h-[65vw] sm:h-[50vw] rounded-full bg-[hsl(85,100%,55%)]/15 blur-[120px] mix-blend-screen animate-mesh-1" />

        {/* Blob 2: Emerald Green (bottom-right) */}
        <div className="mesh-blob absolute bottom-[-10%] right-[-10%] w-[60vw] sm:w-[45vw] h-[60vw] sm:h-[45vw] rounded-full bg-[hsl(142,75%,45%)]/20 blur-[140px] mix-blend-screen animate-mesh-2" />

        {/* Blob 3: Mint Green (center-right) */}
        <div className="mesh-blob absolute top-[25%] left-[25%] w-[55vw] sm:w-[40vw] h-[55vw] sm:h-[40vw] rounded-full bg-[hsl(165,80%,40%)]/15 blur-[100px] mix-blend-screen animate-mesh-3" />

        {/* Blob 4: Violet/Indigo (bottom-left) */}
        <div className="mesh-blob absolute bottom-[10%] left-[-5%] w-[50vw] sm:w-[35vw] h-[50vw] sm:h-[35vw] rounded-full bg-[hsl(263,70%,50%)]/12 blur-[120px] mix-blend-screen animate-mesh-1" />
      </div>

      {/* 2. Noise Overlay */}
      <div className="noise-overlay" />
    </>
  );
}
