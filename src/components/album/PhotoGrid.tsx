import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { usePhotos } from '@/hooks/usePhotos';

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

interface PhotoGridProps {
  photos: PhotoProps[];
  isOwner: boolean;
}

const PhotoGrid = ({ photos, isOwner }: PhotoGridProps) => {
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const { deletePhoto, isLoading, error } = usePhotos();
  
  // Handle photo deletion
  const handleDeletePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      setDeletingPhotoId(photoId);
      const success = await deletePhoto(photoId as any);
      setDeletingPhotoId(null);
      
      if (!success && error) {
        alert(`Failed to delete photo: ${error}`);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <Link 
          href={`/home/photo/${photo._id}`} 
          key={photo._id} 
          className={`group bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-lg overflow-hidden hover:bg-photo-secondary/10 transition-all ${
            deletingPhotoId === photo._id ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Owner controls */}
            {isOwner && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/home/photo/${photo._id}/edit`}
                  className="p-1.5 rounded-full bg-photo-secondary/80 text-photo-primary hover:bg-photo-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                
                <button
                  onClick={(e) => handleDeletePhoto(photo._id, e)}
                  className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                  disabled={deletingPhotoId === photo._id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="text-sm text-photo-secondary/90 line-clamp-2 group-hover:text-photo-secondary transition-colors">
              {photo.title}
            </h3>
            
            {photo.tags && photo.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {photo.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-photo-secondary/10 text-photo-secondary/70 px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {photo.tags.length > 2 && (
                  <span className="text-xs text-photo-secondary/40">
                    +{photo.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PhotoGrid;