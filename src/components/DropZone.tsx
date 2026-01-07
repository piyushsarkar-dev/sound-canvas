import { useState, useCallback } from 'react';
import { Upload, Music, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  compact?: boolean;
}

const ACCEPTED_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

export function DropZone({ onFilesAdded, compact = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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
      ACCEPTED_FORMATS.some(format => file.name.toLowerCase().endsWith(format))
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
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex items-center gap-2 px-4 py-2 rounded font-display font-semibold text-xs tracking-wider uppercase bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          ADD SOUNDS
        </div>
      </label>
    );
  }

  return (
    <label
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="block cursor-pointer"
    >
      <input
        type="file"
        multiple
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />
      <div
        className={cn(
          "relative rounded-xl p-12 text-center transition-all duration-300 overflow-hidden",
          "border-2 border-dashed",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02] glow-primary"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        {/* Hexagon pattern background */}
        <div className="absolute inset-0 hexagon-pattern opacity-50" />
        
        {/* Animated border */}
        {isDragging && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,hsl(var(--primary)),transparent)] animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-[2px] rounded-xl bg-background" />
          </div>
        )}

        <div className="relative space-y-4">
          <div className={cn(
            "mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all",
            isDragging
              ? "bg-primary/20 text-primary scale-110"
              : "bg-muted text-muted-foreground"
          )}>
            {isDragging ? (
              <Music className="w-10 h-10 animate-bounce" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>

          <div>
            <h3 className="font-display font-bold text-xl tracking-wide text-gradient uppercase">
              {isDragging ? 'DROP IT!' : 'UPLOAD AUDIO'}
            </h3>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              {isDragging
                ? 'Release to add your sounds'
                : 'Drag & drop audio files or click to browse'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {ACCEPTED_FORMATS.map((format) => (
              <span
                key={format}
                className="px-2 py-1 text-xs font-mono text-primary/80 bg-primary/10 rounded border border-primary/30"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </label>
  );
}
