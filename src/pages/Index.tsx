import { useState, useMemo } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { SoundCard } from '@/components/SoundCard';
import { ControlBar } from '@/components/ControlBar';
import { DropZone } from '@/components/DropZone';
import { SettingsPanel } from '@/components/SettingsPanel';

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    sounds,
    settings,
    addSound,
    removeSound,
    playSound,
    stopSound,
    stopAllSounds,
    setSoundVolume,
    seekSound,
    toggleLoop,
    setHotkey,
    updateSettings,
  } = useAudioEngine();

  const playingCount = useMemo(
    () => sounds.filter(s => s.isPlaying).length,
    [sounds]
  );

  const handleFilesAdded = async (files: File[]) => {
    for (const file of files) {
      await addSound(file);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ControlBar
        settings={settings}
        soundCount={sounds.length}
        playingCount={playingCount}
        onUpdateSettings={updateSettings}
        onStopAll={stopAllSounds}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {sounds.length === 0 ? (
          <div className="max-w-xl mx-auto animate-fade-in">
            <DropZone onFilesAdded={handleFilesAdded} />
            
            {/* Decorative elements */}
            <div className="mt-12 text-center space-y-4">
              <div className="neon-line max-w-xs mx-auto" />
              <p className="font-mono text-xs text-muted-foreground tracking-widest">
                READY TO LOAD AUDIO FILES
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add more sounds button */}
            <div className="flex justify-end">
              <DropZone onFilesAdded={handleFilesAdded} compact />
            </div>

            {/* Sound Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sounds.map((sound, index) => (
                <div
                  key={sound.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SoundCard
                    sound={sound}
                    onPlay={() => playSound(sound.id)}
                    onStop={() => stopSound(sound.id)}
                    onRemove={() => removeSound(sound.id)}
                    onVolumeChange={(v) => setSoundVolume(sound.id, v)}
                    onSeek={(t) => seekSound(sound.id, t)}
                    onToggleLoop={() => toggleLoop(sound.id)}
                    onSetHotkey={(h) => setHotkey(sound.id, h)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
};

export default Index;
