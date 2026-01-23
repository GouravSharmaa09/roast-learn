import { Button } from "@/components/ui/button";
import { Flame, Zap, Brain, CheckCircle } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Fire emoji with animation */}
        <div className="flex justify-center mb-6">
          <div className="text-6xl animate-float">🔥</div>
        </div>

        {/* Main headline */}
        <h1 className="text-mobile-hero md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-foreground">Roast Your Code.</span>
          <br />
          <span className="text-gradient-fire">Learn It. Never Repeat.</span>
        </h1>

        {/* Subtext */}
        <p className="text-mobile-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
          Get your code roasted by AI, learn from your mistakes with deep explanations, 
          and prove you've learned with a quick test.
        </p>

        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl" 
          onClick={onGetStarted}
          className="mb-12"
        >
          <Flame className="w-6 h-6" />
          Roast My Code
        </Button>

        {/* 3-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
          <StepCard 
            number={1}
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="Paste Code"
            description="Drop in your buggy code"
          />
          <StepCard 
            number={2}
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="Get Roasted & Fixed"
            description="Learn why it's wrong & how to fix it"
          />
          <StepCard 
            number={3}
            icon={<CheckCircle className="w-6 h-6 text-primary" />}
            title="Pass the Test"
            description="Prove you've mastered it"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function StepCard({ number, icon, title, description }: StepCardProps) {
  return (
    <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: `${number * 0.1}s` }}>
      {/* Step number badge */}
      <div className="absolute -top-3 left-4 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
