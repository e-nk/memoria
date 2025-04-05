import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, Image, BookOpen } from 'lucide-react';

interface AlbumProps {
  id: number;
  title: string;
  userId: number;
}

interface PhotoProps {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  album?: AlbumProps;
}

interface PhotoHeaderProps {
  photo: PhotoProps;
  onEdit: () => void;
  isEditing: boolean;
}

const PhotoHeader = ({ photo, onEdit, isEditing }: PhotoHeaderProps) => {
  return (
    <div>
      <Link 
        href={photo.album ? `/home/album/${photo.album.id}` : '/home'} 
        className="inline-flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {photo.album ? `Album` : 'Home'}</span>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-photo-cyan to-photo-indigo rounded-lg p-3 text-photo-secondary">
            <Image className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-medium text-photo-secondary">Photo #{photo.id}</h2>
        </div>
        
        {!isEditing && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-photo-secondary/5 hover:bg-photo-secondary/10 text-photo-secondary/80 hover:text-photo-secondary transition-colors"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Title</span>
          </button>
        )}
      </div>

      {photo.album && (
        <div className="mt-4 flex items-center gap-2 text-photo-secondary/70">
          <BookOpen className="h-4 w-4" />
          <span>From album: </span>
          <Link 
            href={`/home/album/${photo.album.id}`}
            className="text-photo-indigo hover:underline"
          >
            {photo.album.title}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PhotoHeader;