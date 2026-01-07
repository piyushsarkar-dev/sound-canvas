import { useState, useCallback, useRef, useEffect } from 'react';
import { SoundFile, AudioSettings } from '@/types/audio';

export function useAudioEngine() {
  const [sounds, setSounds] = useState<SoundFile[]>([]);
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 80,
    isMuted: false,
    selectedOutputDevice: 'default',
  });
  
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const addSound = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    return new Promise<SoundFile>((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        const sound: SoundFile = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          file,
          url,
          duration: audio.duration,
          volume: 100,
          isPlaying: false,
          isLooping: false,
        };
        
        setSounds(prev => [...prev, sound]);
        resolve(sound);
      });
    });
  }, []);

  const removeSound = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
      audio.src = '';
      audioRefs.current.delete(id);
    }
    
    setSounds(prev => {
      const sound = prev.find(s => s.id === id);
      if (sound) {
        URL.revokeObjectURL(sound.url);
      }
      return prev.filter(s => s.id !== id);
    });
  }, []);

  const playSound = useCallback((id: string) => {
    const sound = sounds.find(s => s.id === id);
    if (!sound || settings.isMuted) return;

    let audio = audioRefs.current.get(id);
    
    if (!audio) {
      audio = new Audio(sound.url);
      audioRefs.current.set(id, audio);
    }

    audio.currentTime = 0;
    audio.volume = (sound.volume / 100) * (settings.masterVolume / 100);
    audio.loop = sound.isLooping;
    
    audio.play().catch(console.error);
    
    setSounds(prev => prev.map(s => 
      s.id === id ? { ...s, isPlaying: true } : s
    ));

    audio.onended = () => {
      if (!sound.isLooping) {
        setSounds(prev => prev.map(s => 
          s.id === id ? { ...s, isPlaying: false } : s
        ));
      }
    };
  }, [sounds, settings.isMuted, settings.masterVolume]);

  const stopSound = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setSounds(prev => prev.map(s => 
      s.id === id ? { ...s, isPlaying: false } : s
    ));
  }, []);

  const stopAllSounds = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setSounds(prev => prev.map(s => ({ ...s, isPlaying: false })));
  }, []);

  const setSoundVolume = useCallback((id: string, volume: number) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.volume = (volume / 100) * (settings.masterVolume / 100);
    }
    
    setSounds(prev => prev.map(s => 
      s.id === id ? { ...s, volume } : s
    ));
  }, [settings.masterVolume]);

  const toggleLoop = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    
    setSounds(prev => prev.map(s => {
      if (s.id === id) {
        const newLooping = !s.isLooping;
        if (audio) {
          audio.loop = newLooping;
        }
        return { ...s, isLooping: newLooping };
      }
      return s;
    }));
  }, []);

  const setHotkey = useCallback((id: string, hotkey: string) => {
    setSounds(prev => prev.map(s => 
      s.id === id ? { ...s, hotkey } : s
    ));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Update all audio volumes when master volume changes
      if (newSettings.masterVolume !== undefined) {
        audioRefs.current.forEach((audio, id) => {
          const sound = sounds.find(s => s.id === id);
          if (sound) {
            audio.volume = (sound.volume / 100) * (updated.masterVolume / 100);
          }
        });
      }
      
      // Mute/unmute all audio
      if (newSettings.isMuted !== undefined) {
        audioRefs.current.forEach((audio) => {
          audio.muted = updated.isMuted;
        });
      }
      
      return updated;
    });
  }, [sounds]);

  // Keyboard hotkey handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      const key = e.key.toUpperCase();
      const sound = sounds.find(s => s.hotkey?.toUpperCase() === key);
      
      if (sound) {
        e.preventDefault();
        if (sound.isPlaying) {
          stopSound(sound.id);
        } else {
          playSound(sound.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sounds, playSound, stopSound]);

  return {
    sounds,
    settings,
    addSound,
    removeSound,
    playSound,
    stopSound,
    stopAllSounds,
    setSoundVolume,
    toggleLoop,
    setHotkey,
    updateSettings,
  };
}
