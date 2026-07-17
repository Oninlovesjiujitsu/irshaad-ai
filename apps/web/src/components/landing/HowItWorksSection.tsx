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
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A seamless pipeline designed to get you ready for the real thing in three simple steps.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
