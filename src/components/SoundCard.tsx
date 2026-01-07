import { useState } from 'react';
import { Play, Square, Repeat, Volume2, Trash2, Keyboard } from 'lucide-react';
import { SoundFile } from '@/types/audio';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SoundCardProps {
  sound: SoundFile;
  onPlay: () => void;
  onStop: () => void;
  onRemove: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleLoop: () => void;
  onSetHotkey: (hotkey: string) => void;
}

export function SoundCard({
  sound,
  onPlay,
  onStop,
  onRemove,
  onVolumeChange,
  onToggleLoop,
  onSetHotkey,
}: SoundCardProps) {
  const [isSettingHotkey, setIsSettingHotkey] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleHotkeyCapture = (e: React.KeyboardEvent) => {
    if (isSettingHotkey) {
      e.preventDefault();
      onSetHotkey(e.key.toUpperCase());
      setIsSettingHotkey(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative gradient-card rounded-lg border border-border p-4 transition-all duration-300",
        "hover:border-primary/50 hover:shadow-glow",
        sound.isPlaying && "border-primary glow-primary"
      )}
    >
      {/* Playing indicator */}
      {sound.isPlaying && (
        <div className="absolute -top-1 -right-1 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-4 bg-primary rounded-full animate-waveform"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate pr-2">
            {sound.name}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {formatDuration(sound.duration)}
          </p>
        </div>
        
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Play/Stop Button */}
      <button
        onClick={sound.isPlaying ? onStop : onPlay}
        className={cn(
          "w-full py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all",
          sound.isPlaying
            ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
            : "bg-primary/20 text-primary hover:bg-primary/30"
        )}
      >
        {sound.isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Play
          </>
        )}
      </button>

      {/* Volume Slider */}
      <div className="mt-4 flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <Slider
          value={[sound.volume]}
          onValueChange={([v]) => onVolumeChange(v)}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right font-mono">
          {sound.volume}%
        </span>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onToggleLoop}
          className={cn(
            "flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all",
            sound.isLooping
              ? "bg-accent/20 text-accent"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <Repeat className="w-3 h-3" />
          Loop
        </button>
        
        <button
          onClick={() => setIsSettingHotkey(true)}
          onKeyDown={handleHotkeyCapture}
          onBlur={() => setIsSettingHotkey(false)}
          className={cn(
            "flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all",
            isSettingHotkey
              ? "bg-warning/20 text-warning ring-2 ring-warning"
              : sound.hotkey
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <Keyboard className="w-3 h-3" />
          {isSettingHotkey ? "Press key..." : sound.hotkey || "Hotkey"}
        </button>
      </div>
    </div>
  );
}
