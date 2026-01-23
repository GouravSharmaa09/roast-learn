import { useCallback, useRef } from 'react';

// Short notification-style sounds (quick snippets)
const SOUNDS = {
  // Short "ding" notification for response arrived
  notify: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  // Quick success chime
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  // Short applause/celebration
  applause: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  // Quick error beep
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

export function useSoundEffects() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((soundType: keyof typeof SOUNDS, volume = 0.5) => {
    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(SOUNDS[soundType]);
      audio.volume = volume;
      audioRef.current = audio;
      
      audio.play().catch(err => {
        // Silently fail if autoplay is blocked
        console.log('Sound play blocked:', err);
      });
    } catch (error) {
      console.log('Failed to play sound:', error);
    }
  }, []);

  // Notification sound - short ding when roast ready
  const playNotify = useCallback(() => {
    playSound('notify', 0.5);
  }, [playSound]);

  const playApplause = useCallback(() => {
    playSound('applause', 0.4);
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound('success', 0.5);
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error', 0.3);
  }, [playSound]);

  return {
    playNotify,
    playApplause,
    playSuccess,
    playError,
  };
}
