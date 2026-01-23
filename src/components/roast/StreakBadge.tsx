import { Flame, Trophy, Zap } from "lucide-react";

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
  message?: string;
}

export function StreakBadge({ currentStreak, bestStreak, message }: StreakBadgeProps) {
  if (currentStreak === 0 && bestStreak === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-6 animate-slide-up">
      {/* Current Streak */}
      {currentStreak > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full">
          <Zap className="w-4 h-4 text-primary animate-flicker" />
          <span className="text-sm font-semibold text-primary">
            {currentStreak} Streak 🔥
          </span>
        </div>
      )}

      {/* Best Streak */}
      {bestStreak > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-accent">
            Best: {bestStreak}
          </span>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="w-full text-center mt-2">
          <p className="text-sm text-primary font-medium animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
