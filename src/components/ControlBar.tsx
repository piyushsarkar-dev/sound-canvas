import { Volume2, VolumeX, Square, Settings } from 'lucide-react';
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
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-gradient">SoundBoard</h1>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              <span>{soundCount} sounds</span>
              {playingCount > 0 && (
                <span className="flex items-center gap-1 text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {playingCount} playing
                </span>
              )}
            </div>
          </div>

          {/* Center: Master Volume */}
          <div className="flex-1 max-w-xs hidden md:flex items-center gap-3">
            <button
              onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
              className={cn(
                "p-2 rounded-md transition-colors",
                settings.isMuted
                  ? "bg-destructive/20 text-destructive"
                  : "bg-secondary text-foreground"
              )}
            >
              {settings.isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            
            <Slider
              value={[settings.masterVolume]}
              onValueChange={([v]) => onUpdateSettings({ masterVolume: v })}
              max={100}
              step={1}
              className="flex-1"
              disabled={settings.isMuted}
            />
            
            <span className="text-sm font-mono text-muted-foreground w-10 text-right">
              {settings.masterVolume}%
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onStopAll}
              disabled={playingCount === 0}
              className={cn(
                "px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all",
                playingCount > 0
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              <Square className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Stop All</span>
            </button>
            
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
