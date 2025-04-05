import React from 'react';
import Link from 'next/link';
import { Image } from 'lucide-react';

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
}

interface AlbumsListProps {
  albums: AlbumProps[];
}

const AlbumsList = ({ albums }: AlbumsListProps) => {
  // Generate a random pastel color for each album
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 80%, 0.2)`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((album) => {
        const bgColor = getRandomPastelColor();
        
        return (
          <Link 
            href={`/home/album/${album.id}`} 
            key={album.id} 
            className="group bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-xl overflow-hidden hover:bg-photo-secondary/10 transition-all"
          >
            <div 
              className="h-40 flex items-center justify-center p-4" 
              style={{ backgroundColor: bgColor }}
            >
              <Image className="h-16 w-16 text-photo-secondary opacity-50 group-hover:scale-110 transition-transform" />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-photo-secondary line-clamp-2">
                {album.title.charAt(0).toUpperCase() + album.title.slice(1)}
              </h3>
              <p className="text-photo-secondary/60 text-sm mt-2">
                Album #{album.id}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AlbumsList;