import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { CodeEditor } from "@/components/roast/CodeEditor";
import { ResultSection } from "@/components/roast/ResultSection";
import { QuizSection } from "@/components/roast/QuizSection";
import { Language, RoastResponse } from "@/types/roast";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppState = "landing" | "editor" | "loading" | "results" | "quiz";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setAppState("editor");
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCode = async (code: string, language: Language) => {
    setIsLoading(true);
    setAppState("loading");

    try {
      const { data, error } = await supabase.functions.invoke('roast-code', {
        body: { code, language }
      });

      if (error) {
        throw new Error(error.message || 'Failed to roast code');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as RoastResponse);
      setAppState("results");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Roast error:', error);
      toast({
        title: "Roast Failed 🔥",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setAppState("editor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setAppState("quiz");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setResult(null);
    setAppState("editor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setResult(null);
    setAppState("landing");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={handleLogoClick} />
      
      <main className="flex-1">
        {appState === "landing" && (
          <Hero onGetStarted={handleGetStarted} />
        )}

        {(appState === "editor" || appState === "loading") && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Paste Your Code 📝
              </h2>
              <p className="text-muted-foreground">
                Select a language and drop your code below
              </p>
            </div>
            <CodeEditor 
              onSubmit={handleSubmitCode}
              isLoading={isLoading}
            />
          </section>
        )}

        {appState === "results" && result && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Your Roast is Served 🔥
              </h2>
              <p className="text-muted-foreground">
                Scroll through to learn from your mistakes
              </p>
            </div>
            <ResultSection 
              result={result}
              onStartQuiz={handleStartQuiz}
            />
          </section>
        )}

        {appState === "quiz" && result && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Test Your Understanding 🎯
              </h2>
              <p className="text-muted-foreground">
                Prove you've learned from the roast
              </p>
            </div>
            <QuizSection 
              result={result}
              onRetry={handleRetry}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made with 🔥 to help developers learn the hard way
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
