import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface UseBackgroundMusicProps {
  enabled: boolean;
  volume?: number;
}

export const useBackgroundMusic = ({ enabled, volume = 0.3 }: UseBackgroundMusicProps) => {
  const musicRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize music
    musicRef.current = new Howl({
      src: ['/sounds/background-music.mp3'],
      loop: true,
      volume: volume,
      preload: true,
      html5: true, // Better for mobile
      onload: () => {
        setIsLoaded(true);
        console.log('🎵 Background music loaded');
      },
      onplay: () => {
        setIsPlaying(true);
        console.log('🎵 Music playing');
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        console.error('🎵 Music load error:', error);
      },
      onplayerror: (id, error) => {
        console.error('🎵 Music play error:', error);
      },
    });

    // Cleanup on unmount
    return () => {
      if (musicRef.current) {
        musicRef.current.stop();
        musicRef.current.unload();
      }
    };
  }, []);

  // Handle enabled/disabled changes
  useEffect(() => {
    if (!musicRef.current || !isLoaded) return;

    if (enabled) {
      if (!musicRef.current.playing()) {
        musicRef.current.play();
      }
    } else {
      if (musicRef.current.playing()) {
        musicRef.current.pause();
      }
    }
  }, [enabled, isLoaded]);

  // Update volume when changed
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume(volume);
    }
  }, [volume]);

  const play = useCallback(() => {
    if (musicRef.current && !musicRef.current.playing()) {
      musicRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (musicRef.current && musicRef.current.playing()) {
      musicRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.stop();
    }
  }, []);

  const fadeIn = useCallback((duration: number = 2000) => {
    if (musicRef.current) {
      musicRef.current.volume(0);
      musicRef.current.play();
      musicRef.current.fade(0, volume, duration);
    }
  }, [volume]);

  const fadeOut = useCallback((duration: number = 1000) => {
    if (musicRef.current && musicRef.current.playing()) {
      musicRef.current.fade(volume, 0, duration);
      setTimeout(() => {
        if (musicRef.current) {
          musicRef.current.pause();
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
