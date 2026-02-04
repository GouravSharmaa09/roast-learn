import { Button } from "@/components/ui/button";
import { Flame, Zap, Brain, CheckCircle, Code, Bug, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Fire emoji with animation */}
        <div className="flex justify-center mb-6">
          <div className="text-6xl animate-float">🔥</div>
        </div>

        {/* Main H1 headline - Only ONE H1 on the page */}
        <h1 className="text-mobile-hero md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-foreground">Roast My Code – </span>
          <span className="text-gradient-fire">AI Tool to Roast & Review Your Code</span>
        </h1>

        {/* Subtext with SEO keywords */}
        <p className="text-mobile-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Roast My Code is an <strong>AI-powered code reviewer</strong> that brutally roasts your code in Hinglish and teaches you the right way. 
          Get instant feedback on <strong>JavaScript, Python, C++, Java</strong> code – completely free!
        </p>

        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl" 
          onClick={onGetStarted}
          className="mb-12"
        >
          <Flame className="w-6 h-6" />
          Roast Karo Mera Code 🔥
        </Button>

        {/* 3-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 mb-12">
          <StepCard 
            number={1}
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="Code Paste Kar"
            description="Apna ganda code yahan daal"
          />
          <StepCard 
            number={2}
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="Roast + Fix"
            description="Brutal roast aur sahi code dono milega"
          />
          <StepCard 
            number={3}
            icon={<CheckCircle className="w-6 h-6 text-primary" />}
            title="Test Pass Kar"
            description="Seekha ya nahi, prove kar"
          />
        </div>
      </div>

      {/* SEO Content Section - 400-600 words */}
      <div className="relative z-10 max-w-4xl mx-auto mt-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          Why Developers Love Roast My Code 🚀
        </h2>
        
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 text-left space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              What is Roast My Code?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Roast My Code is a <strong>free AI code review tool</strong> that analyzes your code, finds bugs, and gives you brutally honest feedback in Hinglish. 
              Whether you're a beginner learning to code or an experienced developer looking for a fun way to improve, our AI roaster is here to help you write better code.
              Unlike boring code review tools, we make learning fun with savage roasts that you'll never forget!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bug className="w-5 h-5 text-primary" />
              Find Bugs Before They Find You
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our AI analyzes your code for common mistakes, bad practices, and potential bugs. 
              From missing semicolons to infinite loops, from inefficient algorithms to security vulnerabilities – we catch it all. 
              The best part? You learn <em>why</em> something is wrong and <em>how</em> to fix it, all in a language that actually makes sense to Indian developers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Supported Programming Languages
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Roast My Code supports all major programming languages including <strong>JavaScript</strong>, <strong>Python</strong>, <strong>C++</strong>, and <strong>Java</strong>. 
              Whether you're building web applications, writing algorithms for DSA practice, or preparing for coding interviews, 
              our AI can help you improve your code quality. Just paste your code or upload a screenshot, and get instant feedback!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Learn Coding the Fun Way
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Traditional code reviews are boring. Roast My Code makes learning memorable with humor and desi vibes. 
              After each roast, take our quiz to test what you learned. Track your streak, complete daily challenges, and become a better developer one roast at a time. 
              It's like having a brutally honest friend who's also a programming expert – but free and available 24/7!
            </p>
          </div>
        </div>

        {/* Internal Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Explore Our Code Roasters 🎯
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/roast-javascript-code" 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Roast JavaScript Code</h3>
              <p className="text-sm text-muted-foreground mt-2">Get your JS code brutally reviewed by AI</p>
            </Link>
            
            <Link 
              to="/roast-python-code" 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="text-3xl mb-3">🐍</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Roast Python Code</h3>
              <p className="text-sm text-muted-foreground mt-2">Python bugs ka instant postmortem</p>
            </Link>
            
            <Link 
              to="/ai-code-review" 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">AI Code Review Tool</h3>
              <p className="text-sm text-muted-foreground mt-2">All languages, one brutal AI reviewer</p>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Features That Make Us Different ✨
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureCard emoji="📸" title="Screenshot Upload" description="Photo se code extract" />
            <FeatureCard emoji="🎯" title="Quiz Mode" description="Test your learning" />
            <FeatureCard emoji="🔥" title="Daily Challenges" description="Roz naya challenge" />
            <FeatureCard emoji="📊" title="Streak Tracking" description="Consistency build karo" />
            <FeatureCard emoji="💡" title="Golden Rules" description="Best practices seekho" />
            <FeatureCard emoji="🌐" title="Hinglish Roasts" description="Desi style feedback" />
            <FeatureCard emoji="⚡" title="Instant Analysis" description="Seconds mein result" />
            <FeatureCard emoji="💰" title="100% Free" description="No signup required" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-12 animate-bounce opacity-50">
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

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4 text-center hover:border-primary/30 transition-colors">
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="font-medium text-foreground text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
