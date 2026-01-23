import { useEffect, useState, useCallback } from "react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(onComplete, 500);
  }, [onComplete]);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Complete after 2.5 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [handleComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '75ms' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative animate-fade-in">
          <img 
            src={logo} 
            alt="Roast My Code - AI Code Roaster Logo" 
            className="w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-2xl"
            style={{ 
              animation: 'float 3s ease-in-out infinite',
            }}
          />
          {/* Fire glow effect */}
          <div 
            className="absolute inset-0 bg-primary/30 rounded-full blur-3xl -z-10"
            style={{ animation: 'fire-pulse 2s ease-in-out infinite' }}
          />
        </div>
        
        <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Roast<span className="text-primary">My</span>Code
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Taiyaar ho roast ke liye? 🔥
          </p>
        </div>

        {/* Loading bar with progress */}
        <div className="w-48 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {progress < 50 ? 'Loading...' : progress < 80 ? 'Almost ready...' : 'Let\'s roast! 🔥'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fire-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
