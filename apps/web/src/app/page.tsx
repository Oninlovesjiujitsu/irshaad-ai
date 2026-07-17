import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeatureGridSection } from "@/components/landing/FeatureGridSection";
import { AnalyticsPreviewSection } from "@/components/landing/AnalyticsPreviewSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-hidden">
      <HeroSection />
      <HowItWorksSection />
      <FeatureGridSection />
      <AnalyticsPreviewSection />
    </main>
  );
}
