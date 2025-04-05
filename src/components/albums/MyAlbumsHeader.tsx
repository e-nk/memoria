import React from 'react';
import { PlusCircle, DiscAlbum } from 'lucide-react';

interface MyAlbumsHeaderProps {
  userName: string;
  albumCount: number;
  onCreateAlbum: () => void;
}

const MyAlbumsHeader = ({ userName, albumCount, onCreateAlbum }: MyAlbumsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-photo-secondary">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">
            {userName}'s
          </span> Albums
        </h1>
        <p className="text-photo-secondary/70">
          Manage and browse your photo albums
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-photo-secondary/5 backdrop-blur-sm rounded-lg">
          <DiscAlbum className="h-5 w-5 text-photo-secondary/70" />
          <span className="text-photo-secondary font-medium">{albumCount} Album{albumCount !== 1 ? 's' : ''}</span>
        </div>
        
        <button 
          onClick={onCreateAlbum}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Album</span>
        </button>
      </div>
    </div>
  );
};

export default MyAlbumsHeader;