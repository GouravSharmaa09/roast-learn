import { useState, useEffect } from "react";
import { RoastResponse } from "@/types/roast";
import { Button } from "@/components/ui/button";
import { Check, X, Lightbulb, RotateCcw } from "lucide-react";
import { StreakBadge } from "./StreakBadge";
import { useStreak } from "@/hooks/useStreak";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface QuizSectionProps {
  result: RoastResponse;
  onRetry: () => void;
}

export function QuizSection({ result, onRetry }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(result.mcqs.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streakMessage, setStreakMessage] = useState("");
  
  const { streakData, incrementStreak, resetStreak, getStreakMessage } = useStreak();
  const { playApplause, playError } = useSoundEffects();

  const mcq = result.mcqs[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isCorrect = isAnswered && selectedAnswers[currentQuestion] === mcq.correctIndex;

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < result.mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    result.mcqs.forEach((mcq, index) => {
      if (selectedAnswers[index] === mcq.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / result.mcqs.length) * 9) + 1;
  };

  // Handle streak on quiz complete
  useEffect(() => {
    if (quizComplete) {
      const score = calculateScore();
      const passed = score >= 7;
      
      if (passed) {
        const newData = incrementStreak();
        setStreakMessage(getStreakMessage(newData.currentStreak));
        playApplause(); // 🎉 Applause on pass!
      } else {
        resetStreak();
        setStreakMessage("");
        playError(); // 😢 Error sound on fail
      }
    }
  }, [quizComplete]);

  if (quizComplete) {
    const score = calculateScore();
    const passed = score >= 7;

    return (
      <div className="w-full max-w-2xl mx-auto px-4 animate-slide-up">
        {/* Streak Badge */}
        <StreakBadge 
          currentStreak={streakData.currentStreak}
          bestStreak={streakData.bestStreak}
          message={streakMessage}
        />

        {/* Score Display */}
        <div className={`rounded-2xl p-8 text-center border ${passed ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
          <div className="text-6xl mb-4">
            {passed ? '😎' : '😈'}
          </div>
          
          <div className={`text-5xl font-bold mb-2 ${passed ? 'text-success' : 'text-destructive'}`}>
            {score}/10
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {passed ? "Bhai Tu Toh Samajh Gaya! 🎉" : "Dobara Padh Bhai 😈"}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {passed 
              ? "Kya baat hai! Ab aisa code nahi likhega tu." 
              : "Thoda aur dhyan de. Phir se roast le aur seekh."}
          </p>

          {/* Practice Problem */}
          <div className="bg-card/50 rounded-xl p-6 text-left mb-6 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">🧩 {result.practiceProblem.title}</h3>
            </div>
            <p className="text-foreground/90 mb-3">{result.practiceProblem.description}</p>
            <p className="text-sm text-muted-foreground">
              💡 Hint: {result.practiceProblem.hint}
            </p>
          </div>

          <Button
            variant="hero"
            size="lg"
            onClick={onRetry}
            className="w-full"
          >
            <RotateCcw className="w-5 h-5" />
            Aur Code Roast Kar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-slide-up">
      {/* Streak Badge at top */}
      <StreakBadge 
        currentStreak={streakData.currentStreak}
        bestStreak={streakData.bestStreak}
      />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Sawaal {currentQuestion + 1} / {result.mcqs.length}</span>
          <span className="text-sm text-primary font-medium">📝 MCQ</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / result.mcqs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
          {mcq.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {mcq.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index;
            const isCorrectOption = index === mcq.correctIndex;
            
            let optionClass = "border-border hover:border-primary/50 hover:bg-primary/5";
            if (isAnswered) {
              if (isCorrectOption) {
                optionClass = "border-success bg-success/10";
              } else if (isSelected && !isCorrectOption) {
                optionClass = "border-destructive bg-destructive/10";
              } else {
                optionClass = "border-border opacity-50";
              }
            } else if (isSelected) {
              optionClass = "border-primary bg-primary/10";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${optionClass}`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-foreground/90">{option}</span>
                {isAnswered && isCorrectOption && (
                  <Check className="w-5 h-5 text-success" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 mb-4 border animate-slide-up ${isCorrect ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <X className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-semibold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
              {isCorrect ? 'Sahi Jawab! 🎉' : 'Galat Bhai! 😅'}
            </span>
          </div>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {mcq.explanation}
          </p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <Button
          variant="default"
          size="lg"
          onClick={handleNext}
          className="w-full"
        >
          {currentQuestion < result.mcqs.length - 1 ? 'Agla Sawaal' : 'Result Dekh'}
        </Button>
      )}
    </div>
  );
}
