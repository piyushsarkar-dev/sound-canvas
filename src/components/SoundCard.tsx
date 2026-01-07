import { useState } from 'react';
import { Play, Square, Repeat, Volume2, Trash2, Keyboard, SkipBack, SkipForward } from 'lucide-react';
import { SoundFile } from '@/types/audio';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SoundCardProps {
  sound: SoundFile;
  onPlay: () => void;
  onStop: () => void;
  onRemove: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleLoop: () => void;
  onSetHotkey: (hotkey: string) => void;
}

export function SoundCard({
  sound,
  onPlay,
  onStop,
  onRemove,
  onVolumeChange,
  onSeek,
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

  const skipBackward = () => {
    const newTime = Math.max(0, sound.currentTime - 5);
    onSeek(newTime);
  };

  const skipForward = () => {
    const newTime = Math.min(sound.duration, sound.currentTime + 5);
    onSeek(newTime);
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg p-4 transition-all duration-500",
        sound.isPlaying 
          ? "gradient-card-active glow-primary" 
          : "gradient-card hover:border-primary/40"
      )}
    >
      {/* Cyber corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/60" />

      {/* Playing indicator */}
      {sound.isPlaying && (
        <div className="absolute -top-1 -right-1 flex gap-0.5 p-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-3 bg-gradient-to-t from-primary to-accent rounded-full animate-waveform"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate pr-2 text-sm tracking-wider uppercase">
            {sound.name}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {formatDuration(sound.currentTime)} / {formatDuration(sound.duration)}
          </p>
        </div>
        
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Seek Slider */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={skipBackward}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          title="Skip -5s"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <Slider
          value={[sound.currentTime]}
          onValueChange={([t]) => onSeek(t)}
          max={sound.duration || 1}
          step={0.1}
          className="flex-1"
        />
        <button
          onClick={skipForward}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          title="Skip +5s"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Play/Stop Button */}
      <button
        onClick={sound.isPlaying ? onStop : onPlay}
        className={cn(
          "w-full py-2.5 rounded flex items-center justify-center gap-2 font-display font-semibold text-sm tracking-wider uppercase transition-all",
          sound.isPlaying
            ? "bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/30"
            : "bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
        )}
      >
        {sound.isPlaying ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            STOP
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            PLAY
          </>
        )}
      </button>

      {/* Volume Slider */}
      <div className="mt-3 flex items-center gap-2">
        <Volume2 className="w-3.5 h-3.5 text-secondary shrink-0" />
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
            "flex-1 py-1.5 rounded text-xs font-display font-medium flex items-center justify-center gap-1 transition-all tracking-wide uppercase",
            sound.isLooping
              ? "bg-secondary/20 text-secondary border border-secondary/50"
              : "bg-muted text-muted-foreground border border-transparent hover:text-foreground hover:border-border"
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
            "flex-1 py-1.5 rounded text-xs font-display font-medium flex items-center justify-center gap-1 transition-all tracking-wide uppercase",
            isSettingHotkey
              ? "bg-warning/20 text-warning border border-warning ring-1 ring-warning"
              : sound.hotkey
              ? "bg-accent/20 text-accent border border-accent/50"
              : "bg-muted text-muted-foreground border border-transparent hover:text-foreground hover:border-border"
          )}
        >
          <Keyboard className="w-3 h-3" />
          {isSettingHotkey ? "..." : sound.hotkey || "KEY"}
        </button>
      </div>
    </div>
  );
}
