import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MeshBackground from "@/components/MeshBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background relative text-foreground`}>
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
