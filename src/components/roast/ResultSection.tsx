import { useState } from "react";
import { RoastResponse, Language } from "@/types/roast";
import { Button } from "@/components/ui/button";
import { Flame, Brain, AlertTriangle, ListOrdered, Sparkles, Star, ClipboardCheck, ChevronDown, ChevronUp } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { MemoryHook } from "./MemoryHook";
import { ExplainBack } from "./ExplainBack";

interface ResultSectionProps {
  result: RoastResponse;
  originalCode: string;
  language: Language;
  onStartQuiz: () => void;
}

export function ResultSection({ result, originalCode, language, onStartQuiz }: ResultSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['roast', 'fix', 'code', 'golden']));
  const [showExplainBack, setShowExplainBack] = useState(false);
  const [explainBackPassed, setExplainBackPassed] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleExplainBackComplete = (passed: boolean) => {
    setExplainBackPassed(passed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-4 animate-slide-up">
      {/* Roast Section */}
      <ResultCard
        icon={<Flame className="w-5 h-5" />}
        title="🔥 Tera Roast"
        bgClass="bg-roast"
        isExpanded={expandedSections.has('roast')}
        onToggle={() => toggleSection('roast')}
      >
        <p className="text-lg text-foreground leading-relaxed italic">
          "{result.roast}"
        </p>
      </ResultCard>

      {/* Why This Happens */}
      <ResultCard
        icon={<Brain className="w-5 h-5" />}
        title="🧠 Ye Galti Kyun Hoti Hai"
        bgClass="bg-brain"
        isExpanded={expandedSections.has('why')}
        onToggle={() => toggleSection('why')}
      >
        <p className="text-foreground/90 leading-relaxed">
          {result.whyThisHappens}
        </p>
      </ResultCard>

      {/* Real-World Problems */}
      <ResultCard
        icon={<AlertTriangle className="w-5 h-5" />}
        title="🧪 Production Mein Kya Hoga"
        isExpanded={expandedSections.has('problems')}
        onToggle={() => toggleSection('problems')}
      >
        <p className="text-foreground/90 leading-relaxed">
          {result.realWorldProblems}
        </p>
      </ResultCard>

      {/* Step-by-Step Fix */}
      <ResultCard
        icon={<ListOrdered className="w-5 h-5" />}
        title="✋ Aise Fix Kar"
        bgClass="bg-fix"
        isExpanded={expandedSections.has('fix')}
        onToggle={() => toggleSection('fix')}
      >
        <ol className="space-y-3">
          {result.stepByStepFix.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-success/20 text-success rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="text-foreground/90 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </ResultCard>

      {/* Corrected Code with Syntax Highlighting */}
      <ResultCard
        icon={<Sparkles className="w-5 h-5" />}
        title="✨ Sahi Code Dekh"
        isExpanded={expandedSections.has('code')}
        onToggle={() => toggleSection('code')}
      >
        <CodeBlock 
          code={result.correctedCode} 
          language={language}
          title={`corrected.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}`}
        />
      </ResultCard>

      {/* Golden Rule */}
      <ResultCard
        icon={<Star className="w-5 h-5 text-yellow-500" />}
        title="📌 Yaad Rakh Ye Rule"
        isExpanded={expandedSections.has('golden')}
        onToggle={() => toggleSection('golden')}
        highlight
      >
        <p className="text-lg text-foreground font-semibold text-center">
          "{result.goldenRule}"
        </p>
      </ResultCard>

      {/* Memory Hook - Catchy One-Liner */}
      {result.memoryHook && (
        <MemoryHook hook={result.memoryHook} />
      )}

      {/* Explain It Back Section */}
      {!showExplainBack && !explainBackPassed && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowExplainBack(true)}
            className="w-full"
          >
            <Brain className="w-5 h-5" />
            🧠 Explain It Back - Samjha Kya?
          </Button>
        </div>
      )}

      {showExplainBack && !explainBackPassed && (
        <ExplainBack
          originalCode={originalCode}
          correctedCode={result.correctedCode}
          language={language}
          onComplete={handleExplainBackComplete}
        />
      )}

      {/* Quiz CTA */}
      <div className="pt-6 pb-safe">
        <Button
          variant="success"
          size="lg"
          onClick={onStartQuiz}
          className="w-full"
        >
          <ClipboardCheck className="w-5 h-5" />
          Ab Test De - Seekha Ya Nahi
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Quick quiz se prove kar ki samajh aaya
        </p>
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  bgClass?: string;
  isExpanded: boolean;
  onToggle: () => void;
  highlight?: boolean;
}

function ResultCard({ icon, title, children, bgClass, isExpanded, onToggle, highlight }: ResultCardProps) {
  return (
    <div className={`rounded-2xl border border-border/50 overflow-hidden transition-all ${bgClass || 'bg-card/50'} ${highlight ? 'ring-2 ring-ring/30' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
