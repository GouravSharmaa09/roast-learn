import { useCallback, useRef, useEffect } from 'react';

// Haptic vibration patterns (in milliseconds)
const VIBRATION_PATTERNS = {
  notify: [50, 30, 50], // Quick double tap
  success: [100, 50, 100, 50, 150], // Celebration pattern
  error: [200, 100, 200], // Strong alert
};

// Create audio context for generating sounds programmatically
// This is more reliable than external URLs which can fail/expire
const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      setTimeout(() => {
        audioContext.close();
        resolve();
      }, duration * 1000);
    } catch (error) {
      console.log('Audio not supported:', error);
      resolve();
    }
  });
};

// Notification melody - ascending tones
const playNotifyMelody = async () => {
  await createBeep(523, 0.1, 'sine'); // C5
  setTimeout(() => createBeep(659, 0.1, 'sine'), 100); // E5
  setTimeout(() => createBeep(784, 0.15, 'sine'), 200); // G5
};

// Success melody - happy chord
const playSuccessMelody = async () => {
  await createBeep(523, 0.15, 'sine'); // C5
  setTimeout(() => createBeep(659, 0.15, 'sine'), 80); // E5
  setTimeout(() => createBeep(784, 0.2, 'sine'), 160); // G5
  setTimeout(() => createBeep(1047, 0.25, 'sine'), 240); // C6
};

// Error beep - low tone
const playErrorMelody = async () => {
  await createBeep(200, 0.2, 'square');
  setTimeout(() => createBeep(150, 0.3, 'square'), 200);
};

// Applause simulation - multiple quick notes
const playApplauseMelody = async () => {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => createBeep(freq, 0.08, 'sine'), i * 50);
  });
};

export function useSoundEffects() {
  const hasInteracted = useRef(false);

  // Track user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
    };
    
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Haptic feedback function
  const vibrate = useCallback((pattern: keyof typeof VIBRATION_PATTERNS) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(VIBRATION_PATTERNS[pattern]);
      }
    } catch (error) {
      console.log('Vibration not supported:', error);
    }
  }, []);

  // Notification sound + haptic - when roast ready
  const playNotify = useCallback(() => {
    console.log('🔔 Playing notify sound');
    playNotifyMelody();
    vibrate('notify');
  }, [vibrate]);

  const playApplause = useCallback(() => {
    console.log('👏 Playing applause sound');
    playApplauseMelody();
    vibrate('success');
  }, [vibrate]);

  const playSuccess = useCallback(() => {
    console.log('✅ Playing success sound');
    playSuccessMelody();
    vibrate('success');
  }, [vibrate]);

  const playError = useCallback(() => {
    console.log('❌ Playing error sound');
    playErrorMelody();
    vibrate('error');
  }, [vibrate]);

  return {
    playNotify,
    playApplause,
    playSuccess,
    playError,
    vibrate,
  };
}
