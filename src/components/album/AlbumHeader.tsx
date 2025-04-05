import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Image, User, Globe, Lock, Plus, Pencil, Trash2 } from 'lucide-react';

interface UserProps {
  id: string;
  name: string;
  username: string;
}

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
  user?: UserProps;
}

interface AlbumHeaderProps {
  album: AlbumProps;
  photoCount: number;
  isOwner: boolean;
  onAddPhoto?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AlbumHeader = ({ 
  album, 
  photoCount, 
  isOwner, 
  onAddPhoto,
  onEdit,
  onDelete 
}: AlbumHeaderProps) => {
  return (
    <div>
      <Link 
        href={album.user ? `/home/user/${album.user.id}` : '/home'} 
        className="inline-flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {album.user ? `${album.user.name}'s Albums` : 'Home'}</span>
      </Link>

      <div className="bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-gradient-to-br from-photo-blue to-photo-pink rounded-xl p-6 text-photo-secondary">
            <Image className="h-12 w-12" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-photo-secondary">
                    {album.title}
                  </h1>
                  <div className="rounded-full px-2 py-1 text-xs flex items-center gap-1 bg-photo-secondary/10">
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
                </div>
                {album.category && (
                  <p className="text-photo-secondary/60 text-sm">
                    Category: {album.category}
                  </p>
                )}
              </div>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  {onAddPhoto && (
                    <button
                      onClick={onAddPhoto}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary text-sm hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Photos</span>
                    </button>
                  )}
                  
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-photo-secondary/10 text-photo-secondary/70 hover:text-photo-secondary hover:bg-photo-secondary/20 text-sm transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {album.description && (
              <p className="text-photo-secondary/80">
                {album.description}
              </p>
            )}
            
            {album.user && (
              <div className="flex items-center gap-2 text-photo-secondary/80">
                <User className="h-4 w-4" />
                <Link 
                  href={`/home/user/${album.user.id}`}
                  className="hover:text-photo-indigo transition-colors"
                >
                  {album.user.name} (@{album.user.username})
                </Link>
              </div>
            )}
            
            <div className="pt-2 mt-2 border-t border-photo-secondary/10">
              <div className="flex items-center gap-2 text-photo-secondary">
                <Image className="h-5 w-5" />
                <span className="font-semibold">{photoCount} Photo{photoCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumHeader;