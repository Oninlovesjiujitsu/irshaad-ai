import NavBar from "@/components/landing/NavBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeatureGridSection } from "@/components/landing/FeatureGridSection";
import { AnalyticsPreviewSection } from "@/components/landing/AnalyticsPreviewSection";
import FooterSection from "@/components/landing/FooterSection";
import FloatBackToTheTop from "@/components/landing/FloatBackToTheTop";
import LandingRedirect from "@/components/auth/LandingRedirect";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-hidden">
      <LandingRedirect />
      <NavBar />
      <HeroSection />
      <HowItWorksSection />
      <FeatureGridSection />
      <AnalyticsPreviewSection />
      <FooterSection />
      <FloatBackToTheTop />
    </main>
  );
}
