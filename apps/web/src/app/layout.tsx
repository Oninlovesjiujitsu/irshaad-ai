import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist } from "next/font/google";
import MeshBackground from "@/components/MeshBackground";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"]
});

export const metadata: Metadata = {
  title: "Irshaad AI - Interview Coach",
  description: "AI-powered interview coaching with premium glassmorphism design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${geist.variable} ${displayFont.variable} font-sans min-h-screen bg-background relative text-foreground`}>
        {/* Reusable Grainy Mesh Gradient */}
        <MeshBackground />

        {/* Main Content wrapper */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
