export interface SoundFile {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  currentTime: number;
  hotkey?: string;
  volume: number;
  isPlaying: boolean;
  isLooping: boolean;
}

export interface AudioSettings {
  masterVolume: number;
  isMuted: boolean;
  selectedOutputDevice: string;
}
