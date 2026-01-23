import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onCodeExtracted: (code: string) => void;
  isLoading: boolean;
}

export function ImageUpload({ onCodeExtracted, isLoading }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File 📷",
        description: "Bhai sirf image file daal, text file nahi",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Big 🐘",
        description: "Bhai 5MB se chhoti image daal",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { 
          image: selectedImage,
          mode: 'extract-code'
        }
      });

      if (error) throw error;

      if (data.code) {
        onCodeExtracted(data.code);
        setSelectedImage(null);
        toast({
          title: "Code Extract Ho Gaya! 🎉",
          description: "Ab roast ke liye ready hai tera code",
        });
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Extract Nahi Ho Paya 😢",
        description: error instanceof Error ? error.message : "Dobara try kar bhai",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!selectedImage ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 p-4 bg-secondary/50 border-2 border-dashed border-border hover:border-primary/50 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-foreground">📸 Photo Upload Kar</div>
            <div className="text-sm text-muted-foreground">Code ki photo se bhi roast milega</div>
          </div>
          <Upload className="w-5 h-5 text-muted-foreground ml-auto" />
        </button>
      ) : (
        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
          {/* Preview Header */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">Image Preview</span>
            </div>
            <button
              onClick={clearImage}
              className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="p-4">
            <img
              src={selectedImage}
              alt="Uploaded code"
              className="w-full max-h-48 object-contain rounded-lg bg-secondary"
            />
          </div>

          {/* Extract Button */}
          <div className="p-4 pt-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleProcessImage}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Code Extract Ho Raha Hai...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  🔍 Image Se Code Nikaal
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
