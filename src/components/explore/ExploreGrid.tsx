import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PhotoProps {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface ExploreGridProps {
  photos: PhotoProps[];
}

const ExploreGrid = ({ photos }: ExploreGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <Link 
          href={`/home/photo/${photo.id}`} 
          key={photo.id} 
          className="group bg-photo-secondary/5 backdrop-blur-sm border border-photo-secondary/10 rounded-lg overflow-hidden hover:bg-photo-secondary/10 transition-all"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <div className="p-3">
            <h3 className="text-sm text-photo-secondary/90 line-clamp-1 group-hover:text-photo-secondary transition-colors">
              {photo.title.charAt(0).toUpperCase() + photo.title.slice(1)}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ExploreGrid;