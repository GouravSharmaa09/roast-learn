import { useCallback, useRef, useEffect } from 'react';

// Haptic vibration patterns (in milliseconds)
const VIBRATION_PATTERNS = {
  notify: [50, 30, 50],
  success: [100, 50, 100, 50, 150],
  error: [200, 100, 200],
};

// Shared AudioContext - reuse for better performance
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  try {
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume();
    }
    return sharedAudioContext;
  } catch (error) {
    console.log('AudioContext not supported:', error);
    return null;
  }
};

// Create beep with higher volume
const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.8): Promise<void> => {
  return new Promise((resolve) => {
    const audioContext = getAudioContext();
    if (!audioContext) {
      resolve();
      return;
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      // Start at full volume, then fade out
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      setTimeout(resolve, duration * 1000);
    } catch (error) {
      console.log('Error creating beep:', error);
      resolve();
    }
  });
};

// Notification melody - loud ascending tones
const playNotifyMelody = async () => {
  await createBeep(523, 0.15, 'sine', 0.9); // C5
  setTimeout(() => createBeep(659, 0.15, 'sine', 0.9), 120); // E5
  setTimeout(() => createBeep(784, 0.2, 'sine', 1.0), 240); // G5
};

// Success melody - happy chord
const playSuccessMelody = async () => {
  await createBeep(523, 0.15, 'sine', 0.8);
  setTimeout(() => createBeep(659, 0.15, 'sine', 0.8), 100);
  setTimeout(() => createBeep(784, 0.2, 'sine', 0.9), 200);
  setTimeout(() => createBeep(1047, 0.3, 'sine', 1.0), 300);
};

// Error beep - low warning tone
const playErrorMelody = async () => {
  await createBeep(200, 0.25, 'square', 0.7);
  setTimeout(() => createBeep(150, 0.35, 'square', 0.8), 250);
};

// Applause simulation
const playApplauseMelody = async () => {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => createBeep(freq, 0.1, 'sine', 0.7), i * 60);
  });
};

export function useSoundEffects() {
  const isReady = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      const ctx = getAudioContext();
      if (ctx) {
        isReady.current = true;
        console.log('🔊 Audio ready!');
      }
    };
    
    // Try to init immediately, and also on interaction
    initAudio();
    
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const vibrate = useCallback((pattern: keyof typeof VIBRATION_PATTERNS) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(VIBRATION_PATTERNS[pattern]);
      }
    } catch (error) {
      // Vibration not supported
    }
  }, []);

  const playNotify = useCallback(() => {
    console.log('🔔 Playing notify sound');
    // Ensure context is ready
    getAudioContext();
    playNotifyMelody();
    vibrate('notify');
  }, [vibrate]);

  const playApplause = useCallback(() => {
    console.log('👏 Playing applause sound');
    getAudioContext();
    playApplauseMelody();
    vibrate('success');
  }, [vibrate]);

  const playSuccess = useCallback(() => {
    console.log('✅ Playing success sound');
    getAudioContext();
    playSuccessMelody();
    vibrate('success');
  }, [vibrate]);

  const playError = useCallback(() => {
    console.log('❌ Playing error sound');
    getAudioContext();
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
