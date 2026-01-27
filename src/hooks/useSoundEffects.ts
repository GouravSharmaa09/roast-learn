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

// Haptic vibration patterns (in milliseconds)
const VIBRATION_PATTERNS = {
  notify: [50, 30, 50], // Quick double tap
  success: [100, 50, 100, 50, 150], // Celebration pattern
  error: [200, 100, 200], // Strong alert
};

export function useSoundEffects() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Haptic feedback function
  const vibrate = useCallback((pattern: keyof typeof VIBRATION_PATTERNS) => {
    try {
      // Check if vibration API is supported
      if ('vibrate' in navigator) {
        navigator.vibrate(VIBRATION_PATTERNS[pattern]);
      }
    } catch (error) {
      console.log('Vibration not supported:', error);
    }
  }, []);

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

  // Notification sound + haptic - when roast ready
  const playNotify = useCallback(() => {
    playSound('notify', 0.5);
    vibrate('notify');
  }, [playSound, vibrate]);

  const playApplause = useCallback(() => {
    playSound('applause', 0.4);
    vibrate('success');
  }, [playSound, vibrate]);

  const playSuccess = useCallback(() => {
    playSound('success', 0.5);
    vibrate('success');
  }, [playSound, vibrate]);

  const playError = useCallback(() => {
    playSound('error', 0.3);
    vibrate('error');
  }, [playSound, vibrate]);

  return {
    playNotify,
    playApplause,
    playSuccess,
    playError,
    vibrate,
  };
}
