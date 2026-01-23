import { Flame } from "lucide-react";

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg safe-bottom">
      <div className="container flex h-14 items-center justify-between px-4">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">
            Roast<span className="text-primary">My</span>Code
          </span>
        </button>
        
        <div className="text-xs text-muted-foreground hidden sm:block">
          Seekh le bhai, mushkil tarike se 🔥
        </div>
      </div>
    </header>
  );
}
