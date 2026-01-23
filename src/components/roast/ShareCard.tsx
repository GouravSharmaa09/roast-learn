import { useState } from "react";
import { Share2, Twitter, MessageCircle, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoastResponse } from "@/types/roast";

interface ShareCardProps {
  result: RoastResponse;
  score?: number;
  language: string;
}

export function ShareCard({ result, score, language }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const emoji = score && score >= 7 ? '🏆' : '🔥';
    let text = `${emoji} Just got roasted by RoastMyCode!\n\n`;
    text += `💬 "${result.roast.slice(0, 100)}${result.roast.length > 100 ? '...' : ''}"\n\n`;
    
    if (score) {
      text += `📊 Quiz Score: ${score}/10\n`;
    }
    
    text += `💡 Golden Rule: "${result.goldenRule}"\n\n`;
    text += `🔥 Apna bhi code roast karwa: `;
    
    return text;
  };

  const shareUrl = window.location.origin;
  const shareText = generateShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText + shareUrl);
      setCopied(true);
      toast.success("Share text copied! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Copy nahi ho paya");
    }
  };

  const handleTwitterShare = () => {
    const twitterText = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(shareText + shareUrl);
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Roast My Code - Mera Roast Dekho! 🔥",
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        // User cancelled
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/30 rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground">🔥 Roast Share Kar</h3>
      </div>

      {/* Preview Card */}
      <div className="bg-background/50 rounded-xl p-4 mb-4 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="https://storage.googleapis.com/gpt-engineer-file-uploads/gmS0YPWU1Rd9XEofJuWVmhvlqJ63/uploads/1769240811976-unnamed__1_-removebg-preview.png"
            alt="Logo" 
            className="w-6 h-6"
          />
          <span className="text-sm font-semibold text-foreground">RoastMyCode</span>
          {score && (
            <span className={`ml-auto text-sm font-bold ${score >= 7 ? 'text-success' : 'text-destructive'}`}>
              {score}/10 {score >= 7 ? '🏆' : '😅'}
            </span>
          )}
        </div>
        
        <p className="text-sm text-foreground/80 italic line-clamp-2 mb-2">
          "{result.roast.slice(0, 120)}{result.roast.length > 120 ? '...' : ''}"
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="bg-secondary/70 px-2 py-0.5 rounded">{language}</span>
          <span>•</span>
          <span>roastmycode.lovable.app</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTwitterShare}
          className="flex items-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          Twitter/X
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>

        {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
