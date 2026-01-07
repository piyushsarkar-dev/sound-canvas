import { X, Info, ExternalLink } from 'lucide-react';
import { AudioSettings } from '@/types/audio';
import { Slider } from '@/components/ui/slider';

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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Volume */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Master Volume
              </label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[settings.masterVolume]}
                  onValueChange={([v]) => onUpdateSettings({ masterVolume: v })}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-mono text-muted-foreground w-12 text-right">
                  {settings.masterVolume}%
                </span>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Virtual Microphone Setup
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    To route sounds to Discord/games, you'll need:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Install VB-CABLE Virtual Audio Device</li>
                    <li>Set browser audio output to CABLE Input</li>
                    <li>Use VoiceMeeter to mix with your real mic</li>
                    <li>Select VoiceMeeter Output as mic in apps</li>
                  </ol>
                  <a
                    href="https://vb-audio.com/Cable/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                  >
                    Download VB-CABLE
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Play/Stop Sound</span>
                  <kbd className="px-2 py-0.5 rounded bg-secondary font-mono text-xs">
                    Assigned Key
                  </kbd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Set Hotkey</span>
                  <span className="text-xs">Click "Hotkey" on card, then press a key</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-secondary p-4">
              <h4 className="font-medium text-foreground mb-2">Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Drag and drop multiple files at once</li>
                <li>• Use hotkeys for quick access during calls</li>
                <li>• Loop option is great for ambient sounds</li>
                <li>• Individual volume controls won't affect master</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
