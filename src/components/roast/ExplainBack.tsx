import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Send, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExplainBackProps {
  originalCode: string;
  correctedCode: string;
  language: string;
  onComplete: (passed: boolean) => void;
}

export function ExplainBack({ originalCode, correctedCode, language, onComplete }: ExplainBackProps) {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; passed: boolean } | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('roast-code', {
        body: { 
          code: originalCode,
          language,
          mode: 'explain-back',
          userExplanation: answer,
          correctedCode
        }
      });

      if (error) throw error;

      const passed = data.passed ?? false;
      setFeedback({ message: data.feedback, passed });
      onComplete(passed);
    } catch (e) {
      setFeedback({ 
        message: "Check nahi ho paya bhai. Chal fir bhi aage badh.", 
        passed: true 
      });
      onComplete(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (feedback) {
    return (
      <div className={`rounded-2xl p-6 border-2 animate-slide-up ${
        feedback.passed 
          ? 'bg-success/10 border-success/30' 
          : 'bg-destructive/10 border-destructive/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {feedback.passed ? (
            <Check className="w-6 h-6 text-success" />
          ) : (
            <X className="w-6 h-6 text-destructive" />
          )}
          <h3 className={`font-bold text-lg ${
            feedback.passed ? 'text-success' : 'text-destructive'
          }`}>
            {feedback.passed ? "Sahi Pakde Hain! 🎉" : "Thoda Aur Soch 🤔"}
          </h3>
        </div>
        <p className="text-foreground/90 leading-relaxed">{feedback.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 border border-border rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">🧠 Explain It Back</h3>
          <p className="text-sm text-muted-foreground">
            Batao - is bug ka main reason kya tha?
          </p>
        </div>
      </div>

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Apne words mein likh ki bug kyun hua tha aur kaise fix kiya..."
        className="min-h-[120px] mb-4 text-base"
        disabled={isLoading}
      />

      <Button
        onClick={handleSubmit}
        disabled={!answer.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Check ho raha hai...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Jawab Submit Kar
          </>
        )}
      </Button>
    </div>
  );
}
