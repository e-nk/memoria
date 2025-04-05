import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Image, User } from 'lucide-react';

interface UserProps {
  id: number;
  name: string;
  username: string;
}

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
  user?: UserProps;
}

interface AlbumHeaderProps {
  album: AlbumProps;
  photoCount: number;
}

const AlbumHeader = ({ album, photoCount }: AlbumHeaderProps) => {
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
            <div>
              <h1 className="text-2xl font-bold text-photo-secondary">
                {album.title.charAt(0).toUpperCase() + album.title.slice(1)}
              </h1>
              <p className="text-photo-secondary/70">Album #{album.id}</p>
            </div>
            
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
