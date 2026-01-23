import { Flame, Code2, Zap, Brain } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-4 animate-fade-in">
      {/* Fire Header Animation */}
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
          <div className="relative flex items-center gap-3 px-6 py-3 bg-card border border-primary/30 rounded-full">
            <Flame className="w-6 h-6 text-primary animate-fire-flicker" />
            <span className="text-lg font-bold text-foreground">Roast Ho Raha Hai...</span>
            <Flame className="w-6 h-6 text-primary animate-fire-flicker delay-150" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-3 animate-pulse">
          Tera code analyze ho raha hai, thoda sabar kar 🔥
        </p>
      </div>

      {/* Skeleton Cards with Fire Effects */}
      <SkeletonCard icon={<Flame className="w-5 h-5 text-primary" />} title="🔥 Roast Loading..." delay={0} />
      <SkeletonCard icon={<Brain className="w-5 h-5 text-primary" />} title="🧠 Analysis..." delay={100} />
      <SkeletonCard icon={<Zap className="w-5 h-5 text-primary" />} title="⚡ Fix Dhoond Raha..." delay={200} />
      <SkeletonCard icon={<Code2 className="w-5 h-5 text-primary" />} title="✨ Code Theek Kar Raha..." delay={300} />

      {/* Progress Bar with Fire */}
      <div className="pt-4">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-loading-progress" />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Analyzing...</span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-primary animate-pulse" />
            Roasting
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fire-flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.8; transform: scale(1.1); }
          50% { opacity: 1; transform: scale(0.95); }
          75% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-fire-flicker {
          animation: fire-flicker 0.5s ease-in-out infinite;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        @keyframes loading-progress {
          0% { width: 0%; }
          20% { width: 25%; }
          40% { width: 45%; }
          60% { width: 65%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }
        .animate-loading-progress {
          animation: loading-progress 8s ease-out forwards;
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

interface SkeletonCardProps {
  icon: React.ReactNode;
  title: string;
  delay: number;
}

function SkeletonCard({ icon, title, delay }: SkeletonCardProps) {
  return (
    <div 
      className="bg-card/50 border border-border/50 rounded-2xl p-4 animate-skeleton-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
          <div className="h-3 bg-secondary/50 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary/70 rounded w-full" />
        <div className="h-3 bg-secondary/50 rounded w-5/6" />
        <div className="h-3 bg-secondary/30 rounded w-4/6" />
      </div>
    </div>
  );
}
