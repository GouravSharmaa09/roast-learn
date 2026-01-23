import { useCallback, useRef } from 'react';

// Sound URLs (using free sound effects)
const SOUNDS = {
  sizzle: 'https://assets.mixkit.co/active_storage/sfx/2550/2550-preview.mp3',
  applause: 'https://assets.mixkit.co/active_storage/sfx/477/477-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
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

  const playSizzle = useCallback(() => {
    playSound('sizzle', 0.4);
  }, [playSound]);

  const playApplause = useCallback(() => {
    playSound('applause', 0.5);
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound('success', 0.4);
  }, [playSound]);

  const playError = useCallback(() => {
    playSound('error', 0.3);
  }, [playSound]);

  return {
    playSizzle,
    playApplause,
    playSuccess,
    playError,
  };
}
