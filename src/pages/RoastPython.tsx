import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { CodeEditor } from "@/components/roast/CodeEditor";
import { ResultSection } from "@/components/roast/ResultSection";
import { QuizSection } from "@/components/roast/QuizSection";
import { LoadingSkeleton } from "@/components/roast/LoadingSkeleton";
import { BackNavigation } from "@/components/roast/BackNavigation";
import { Language, RoastResponse } from "@/types/roast";
import { useToast } from "@/hooks/use-toast";
import { useRoastHistory } from "@/hooks/useRoastHistory";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Code, Zap, Bug, BookOpen } from "lucide-react";

type AppState = "editor" | "loading" | "results" | "quiz";

const RoastPython = () => {
  const [appState, setAppState] = useState<AppState>("editor");
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { addToHistory } = useRoastHistory();
  const { playNotify } = useSoundEffects();

  const handleSubmitCode = async (code: string, language: Language) => {
    if (!navigator.onLine) {
      toast({
        title: "Offline Hai Bhai 📡",
        description: "Internet connect kar, AI roast ke liye network chahiye!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAppState("loading");
    setOriginalCode(code);

    try {
      const { data, error } = await supabase.functions.invoke('roast-code', {
        body: { code, language: "python" }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const roastResult = data as RoastResponse;
      setResult(roastResult);
      addToHistory(code, "python", roastResult);
      playNotify();
      setAppState("results");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Roast error:', error);
      toast({
        title: "Roast Fail Ho Gaya 🔥",
        description: error instanceof Error ? error.message : "Kuch gadbad ho gayi.",
        variant: "destructive",
      });
      setAppState("editor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBack = () => {
    if (appState === "quiz") setAppState("results");
    else if (appState === "results") setAppState("editor");
    else navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setResult(null);
    setOriginalCode("");
    setAppState("editor");
  };

  return (
    <>
      <Helmet>
        <title>Roast Python Code – Free AI Python Code Reviewer | Roast My Code</title>
        <meta name="description" content="Get your Python code brutally reviewed by AI in Hinglish. Find bugs in Django, Flask, data science scripts. Learn Pythonic best practices. Free tool!" />
        <meta name="keywords" content="roast python code, python code review, python code reviewer, django code review, flask review, python bugs, python debugging, free python tool, pythonic code" />
        <link rel="canonical" href="https://www.roast-my-code.in/roast-python-code" />
        <meta property="og:title" content="Roast Python Code – Free AI Python Code Reviewer" />
        <meta property="og:description" content="Get your Python code brutally reviewed by AI in Hinglish. Find bugs and learn Pythonic practices!" />
        <meta property="og:url" content="https://www.roast-my-code.in/roast-python-code" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header onLogoClick={handleLogoClick} />
        
        <main className="flex-1">
          <BackNavigation 
            currentState={appState === "editor" ? "landing" : appState}
            onBack={handleBack}
            onHome={handleLogoClick}
          />

          {appState === "editor" && (
            <section className="py-8 sm:py-12">
              {/* SEO Content */}
              <div className="container max-w-4xl mx-auto px-4 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                  Roast Python Code 🐍
                </h1>
                <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  Get your <strong>Python, Django, Flask, Data Science</strong> code brutally reviewed by AI. 
                  Learn Pythonic best practices and fix bugs instantly!
                </p>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Zap className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">PEP 8 Compliance</h3>
                    <p className="text-sm text-muted-foreground">Check Python style guidelines</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Bug className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Find Logic Errors</h3>
                    <p className="text-sm text-muted-foreground">Catch bugs in algorithms</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <BookOpen className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Pythonic Patterns</h3>
                    <p className="text-sm text-muted-foreground">List comprehensions, generators</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8 px-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Paste Your Python Code 📝
                </h2>
                <p className="text-muted-foreground">
                  Django, Flask, FastAPI, Data Science - sab analyze hoga!
                </p>
              </div>
              <CodeEditor 
                onSubmit={handleSubmitCode}
                isLoading={isLoading}
                defaultLanguage="python"
              />

              {/* Related Links */}
              <div className="container max-w-4xl mx-auto px-4 mt-12">
                <h2 className="text-xl font-bold text-foreground mb-4">Related Tools</h2>
                <div className="flex flex-wrap gap-4">
                  <Link to="/roast-javascript-code" className="text-primary hover:underline">Roast JavaScript Code →</Link>
                  <Link to="/ai-code-review" className="text-primary hover:underline">AI Code Review Tool →</Link>
                  <Link to="/" className="text-primary hover:underline">Home →</Link>
                </div>
              </div>
            </section>
          )}

          {appState === "loading" && (
            <section className="py-8 sm:py-12">
              <LoadingSkeleton />
            </section>
          )}

          {appState === "results" && result && (
            <ResultSection 
              result={result}
              originalCode={originalCode}
              language="python"
              onStartQuiz={() => setAppState("quiz")}
              onNewRoast={handleSubmitCode}
              isLoading={isLoading}
            />
          )}

          {appState === "quiz" && result && (
            <QuizSection result={result} onRetry={handleRetry} />
          )}
        </main>

        <footer className="border-t border-border/50 py-6 mt-auto">
          <div className="container px-4 text-center">
            <p className="text-sm text-muted-foreground">
              🐍 Python developers ko unki aukaat dikhane ke liye banaya gaya
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RoastPython;
