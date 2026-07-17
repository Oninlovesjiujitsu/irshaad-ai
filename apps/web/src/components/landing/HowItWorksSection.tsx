import { FileText, Headphones, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "1. Upload Resume & JD",
      description: "Upload your PDF Resume and the target Job Description to give the AI context."
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary" />,
      title: "2. Live Mock Interview",
      description: "Join the LiveKit Audio Room for a real-time mock interview with ultra-low latency."
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "3. Instant Feedback",
      description: "Receive an instant Markdown feedback report highlighting your strengths and areas for improvement."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 px-4">How It Works</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">A seamless pipeline designed to get you ready for the real thing in three simple steps.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all duration-300 cursor-pointer active:scale-[0.98]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 border border-primary/20">
              {step.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{step.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
