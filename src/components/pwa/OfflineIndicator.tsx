import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
      {!isOnline ? (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline Hai Bhai 📡</span>
        </div>
      ) : showReconnected ? (
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Wapas Online! 🎉</span>
        </div>
      ) : null}
    </div>
  );
};

export default OfflineIndicator;
