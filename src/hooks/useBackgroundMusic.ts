import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';

interface UseBackgroundMusicProps {
  enabled: boolean;
  volume?: number;
}

// 🎵 Create Howl instance OUTSIDE the hook (singleton pattern)
// This prevents multiple instances on re-renders
let musicInstance: Howl | null = null;

const createMusicInstance = () => {
  if (musicInstance) return musicInstance;
  
  musicInstance = new Howl({
    src: ['/sounds/background-music.mp3'],
    loop: true,
    volume: 0.3,
    preload: true,
    html5: true, // 🎯 CRITICAL for mobile/Android
    autoplay: false,
    onload: () => {
      console.log('🎵 Music loaded successfully');
    },
    onplay: () => {
      console.log('🎵 Music started playing');
    },
    onpause: () => {
      console.log('⏸️ Music paused');
    },
    onend: () => {
      console.log('🔄 Music ended (should loop)');
    },
    onloaderror: (id, error) => {
      console.error('❌ Music load error:', error);
    },
    onplayerror: (id, error) => {
      console.error('❌ Music play error:', error);
      // Try to recover from play error
      musicInstance?.once('unlock', () => {
        musicInstance?.play();
      });
    },
    onstop: () => {
      console.log('⏹️ Music stopped');
    },
  });
  
  return musicInstance;
};

export const useBackgroundMusic = ({ enabled, volume = 0.3 }: UseBackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize music instance once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const music = createMusicInstance();
    
    // Wait for music to load
    if (music.state() === 'loaded') {
      setIsLoaded(true);
    } else {
      music.once('load', () => {
        setIsLoaded(true);
      });
    }

    // Unlock audio context on first user interaction (mobile fix)
    const unlockAudio = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  // Handle enabled/disabled state changes
  useEffect(() => {
    if (!musicInstance || !isLoaded) return;

    if (enabled) {
      if (!musicInstance.playing()) {
        const playId = musicInstance.play();
        // Track playing state
        musicInstance.once('play', () => setIsPlaying(true));
        
        // Fallback: if play fails, try again after user interaction
        if (playId === null) {
          console.log('⚠️ Music play blocked, waiting for user interaction');
        }
      }
    } else {
      if (musicInstance.playing()) {
        musicInstance.pause();
        setIsPlaying(false);
      }
    }
  }, [enabled, isLoaded]);

  // Update volume when changed
  useEffect(() => {
    if (musicInstance) {
      musicInstance.volume(volume);
    }
  }, [volume]);

useEffect(() => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'KidSpark Background Music',
      artist: 'KidSpark',
      album: 'Learning Music',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
    navigator.mediaSession.setActionHandler('play', () => {
      const music = (window as any).__kidsparkMusic;
      if (music) music.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      const music = (window as any).__kidsparkMusic;
      if (music) music.pause();
    });
  }
}, []);
  
  // Handle page visibility (pause when app is minimized)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!musicInstance) return;

      if (document.hidden) {
        // App went to background
        if (musicInstance.playing()) {
          musicInstance.pause();
        }
      } else {
        // App came back to foreground
        if (enabled && !musicInstance.playing()) {
          musicInstance.play();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  const play = useCallback(() => {
    if (musicInstance && !musicInstance.playing()) {
      musicInstance.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (musicInstance && musicInstance.playing()) {
      musicInstance.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (musicInstance) {
      musicInstance.stop();
    }
  }, []);

  const fadeIn = useCallback((duration: number = 2000) => {
    if (!musicInstance || !isLoaded) return;

    // Ensure audio context is running
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => {
        startFadeIn(duration);
      });
    } else {
      startFadeIn(duration);
    }
  }, [isLoaded, volume]);

  const startFadeIn = (duration: number) => {
    if (!musicInstance) return;
    
    musicInstance.volume(0);
    const playId = musicInstance.play();
    
    if (playId !== null) {
      musicInstance.fade(0, volume, duration);
    }
  };

  const fadeOut = useCallback((duration: number = 1000) => {
    if (musicInstance && musicInstance.playing()) {
      musicInstance.fade(volume, 0, duration);
      setTimeout(() => {
        if (musicInstance) {
          musicInstance.pause();
        }
      }, duration);
    }
  }, [volume]);

  return {
    play,
    pause,
    stop,
    fadeIn,
    fadeOut,
    isPlaying,
    isLoaded,
  };
};
