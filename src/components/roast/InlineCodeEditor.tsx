import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Loader2, ChevronDown, ChevronUp, Camera, X, ImageIcon } from "lucide-react";
import { Language, LANGUAGES } from "@/types/roast";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code.trim(), language);
      setCode("");
      setSelectedImage(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File 📷",
        description: "Bhai sirf image file daal",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Big 🐘",
        description: "5MB se chhoti image daal",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { image: selectedImage, mode: 'extract-code' }
      });

      if (error) throw error;

      if (data.code) {
        setCode(data.code);
        setSelectedImage(null);
        toast({
          title: "Code Extract Ho Gaya! 🎉",
          description: "Ab roast button dabao",
        });
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Extract Nahi Ho Paya 😢",
        description: error instanceof Error ? error.message : "Dobara try kar",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

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

        <div className="p-4 space-y-3">
          {/* Top Row: Language + Image Upload */}
          <div className="flex gap-2">
            {/* Language Selector */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border hover:border-primary/50 rounded-xl transition-all"
              >
                <span className="text-lg">{selectedLang?.icon}</span>
                <span className="text-sm font-medium text-foreground">{selectedLang?.label}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ml-auto ${showLanguageMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLanguageMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
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

            {/* Image Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border hover:border-primary/50 rounded-xl transition-all"
            >
              <Camera className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground hidden sm:inline">📸 Photo</span>
            </button>
          </div>

          {/* Image Preview (if selected) */}
          {selectedImage && (
            <div className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-secondary/50 border-b border-border">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground">Preview</span>
                </div>
                <button onClick={clearImage} className="p-1 hover:bg-destructive/10 rounded">
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </div>
              <div className="p-2">
                <img src={selectedImage} alt="Code" className="w-full max-h-32 object-contain rounded bg-secondary" />
              </div>
              <div className="p-2 pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      🔍 Code Nikaal
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Code Textarea */}
          <div className="relative flex border border-border rounded-xl overflow-hidden">
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