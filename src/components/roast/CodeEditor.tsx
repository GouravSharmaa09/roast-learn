import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, Code2, ChevronDown } from "lucide-react";
import { Language, LANGUAGES } from "@/types/roast";
import { ImageUpload } from "./ImageUpload";

interface CodeEditorProps {
  onSubmit: (code: string, language: Language) => void;
  isLoading: boolean;
  initialCode?: string;
}

export function CodeEditor({ onSubmit, isLoading, initialCode = "" }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>("javascript");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleCodeExtracted = (extractedCode: string) => {
    setCode(extractedCode);
  };

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code.trim(), language);
    }
  };

  const selectedLang = LANGUAGES.find(l => l.value === language);
  const isEmpty = !code.trim();

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Image Upload Option */}
      <ImageUpload 
        onCodeExtracted={handleCodeExtracted}
        isLoading={isLoading}
      />

      {/* Or Divider */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">ya phir</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Language Selector Card */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Pehle Language Select Kar 👇
        </label>
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="w-full flex items-center justify-between gap-3 p-4 bg-card border-2 border-border hover:border-primary/50 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                {selectedLang?.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{selectedLang?.label}</div>
                <div className="text-sm text-muted-foreground">Ye language select hai</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showLanguageMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setLanguage(lang.value);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-primary/10 transition-colors ${
                    language === lang.value ? 'bg-primary/20' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.icon}</span>
                  <span className="font-medium text-foreground">{lang.label}</span>
                  {language === lang.value && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Card */}
      <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono">
              {selectedLang?.label.toLowerCase()}_code.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code2 className="w-4 h-4" />
            <span>{code.split('\n').length} lines</span>
          </div>
        </div>

        {/* Line Numbers + Textarea */}
        <div className="relative flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 p-4 pr-2 bg-secondary/20 border-r border-border select-none">
            {Array.from({ length: Math.max(code.split('\n').length, 10) }, (_, i) => (
              <div key={i} className="text-xs text-muted-foreground/50 font-mono leading-6 text-right w-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Apna ganda ${selectedLang?.label} code yahan paste kar...
// Himmat hai toh daal, roast ke liye taiyaar reh 😈

function example() {
  // Yahan apna code daal
}`}
            className="flex-1 min-h-[280px] sm:min-h-[320px] p-4 pl-3 bg-transparent text-foreground font-mono text-sm leading-6 resize-none focus:outline-none placeholder:text-muted-foreground/40"
            spellCheck={false}
            disabled={isLoading}
          />
        </div>

        {/* Submit Section */}
        <div className="p-4 bg-gradient-to-t from-secondary/40 to-transparent border-t border-border">
          <Button
            variant="hero"
            size="lg"
            onClick={handleSubmit}
            disabled={isEmpty || isLoading}
            className="w-full text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Tera code roast ho raha hai… ruk 😈
              </>
            ) : (
              <>
                <Flame className="w-6 h-6" />
                🔥 Roast Karo Isko
              </>
            )}
          </Button>
          
          {isEmpty && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              Abe pehle code toh daal, phir roast milega 💀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
