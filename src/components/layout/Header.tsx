import { Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between px-4">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img 
            src={logo} 
            alt="Roast My Code" 
            className="w-9 h-9 object-contain"
          />
          <span className="font-bold text-lg text-foreground">
            Roast<span className="text-primary">My</span>Code
          </span>
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Seekh le bhai, mushkil tarike se 🔥
          </span>
          <Link 
            to="/about"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/about' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
