import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Globe, Lock, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAlbums } from '@/hooks/useAlbums';

interface AlbumProps {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  isPublic: boolean;
  coverPhotoId?: string;
  createdAt: number;
  updatedAt: number;
}

interface AlbumsListProps {
  albums: AlbumProps[];
  isOwner?: boolean;
}

const AlbumsList = ({ albums, isOwner = false }: AlbumsListProps) => {
  const [deletingAlbumId, setDeletingAlbumId] = useState<string | null>(null);
  const { deleteAlbum, isLoading, error } = useAlbums();
  
  // Handle album deletion
  const handleDeleteAlbum = async (albumId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this album? All photos in this album will also be deleted. This action cannot be undone.')) {
      setDeletingAlbumId(albumId);
      const success = await deleteAlbum(albumId as any);
      setDeletingAlbumId(null);
      
      if (!success && error) {
        alert(`Failed to delete album: ${error}`);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((album) => {
        // Use a custom AlbumCard component that handles fetching album photos
        return (
          <AlbumCard 
            key={album._id}
            album={album}
            isOwner={isOwner}
            isDeleting={deletingAlbumId === album._id}
            onDelete={(e) => handleDeleteAlbum(album._id, e)}
          />
        );
      })}
    </div>
  );
};

// Separated into its own component to handle photo fetching per album
const AlbumCard = ({ album, isOwner, isDeleting, onDelete }) => {
  // Fetch a few photos from this album to display as preview
  const photosData = useQuery(
    api.photos.getPhotosByAlbum, 
    { albumId: album._id, limit: 4 }
  );
  const photos = photosData?.items || [];
  
  // Generate a random but consistent pastel color for album with no photos
  const getConsistentPastelColor = (albumId: string) => {
    // Use a simple hash of the album ID to get a consistent hue
    const hash = albumId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const hue = hash % 360;
    return `hsla(${hue}, 70%, 80%, 0.2)`;
  };
  
  const bgColor = getConsistentPastelColor(album._id);
  
  return (
    <Link 
      href={`/home/album/${album._id}`} 
      className={`group bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl overflow-hidden hover:bg-photo-secondary/10 transition-all ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="h-40 relative overflow-hidden">
        {photos && photos.length > 0 ? (
          // Display preview photos
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px">
            {photos.slice(0, Math.min(4, photos.length)).map((photo, index) => (
              <div key={photo._id} className="relative overflow-hidden bg-photo-darkgray/30">
                <Image
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
            
            {/* If less than 4 photos, fill the rest with colored divs */}
            {Array.from({ length: Math.max(0, 4 - photos.length) }).map((_, index) => (
              <div 
                key={`placeholder-${index}`}
                className="bg-photo-darkgray/30"
                style={{ 
                  backgroundColor: bgColor,
                  opacity: 0.7 - (index * 0.1) 
                }}
              />
            ))}
          </div>
        ) : (
          // Placeholder for albums with no photos
          <div 
            className="flex items-center justify-center w-full h-full" 
            style={{ backgroundColor: bgColor }}
          >
            <div className="text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-photo-secondary/30" />
              <p className="mt-2 text-xs text-photo-secondary/50">
                {isOwner ? "Add photos to this album" : "No photos yet"}
              </p>
            </div>
          </div>
        )}
        
        {/* Album privacy indicator */}
        <div className="absolute top-2 right-2 rounded-full px-2 py-1 text-xs flex items-center gap-1 bg-photo-primary/40 backdrop-blur-sm">
          {album.isPublic ? (
            <>
              <Globe className="h-3 w-3 text-photo-secondary/70" />
              <span className="text-photo-secondary/70">Public</span>
            </>
          ) : (
            <>
              <Lock className="h-3 w-3 text-photo-secondary/70" />
              <span className="text-photo-secondary/70">Private</span>
            </>
          )}
        </div>
        
        {/* Owner controls */}
        {isOwner && (
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/home/album/${album._id}/edit`}
              className="p-1.5 rounded-full bg-photo-secondary/80 text-photo-primary hover:bg-photo-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            
            <button
              onClick={onDelete}
              className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500"
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-photo-secondary line-clamp-2">
          {album.title}
        </h3>
        
        {album.description && (
          <p className="text-photo-secondary/60 text-sm mt-2 line-clamp-2">
            {album.description}
          </p>
        )}
        
        {album.category && (
          <div className="mt-2">
            <span className="text-xs bg-photo-secondary/10 text-photo-secondary/70 px-1.5 py-0.5 rounded">
              {album.category}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-photo-secondary/60 text-xs">
            Created {new Date(album.createdAt).toLocaleDateString()}
          </p>
          
          <p className="text-photo-secondary/60 text-xs">
            {photos ? photos.length : 0} photo{(photos?.length !== 1) ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumsList;