import { useState } from "react";
import { Sparkles, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MemoryHookProps {
  hook: string;
}

export function MemoryHook({ hook }: MemoryHookProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`💡 ${hook} - RoastMyCode.app 🔥`);
      setCopied(true);
      toast.success("Copy ho gaya! Ab yaad rakh 🧠");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Copy nahi ho paya");
    }
  };

  const handleShare = async () => {
    const shareText = `💡 ${hook}\n\n— From RoastMyCode.app 🔥\nApna bhi code roast karwa: `;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Memory Hook - RoastMyCode",
          text: shareText,
          url: window.location.origin,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + window.location.origin)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-secondary border-2 border-primary/30 rounded-2xl p-6 my-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary animate-flicker" />
        <h3 className="font-bold text-foreground">🧠 Yaad Rakh Ye Line</h3>
      </div>

      <blockquote className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed mb-6 italic">
        "{hook}"
      </blockquote>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Kar"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Kar
        </Button>
      </div>
    </div>
  );
}
