import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Loader2 } from "lucide-react";
import { Language, LANGUAGES } from "@/types/roast";

interface CodeEditorProps {
  onSubmit: (code: string, language: Language) => void;
  isLoading: boolean;
}

export function CodeEditor({ onSubmit, isLoading }: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code.trim(), language);
    }
  };

  const isEmpty = !code.trim();

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-xl">
        {/* Language Selector */}
        <div className="flex gap-1 p-2 bg-secondary/30 border-b border-border overflow-x-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                language === lang.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{lang.icon}</span>
              <span className="hidden sm:inline">{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Code Textarea */}
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your ${LANGUAGES.find(l => l.value === language)?.label} code here...\n// Don't worry, we'll be gentle... 😈`}
            className="w-full h-64 sm:h-80 p-4 bg-transparent text-foreground font-mono text-sm sm:text-base resize-none focus:outline-none placeholder:text-muted-foreground/50"
            spellCheck={false}
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
            {code.length} chars
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-secondary/20 border-t border-border">
          <Button
            variant="hero"
            size="lg"
            onClick={handleSubmit}
            disabled={isEmpty || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Roasting your code… 😈
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                🔥 Roast My Code
              </>
            )}
          </Button>
          
          {isEmpty && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Paste some code to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
