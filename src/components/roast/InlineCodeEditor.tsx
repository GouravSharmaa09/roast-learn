import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { Language, LANGUAGES } from "@/types/roast";

interface InlineCodeEditorProps {
  onSubmit: (code: string, language: Language) => void;
  isLoading: boolean;
  defaultExpanded?: boolean;
}

export function InlineCodeEditor({ onSubmit, isLoading, defaultExpanded = false }: InlineCodeEditorProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code.trim(), language);
      setCode(""); // Clear after submission
    }
  };

  const selectedLang = LANGUAGES.find(l => l.value === language);
  const isEmpty = !code.trim();

  if (!isExpanded) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsExpanded(true)}
          className="w-full border-2 border-dashed border-primary/30 hover:border-primary/60 bg-card/50 hover:bg-card"
        >
          <Flame className="w-5 h-5 text-primary" />
          <span className="ml-2">🔥 Naya Code Roast Kar</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 animate-slide-up">
      <div className="bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 border-b border-border">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Naya Code Daal</span>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Language Selector - Compact */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border hover:border-primary/50 rounded-xl transition-all"
            >
              <span className="text-lg">{selectedLang?.icon}</span>
              <span className="text-sm font-medium text-foreground">{selectedLang?.label}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageMenu && (
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden min-w-[180px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-primary/10 transition-colors ${
                      language === lang.value ? 'bg-primary/20' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.icon}</span>
                    <span className="text-sm font-medium text-foreground">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Code Textarea - Compact */}
          <div className="relative flex border border-border rounded-xl overflow-hidden">
            {/* Line Numbers */}
            <div className="flex-shrink-0 p-3 pr-2 bg-secondary/20 border-r border-border select-none">
              {Array.from({ length: Math.max(code.split('\n').length, 5) }, (_, i) => (
                <div key={i} className="text-xs text-muted-foreground/50 font-mono leading-5 text-right w-5">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Apna ${selectedLang?.label} code yahan paste kar...`}
              className="flex-1 min-h-[120px] p-3 pl-2 bg-transparent text-foreground font-mono text-sm leading-5 resize-none focus:outline-none placeholder:text-muted-foreground/40"
              spellCheck={false}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="hero"
            size="default"
            onClick={handleSubmit}
            disabled={isEmpty || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Roast ho raha hai...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                🔥 Roast Karo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}