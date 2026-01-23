import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px] animate-pulse delay-75" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-slide-up">
        <div className="relative">
          <img 
            src={logo} 
            alt="Roast My Code Logo" 
            className="w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-2xl animate-float"
          />
          {/* Fire glow effect */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10 animate-fire-pulse" />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Roast<span className="text-primary">My</span>Code
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Taiyaar ho roast ke liye? 🔥
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-loading-bar" />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(0); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
