import { useState, useEffect } from "react";

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  lastUpdated: string;
}

const STREAK_KEY = "roast_escape_streak";

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    const saved = localStorage.getItem(STREAK_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStreakData(parsed);
      } catch (e) {
        console.error("Failed to parse streak data");
      }
    }
  }, []);

  const saveStreak = (data: StreakData) => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    setStreakData(data);
  };

  const incrementStreak = () => {
    const newStreak = streakData.currentStreak + 1;
    const newBest = Math.max(newStreak, streakData.bestStreak);
    const newData = {
      currentStreak: newStreak,
      bestStreak: newBest,
      totalCorrect: streakData.totalCorrect + 1,
      lastUpdated: new Date().toISOString(),
    };
    saveStreak(newData);
    return newData;
  };

  const resetStreak = () => {
    const newData = {
      ...streakData,
      currentStreak: 0,
      lastUpdated: new Date().toISOString(),
    };
    saveStreak(newData);
    return newData;
  };

  const getStreakMessage = (streak: number): string => {
    if (streak >= 10) return "🔥🔥🔥 LEGEND! 10 roasts survive kar liye!";
    if (streak >= 7) return "🔥🔥 Bhai tu toh pro hai! 7 streak!";
    if (streak >= 5) return "🔥 Badiya! 5 mistakes fix without repeat!";
    if (streak >= 3) return "👏 3 consecutive wins! Keep going!";
    if (streak >= 1) return "💪 Streak shuru ho gayi!";
    return "";
  };

  return {
    streakData,
    incrementStreak,
    resetStreak,
    getStreakMessage,
  };
}
