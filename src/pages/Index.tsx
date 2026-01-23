import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { CodeEditor } from "@/components/roast/CodeEditor";
import { ResultSection } from "@/components/roast/ResultSection";
import { QuizSection } from "@/components/roast/QuizSection";
import { SplashScreen } from "@/components/SplashScreen";
import { Language, RoastResponse } from "@/types/roast";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AppState = "splash" | "landing" | "editor" | "loading" | "results" | "quiz";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if splash was already shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splash_shown");
    if (splashShown) {
      setAppState("landing");
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setAppState("landing");
  };

  const handleGetStarted = () => {
    setAppState("editor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCode = async (code: string, language: Language) => {
    setIsLoading(true);
    setAppState("loading");
    setOriginalCode(code);
    setSelectedLanguage(language);

    try {
      const { data, error } = await supabase.functions.invoke('roast-code', {
        body: { code, language }
      });

      if (error) {
        throw new Error(error.message || 'Code roast nahi ho paya');
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
        title: "Roast Fail Ho Gaya 🔥",
        description: error instanceof Error ? error.message : "Kuch gadbad ho gayi. Dobara try kar bhai.",
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
    setOriginalCode("");
    setAppState("editor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setResult(null);
    setOriginalCode("");
    setAppState("landing");
    navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Splash Screen */}
      {appState === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      <Header onLogoClick={handleLogoClick} />
      
      <main className="flex-1">
        {appState === "landing" && (
          <Hero onGetStarted={handleGetStarted} />
        )}

        {(appState === "editor" || appState === "loading") && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Apna Code Daal 📝
              </h2>
              <p className="text-muted-foreground">
                Language select kar aur himmat hai toh code paste kar
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
                Tera Roast Ready Hai 🔥
              </h2>
              <p className="text-muted-foreground">
                Scroll kar aur apni galtiyon se seekh le
              </p>
            </div>
            <ResultSection 
              result={result}
              originalCode={originalCode}
              language={selectedLanguage}
              onStartQuiz={handleStartQuiz}
            />
          </section>
        )}

        {appState === "quiz" && result && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Ab Prove Kar 🎯
              </h2>
              <p className="text-muted-foreground">
                Seekha ya nahi, ye test batayega
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
            🔥 Developers ko unki aukaat dikhane ke liye banaya gaya
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
