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
    <div className="min-h-screen bg-background">
      <ControlBar
        settings={settings}
        soundCount={sounds.length}
        playingCount={playingCount}
        onUpdateSettings={updateSettings}
        onStopAll={stopAllSounds}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="container mx-auto px-4 py-6">
        {sounds.length === 0 ? (
          <div className="max-w-xl mx-auto animate-fade-in">
            <DropZone onFilesAdded={handleFilesAdded} />
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
