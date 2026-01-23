import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import "highlight.js/styles/atom-one-dark.css";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("java", java);

interface CodeBlockProps {
  code: string;
  language: string;
  showCopy?: boolean;
  title?: string;
}

export function CodeBlock({ code, language, showCopy = true, title }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copy ho gaya! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Copy nahi ho paya bhai");
    }
  };

  const getLangClass = () => {
    const langMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      cpp: "cpp",
      java: "java",
    };
    return langMap[language] || "javascript";
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-[#282c34]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-success/60" />
          </div>
          {title && (
            <span className="text-xs text-muted-foreground ml-2 font-mono">
              {title}
            </span>
          )}
        </div>
        
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 m-0 text-sm leading-relaxed">
          <code 
            ref={codeRef} 
            className={`language-${getLangClass()} !bg-transparent`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
