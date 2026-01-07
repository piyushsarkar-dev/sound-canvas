import { useCallback, useState } from 'react';
import { Upload, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  compact?: boolean;
}

export function DropZone({ onFilesAdded, compact = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('audio/') || 
      ['.mp3', '.wav', '.ogg', '.m4a', '.flac'].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );

    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    e.target.value = '';
  }, [onFilesAdded]);

  if (compact) {
    return (
      <label
        className={cn(
          "cursor-pointer px-4 py-2 rounded-lg border-2 border-dashed transition-all flex items-center gap-2",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-secondary"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Add Sounds</span>
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
    );
  }

  return (
    <label
      className={cn(
        "cursor-pointer block w-full rounded-xl border-2 border-dashed transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all",
          isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-secondary text-muted-foreground"
        )}>
          {isDragging ? (
            <Music className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {isDragging ? "Drop your sounds here" : "Add your sounds"}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Drag and drop audio files here, or click to browse.
          <br />
          <span className="text-xs">Supports MP3, WAV, OGG, M4A, FLAC</span>
        </p>
      </div>
      
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
    </label>
  );
}
