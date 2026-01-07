import { Volume2, VolumeX, Square, Settings, Zap, AudioWaveform } from 'lucide-react';
import { AudioSettings } from '@/types/audio';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ControlBarProps {
  settings: AudioSettings;
  soundCount: number;
  playingCount: number;
  onUpdateSettings: (settings: Partial<AudioSettings>) => void;
  onStopAll: () => void;
  onOpenSettings: () => void;
}

export function ControlBar({
  settings,
  soundCount,
  playingCount,
  onUpdateSettings,
  onStopAll,
  onOpenSettings,
}: ControlBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      {/* Top neon line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <AudioWaveform className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 blur-lg bg-primary/30" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-[0.2em] text-gradient uppercase">
                SYNTHWAVE
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest -mt-0.5">
                SOUNDBOARD v2.0
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted/50 border border-border">
              <span className="text-muted-foreground">LOADED</span>
              <span className="text-primary font-bold">{soundCount}</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded border transition-all",
              playingCount > 0 
                ? "bg-primary/10 border-primary/50 text-primary" 
                : "bg-muted/50 border-border text-muted-foreground"
            )}>
              <Zap className={cn("w-3 h-3", playingCount > 0 && "animate-pulse")} />
              <span>ACTIVE</span>
              <span className="font-bold">{playingCount}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Master Volume */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-muted/30 border border-border">
              <button
                onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
                className={cn(
                  "p-1 rounded transition-all",
                  settings.isMuted 
                    ? "text-destructive hover:text-destructive/80" 
                    : "text-primary hover:text-primary/80"
                )}
              >
                {settings.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <Slider
                value={[settings.masterVolume]}
                onValueChange={([v]) => onUpdateSettings({ masterVolume: v })}
                max={100}
                step={1}
                className="w-24"
              />
              <span className="text-xs font-mono text-muted-foreground w-8">
                {settings.masterVolume}%
              </span>
            </div>

            {/* Stop All */}
            <button
              onClick={onStopAll}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded font-display font-semibold text-xs tracking-wider uppercase transition-all border",
                playingCount > 0
                  ? "bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30 animate-pulse-glow"
                  : "bg-muted text-muted-foreground border-border hover:text-foreground"
              )}
            >
              <Square className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">STOP ALL</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded text-muted-foreground hover:text-primary border border-transparent hover:border-primary/50 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-primary/50 via-accent/50 to-secondary/50" />
    </header>
  );
}
