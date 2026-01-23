import { ArrowLeft, Home } from 'lucide-react';

interface BackNavigationProps {
  currentState: string;
  onBack: () => void;
  onHome: () => void;
}

const stateLabels: Record<string, string> = {
  landing: 'Home',
  editor: 'Code Editor',
  loading: 'Loading...',
  results: 'Roast Results',
  quiz: 'Quiz',
};

export function BackNavigation({ currentState, onBack, onHome }: BackNavigationProps) {
  // Don't show on landing or splash
  if (currentState === 'landing' || currentState === 'splash') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 px-4 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <button
        onClick={onHome}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <div className="flex-1" />
      
      <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
        {stateLabels[currentState] || currentState}
      </span>
    </div>
  );
}
