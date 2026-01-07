import { X, Volume2, Keyboard, Info, Cpu, Cable } from 'lucide-react';
import { AudioSettings } from '@/types/audio';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: AudioSettings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AudioSettings>) => void;
}

export function SettingsPanel({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}: SettingsPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md z-50 border-l border-primary/30",
          "bg-gradient-to-b from-card to-background",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Neon edge */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-secondary" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg tracking-wider uppercase text-gradient">
              SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Master Volume */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold tracking-wider uppercase text-sm">
                MASTER VOLUME
              </h3>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border">
              <Slider
                value={[settings.masterVolume]}
                onValueChange={([v]) => onUpdateSettings({ masterVolume: v })}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="font-mono text-sm text-primary w-12 text-right">
                {settings.masterVolume}%
              </span>
            </div>
          </section>

          {/* Virtual Mic */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Cable className="w-4 h-4 text-secondary" />
              <h3 className="font-display font-semibold tracking-wider uppercase text-sm">
                VIRTUAL MICROPHONE
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30 space-y-3">
              <p className="text-sm text-muted-foreground">
                Route audio to Discord, games, or voice chat:
              </p>
              <ol className="text-xs text-muted-foreground space-y-2 font-mono">
                <li className="flex gap-2">
                  <span className="text-secondary">01.</span>
                  Install VB-CABLE or VoiceMeeter Banana
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">02.</span>
                  Set "CABLE Input" as default playback
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">03.</span>
                  Select "CABLE Output" in Discord/app
                </li>
              </ol>
              <a
                href="https://vb-audio.com/Cable/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-secondary hover:text-secondary/80 font-mono transition-colors"
              >
                → Download VB-CABLE
              </a>
            </div>
          </section>

          {/* Hotkeys */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-accent" />
              <h3 className="font-display font-semibold tracking-wider uppercase text-sm">
                KEYBOARD SHORTCUTS
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Play/Stop Sound</span>
                <span className="text-accent">Assigned Key</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Set Hotkey</span>
                <span className="text-accent">Click "KEY" → Press</span>
              </div>
            </div>
          </section>

          {/* Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-display font-semibold tracking-wider uppercase text-sm text-muted-foreground">
                SYSTEM INFO
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-muted/20 border border-border space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between">
                <span>Engine</span>
                <span>Web Audio API</span>
              </div>
              <div className="flex justify-between">
                <span>Formats</span>
                <span>MP3, WAV, OGG, M4A, FLAC</span>
              </div>
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-primary">v2.0.0</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
