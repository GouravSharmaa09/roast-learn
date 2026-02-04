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
import { Bot, Shield, Zap, Target } from "lucide-react";

type AppState = "editor" | "loading" | "results" | "quiz";

const AICodeReview = () => {
  const [appState, setAppState] = useState<AppState>("editor");
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
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
    setSelectedLanguage(language);

    try {
      const { data, error } = await supabase.functions.invoke('roast-code', {
        body: { code, language }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const roastResult = data as RoastResponse;
      setResult(roastResult);
      addToHistory(code, language, roastResult);
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
        <title>AI Code Review Tool – Free Automated Code Reviewer | Roast My Code</title>
        <meta name="description" content="Free AI code review tool that analyzes JavaScript, Python, C++, Java code. Get instant feedback, find bugs, and improve code quality with our automated code reviewer." />
        <meta name="keywords" content="ai code review, automated code review, code reviewer tool, free code review, code analysis tool, static code analysis, code quality checker, bug finder" />
        <link rel="canonical" href="https://www.roast-my-code.in/ai-code-review" />
        <meta property="og:title" content="AI Code Review Tool – Free Automated Code Reviewer" />
        <meta property="og:description" content="Free AI code review tool. Get instant feedback, find bugs, and improve code quality!" />
        <meta property="og:url" content="https://www.roast-my-code.in/ai-code-review" />
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
                  AI Code Review Tool 🤖
                </h1>
                <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  Free <strong>AI-powered code reviewer</strong> that analyzes your code, finds bugs, and suggests improvements. 
                  Supports JavaScript, Python, C++, Java and more!
                </p>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Bot className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">AI-Powered</h3>
                    <p className="text-sm text-muted-foreground">Advanced AI analysis</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Security Check</h3>
                    <p className="text-sm text-muted-foreground">Find vulnerabilities</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Zap className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Instant Results</h3>
                    <p className="text-sm text-muted-foreground">Get feedback in seconds</p>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                    <Target className="w-6 h-6 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Best Practices</h3>
                    <p className="text-sm text-muted-foreground">Industry standards</p>
                  </div>
                </div>

                {/* Detailed Content */}
                <div className="bg-card/30 border border-border/30 rounded-xl p-6 text-left space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">How Our AI Code Reviewer Works</h2>
                  <p className="text-muted-foreground">
                    Our AI code review tool uses advanced machine learning to analyze your code structure, logic, and patterns. 
                    It identifies potential bugs, security vulnerabilities, performance issues, and style violations. 
                    Unlike traditional linters, our AI understands the context of your code and provides meaningful suggestions 
                    that help you write cleaner, more maintainable code.
                  </p>
                  <p className="text-muted-foreground">
                    Whether you're a beginner learning to code or a senior developer looking for a second opinion, 
                    our AI reviewer provides valuable insights in a fun, memorable Hinglish format that makes 
                    learning from your mistakes enjoyable rather than frustrating.
                  </p>
                </div>
              </div>

              <div className="text-center mb-8 px-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Paste Your Code for AI Review 📝
                </h2>
                <p className="text-muted-foreground">
                  Select your language and get instant AI feedback!
                </p>
              </div>
              <CodeEditor 
                onSubmit={handleSubmitCode}
                isLoading={isLoading}
              />

              {/* Related Links */}
              <div className="container max-w-4xl mx-auto px-4 mt-12">
                <h2 className="text-xl font-bold text-foreground mb-4">Language-Specific Tools</h2>
                <div className="flex flex-wrap gap-4">
                  <Link to="/roast-javascript-code" className="text-primary hover:underline">Roast JavaScript Code →</Link>
                  <Link to="/roast-python-code" className="text-primary hover:underline">Roast Python Code →</Link>
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
              language={selectedLanguage}
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
              🤖 AI Code Review - Making code reviews fun since 2026
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AICodeReview;
