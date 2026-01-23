import { useState } from "react";
import { Calendar, Trophy, Clock, Flame, ChevronRight, Check, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { CodeBlock } from "./CodeBlock";

interface DailyChallengeProps {
  onStartChallenge: (code: string, language: string) => void;
  isLoading: boolean;
}

export function DailyChallenge({ onStartChallenge, isLoading }: DailyChallengeProps) {
  const { challenge, state, getTimeUntilNextChallenge } = useDailyChallenge();
  const [showHint, setShowHint] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-primary/20 text-primary',
    hard: 'bg-destructive/20 text-destructive'
  };

  const difficultyLabels = {
    easy: 'आसान',
    medium: 'Medium',
    hard: 'कठिन'
  };

  if (state.completedToday) {
    return (
      <div className="bg-card/80 border border-success/30 rounded-2xl p-6 mb-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
            <Check className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              🎉 Aaj ka Challenge Complete!
            </h3>
            <p className="text-sm text-muted-foreground">
              Kal naya challenge aayega
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{state.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak 🔥</div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{getTimeUntilNextChallenge()}</div>
            <div className="text-xs text-muted-foreground">Next Challenge</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/30 rounded-2xl overflow-hidden mb-6 animate-slide-up">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center animate-fire-pulse">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              🎯 Daily Challenge
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[challenge.difficulty]}`}>
                {difficultyLabels[challenge.difficulty]}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">
              {challenge.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state.currentStreak > 0 && (
            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {state.currentStreak} streak
            </span>
          )}
          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-foreground/90">{challenge.description}</p>
          
          <CodeBlock 
            code={challenge.buggyCode}
            language={challenge.language}
            title={`buggy.${challenge.language === 'javascript' ? 'js' : challenge.language === 'python' ? 'py' : challenge.language}`}
            showCopy={false}
          />

          {/* Hint Section */}
          {!showHint ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              className="text-muted-foreground"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Hint Chahiye?
            </Button>
          ) : (
            <div className="bg-secondary/50 rounded-lg p-3 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-sm text-foreground/80">{challenge.hint}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              onClick={() => onStartChallenge(challenge.buggyCode, challenge.language)}
              disabled={isLoading}
              className="flex-1"
            >
              <Flame className="w-4 h-4 mr-2" />
              Roast Karo! 🔥
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span>Total Completed: {state.totalCompleted}</span>
            <span>Best Streak: {Math.max(state.currentStreak, state.totalCompleted > 0 ? 1 : 0)} days</span>
          </div>
        </div>
      )}
    </div>
  );
}
