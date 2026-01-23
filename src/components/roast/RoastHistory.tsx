import { useState } from 'react';
import { History, Trash2, ChevronRight, X, Clock, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistoryEntry } from '@/hooks/useRoastHistory';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

interface RoastHistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function RoastHistory({ history, onSelect, onDelete, onClear }: RoastHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const getLanguageEmoji = (lang: string) => {
    const emojis: Record<string, string> = {
      javascript: '🟨',
      python: '🐍',
      cpp: '⚡',
      java: '☕',
    };
    return emojis[lang] || '📝';
  };

  return (
    <>
      {/* History Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <History className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-foreground">History</span>
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {history.length}
        </span>
      </button>

      {/* History Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Roast History 📜</h2>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-secondary/50 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onSelect(entry);
                      setIsOpen(false);
                    }}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getLanguageEmoji(entry.language)}</span>
                          <span className="text-sm font-medium text-foreground capitalize">
                            {entry.language}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(entry.timestamp, { addSuffix: true, locale: hi })}
                          </span>
                        </div>
                        
                        {/* Code Preview */}
                        <div className="flex items-start gap-2 mb-2">
                          <Code2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <pre className="text-xs text-muted-foreground font-mono line-clamp-2 overflow-hidden">
                            {entry.originalCode.slice(0, 100)}...
                          </pre>
                        </div>

                        {/* Roast Preview */}
                        <p className="text-sm text-foreground/80 line-clamp-2 italic">
                          "{entry.result.roast.slice(0, 80)}..."
                        </p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                  
                  {/* Delete Button */}
                  <div className="px-4 pb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
