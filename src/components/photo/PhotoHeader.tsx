// components/photo/PhotoHeader.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, Image, BookOpen, Trash2 } from 'lucide-react';

interface PhotoProps {
  _id: string;
  albumId: string;
  userId: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

interface AlbumProps {
  _id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

interface PhotoHeaderProps {
  photo: PhotoProps;
  album: AlbumProps;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}

const PhotoHeader = ({ photo, album, isOwner, onEdit, onDelete, isEditing }: PhotoHeaderProps) => {
  return (
    <div>
      <Link 
        href={`/home/album/${album._id}`} 
        className="inline-flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Album</span>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-photo-cyan to-photo-indigo rounded-lg p-3 text-photo-secondary">
            <Image className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-medium text-photo-secondary">Photo #{photo._id.substring(0, 4)}</h2>
        </div>
        
        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-photo-secondary/5 hover:bg-photo-secondary/10 text-photo-secondary/80 hover:text-photo-secondary transition-colors"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
            
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-photo-secondary/70">
        <BookOpen className="h-4 w-4" />
        <span>From album: </span>
        <Link 
          href={`/home/album/${album._id}`}
          className="text-photo-indigo hover:underline"
        >
          {album.title}
        </Link>
      </div>
    </div>
  );
};

export default PhotoHeader;