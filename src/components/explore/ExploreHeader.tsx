import React from 'react';
import { Search } from 'lucide-react';

const ExploreHeader = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-photo-secondary">
          Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">Photos</span>
        </h1>
        <p className="text-photo-secondary/70 mt-2">
          Discover amazing photos from our community
        </p>
      </div>
      
      <div className="relative max-w-lg">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-photo-secondary/50">
          <Search className="h-5 w-5" />
        </div>
        <input 
          type="text"
          placeholder="Search photos by title or description..."
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-photo-primary border border-photo-secondary/20 text-photo-secondary focus:border-photo-indigo focus:outline-none focus:ring-1 focus:ring-photo-indigo"
        />
      </div>
    </div>
  );
};

export default ExploreHeader;