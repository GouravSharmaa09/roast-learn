import { ArrowLeft, Home, Flame } from 'lucide-react';

interface BackNavigationProps {
  currentState: string;
  onBack: () => void;
  onHome: () => void;
}

const stateLabels: Record<string, string> = {
  landing: 'Home',
  editor: 'Code Daal',
  loading: 'Roast Ho Raha...',
  results: 'Roast Ready 🔥',
  quiz: 'Quiz Time 🎯',
};

export function BackNavigation({ currentState, onBack, onHome }: BackNavigationProps) {
  // Don't show on landing or splash
  if (currentState === 'landing' || currentState === 'splash') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 px-4 max-w-2xl mx-auto pt-4">
      {/* Back Button - Matches app theme */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground bg-card border border-border hover:border-primary/50 hover:bg-primary/10 rounded-xl transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-primary" />
        <span>Peeche</span>
      </button>

      {/* Home Button - Fire themed */}
      <button
        onClick={onHome}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground bg-card border border-border hover:border-primary/50 hover:bg-primary/10 rounded-xl transition-all active:scale-95"
      >
        <Home className="w-4 h-4 text-primary" />
        <span>Home</span>
      </button>

      <div className="flex-1" />
      
      {/* Current State Badge - Fire themed */}
      <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 border border-primary/30 px-3 py-2 rounded-full">
        <Flame className="w-3 h-3" />
        <span>{stateLabels[currentState] || currentState}</span>
      </div>
    </div>
  );
}
