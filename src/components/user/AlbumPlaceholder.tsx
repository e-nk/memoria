import React from 'react';
import { Image } from 'lucide-react';

interface AlbumPlaceholderProps {
  backgroundColor?: string;
  text?: string;
}

const AlbumPlaceholder = ({ backgroundColor = 'rgba(255, 255, 255, 0.05)', text }: AlbumPlaceholderProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ backgroundColor }}
    >
      <Image className="h-10 w-10 text-photo-secondary/30" />
      {text && (
        <p className="mt-2 text-xs text-photo-secondary/50 text-center px-4">
          {text}
        </p>
      )}
    </div>
  );
};

export default AlbumPlaceholder;