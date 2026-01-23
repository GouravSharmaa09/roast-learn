import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { CodeEditor } from "@/components/roast/CodeEditor";
import { ResultSection } from "@/components/roast/ResultSection";
import { QuizSection } from "@/components/roast/QuizSection";
import { SplashScreen } from "@/components/SplashScreen";
import { RoastHistory } from "@/components/roast/RoastHistory";
import { BackNavigation } from "@/components/roast/BackNavigation";
import { LoadingSkeleton } from "@/components/roast/LoadingSkeleton";
import { DailyChallenge } from "@/components/roast/DailyChallenge";
import { Language, RoastResponse } from "@/types/roast";
import { useToast } from "@/hooks/use-toast";
import { useRoastHistory } from "@/hooks/useRoastHistory";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AppState = "splash" | "landing" | "editor" | "loading" | "results" | "quiz";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [stateHistory, setStateHistory] = useState<AppState[]>([]);
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Hooks for history, sounds, and daily challenge
  const { history, addToHistory, deleteFromHistory, clearHistory } = useRoastHistory();
  const { playNotify } = useSoundEffects();
  const { markCompleted: markChallengeCompleted } = useDailyChallenge();

  // Check if splash was already shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splash_shown");
    if (splashShown) {
      setAppState("landing");
    }
  }, []);

  const changeState = (newState: AppState) => {
    setStateHistory(prev => [...prev, appState]);
    setAppState(newState);
  };

  const handleSplashComplete = () => {
    sessionStorage.setItem("splash_shown", "true");
    setAppState("landing");
  };

  const handleGetStarted = () => {
    changeState("editor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (stateHistory.length > 0) {
      const previousState = stateHistory[stateHistory.length - 1];
      setStateHistory(prev => prev.slice(0, -1));
      setAppState(previousState);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Default fallback
      if (appState === "quiz") {
        setAppState("results");
      } else if (appState === "results") {
        setAppState("editor");
      } else {
        setAppState("landing");
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitCode = async (code: string, language: Language, isChallenge: boolean = false) => {
    setIsLoading(true);
    changeState("loading");
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

      const roastResult = data as RoastResponse;
      setResult(roastResult);
      
      // Save to history
      addToHistory(code, language, roastResult);
      
      // Mark daily challenge as completed if this was a challenge
      if (isChallenge) {
        markChallengeCompleted();
      }
      
      // Play notification sound! 🔔
      playNotify();
      
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

  const handleDailyChallengeStart = (code: string, language: string) => {
    handleSubmitCode(code, language as Language, true);
  };

  const handleStartQuiz = () => {
    changeState("quiz");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setResult(null);
    setOriginalCode("");
    setStateHistory([]);
    setAppState("editor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setResult(null);
    setOriginalCode("");
    setStateHistory([]);
    setAppState("landing");
    navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistorySelect = (entry: typeof history[0]) => {
    setOriginalCode(entry.originalCode);
    setSelectedLanguage(entry.language);
    setResult(entry.result);
    changeState("results");
    playNotify();
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
        {/* Back Navigation */}
        <BackNavigation 
          currentState={appState}
          onBack={handleBack}
          onHome={handleLogoClick}
        />

        {appState === "landing" && (
          <Hero onGetStarted={handleGetStarted} />
        )}

        {appState === "editor" && (
          <section className="py-8 sm:py-12">
            <div className="container max-w-2xl mx-auto px-4">
              {/* Daily Challenge Section */}
              <DailyChallenge 
                onStartChallenge={handleDailyChallengeStart}
                isLoading={isLoading}
              />
            </div>
            
            <div className="text-center mb-8 px-4">
              <h2 className="text-mobile-2xl sm:text-3xl font-bold text-foreground mb-2">
                Apna Code Daal 📝
              </h2>
              <p className="text-muted-foreground">
                Photo upload kar ya code paste kar
              </p>
            </div>
            <CodeEditor 
              onSubmit={(code, language) => handleSubmitCode(code, language, false)}
              isLoading={isLoading}
            />
          </section>
        )}

        {appState === "loading" && (
          <section className="py-8 sm:py-12">
            <LoadingSkeleton />
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

      {/* History Panel */}
      <RoastHistory 
        history={history}
        onSelect={handleHistorySelect}
        onDelete={deleteFromHistory}
        onClear={clearHistory}
      />

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
